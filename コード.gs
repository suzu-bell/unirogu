//ハブミニ
function getJSON_SwitchBotHubMini() {
  var token =     "2ca57ed92113ac20e261445ffb54db19fa364a9d642f228f34dab7fc5b2b5cc7bd63af67e1898a4ee1da25bb730b598c";
  var headers = {"Authorization":token};
  var options = {
    "headers" : headers,
  };

//うに
  var deviceID ="D7D43955DC93";
  var url_u = "https://api.switch-bot.com/v1.0/devices/" + "D7D43955DC93" + "/status"; 
  var data_u = UrlFetchApp.fetch(url_u,options);

  var datajson_u=JSON.parse(data_u.getContentText());  
  var temp_u = datajson_u['body']['temperature']; 
  var rhumidity_u = datajson_u['body']['humidity']; 
  var rhumidity_u = rhumidity_u/100;  

//いくら
  var deviceID ="E7C27BA381EC";
  var url_i = "https://api.switch-bot.com/v1.0/devices/" + "E7C27BA381EC" + "/status"; 
  var data_i = UrlFetchApp.fetch(url_i,options);

  var datajson_i=JSON.parse(data_i.getContentText());  
  var temp_i = datajson_i['body']['temperature']; 
  var rhumidity_i = datajson_i['body']['humidity']; 
  var rhumidity_i = rhumidity_i/100;  


//スプレッドシート取得
  var sheet_id ="1_GqUrLxT6DBFyem91w0an20pzMBU0rMmZN9asSXMzG0";
  var spreadsheet = SpreadsheetApp.openById(sheet_id); 
  var sheet = spreadsheet.getSheets()[0]; 
  var date = new Date(); 
 
// データ入力 
  var sheet_header = [['date','temp uni','rhumidity uni','temp ikura','rhumidity ikura']]; 
  sheet.getRange(1, 1, sheet_header.length, sheet_header[0].length).setValues;
  sheet.appendRow([date,temp_u, rhumidity_u,temp_i, rhumidity_i]); 
}


//データ消去
function del() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SwitchBot');
  sheet.deleteRows(2,61);
}


//LINE
function doPost(e) {

  let token = "pGSdulkFD4MjEPfGUvWVdLpG+8hxe8H5eTd0ufNct9qNnq1hfirad7BvU0Q4eF7yBjVYLiaFcbjFFFDRYfYUAWnINManDppnGRCNcaznKXSwt11T+Z68XxW4QDFt1Vx1AqSidUoNUknT5jDSMjgxlgdB04t89/1O/w1cDnyilFU=";
  let eventData = JSON.parse(e.postData.contents).events[0];
  let replyToken = eventData.replyToken;
  let userMessage = eventData.message.text;
  let url = "https://api.line.me/v2/bot/message/reply";

//レオパ
  if(userMessage === "レオパ"){
    getJSON_SwitchBotHubMini();
   
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const sheet = ss.getSheetByName("SwitchBot");
    
    const lastRow = sheet.getLastRow();
    
    const range = sheet.getRange("B"+lastRow+":E"+lastRow);
   
    var values = range.getValues();
    
    const temperature_u = "温度：" + values[0][0] + "℃";
    const humidity_u = "湿度：" + Math.floor(values[0][1] *1000)/10 + "%";
    
    const temperature_i = "温度：" + values[0][2] + "℃";
    const humidity_i = "湿度：" + Math.floor(values[0][3] *1000)/10 + "%";
    
    
    let replyMessage = "うに\n" +temperature_u + "\n" + humidity_u + "\nいくら\n" + temperature_i + "\n" + humidity_i;

    let payload = {
      'replyToken': replyToken,
      'messages': [{
          'type': 'text',
          'text': replyMessage
      }]
    };
    
    let options = {
        'payload' : JSON.stringify(payload),
        'myamethod'  : 'POST',
        'headers' : {"Authorization" : "Bearer " + token},
        'contentType' : 'application/json'
    };
      
    UrlFetchApp.fetch(url, options);


//うに
  } else if(userMessage.match(/^\うに/)) {

    var date = new Date();
    var today = Utilities.formatDate( date, "JST", "yyyy/MM/dd hh:mm");
    

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const sheet = ss.getSheetByName("うに記録");
    
    const lastRow = sheet.getLastRow();

    const messageParameter = userMessage.split(/\r\n|\n/);
    sheet.getRange('A' + (lastRow + 1)).setValue(today);
    sheet.getRange('B' + (lastRow + 1)).setValue(messageParameter[1]);
    sheet.getRange('C' + (lastRow + 1)).setValue(messageParameter[2]);
    sheet.getRange('D' + (lastRow + 1)).setValue(messageParameter[3]);
    sheet.getRange('E' + (lastRow + 1)).setValue(messageParameter[4]);
    

    const ss2 = SpreadsheetApp.getActiveSpreadsheet();
    
    const sheet2 = ss2.getSheetByName("うに記録");
    
    const lastRow2 = sheet2.getLastRow();
    
    const range = sheet.getRange("A"+lastRow2+":E"+lastRow2);
   
    var values = range.getValues();
    
    const shit = "うんこ："　+ values[0][1];
    const food = "フード："　+ values[0][2];
    const crickets = "コオロギ："　+ values[0][3];

    let replyMessage = today + "\n" + shit + "\n" + food + "\n" +crickets　+ "\n登録しました。";

    let payload = {
      'replyToken': replyToken,
      'messages': [{
          'type': 'text',
          'text': replyMessage
      }]
  };
    
  let options = {
      'payload' : JSON.stringify(payload),
      'myamethod'  : 'POST',
      'headers' : {"Authorization" : "Bearer " + token},
      'contentType' : 'application/json'
  };
    
  UrlFetchApp.fetch(url, options);
  
  //いくら
  } else if(userMessage.match(/^\いくら/)) {

    var date = new Date();
    var today = Utilities.formatDate( date, "JST", "yyyy/MM/dd hh:mm");
    

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const sheet = ss.getSheetByName("いくら記録");
    
    const lastRow = sheet.getLastRow();

    const messageParameter = userMessage.split(/\r\n|\n/);
    sheet.getRange('A' + (lastRow + 1)).setValue(today);
    sheet.getRange('B' + (lastRow + 1)).setValue(messageParameter[1]);
    sheet.getRange('C' + (lastRow + 1)).setValue(messageParameter[2]);
    sheet.getRange('D' + (lastRow + 1)).setValue(messageParameter[3]);
    sheet.getRange('E' + (lastRow + 1)).setValue(messageParameter[4]);

    const ss2 = SpreadsheetApp.getActiveSpreadsheet();
    
    const sheet2 = ss2.getSheetByName("いくら記録");
    
    const lastRow2 = sheet2.getLastRow();
    
    const range = sheet.getRange("A"+lastRow2+":E"+lastRow2);
   
    var values = range.getValues();
    
    const shit = "うんこ："　+ values[0][1];
    const food = "フード："　+ values[0][2];
    const crickets = "コオロギ："　+ values[0][3];

    let replyMessage = today + "\n" + shit + "\n" + food + "\n" +crickets+ "\n登録しました。" ;

    let payload = {
      'replyToken': replyToken,
      'messages': [{
          'type': 'text',
          'text': replyMessage
      }]
  };
    
  let options = {
      'payload' : JSON.stringify(payload),
      'myamethod'  : 'POST',
      'headers' : {"Authorization" : "Bearer " + token},
      'contentType' : 'application/json'
  };
    
  
  UrlFetchApp.fetch(url, options);
    

//エラー
  } else {
    let replyMessage = "エラー";

    let payload = {
      'replyToken': replyToken,
      'messages': [{
          'type': 'text',
          'text': replyMessage
      }]
  };
    
  let options = {
      'payload' : JSON.stringify(payload),
      'myamethod'  : 'POST',
      'headers' : {"Authorization" : "Bearer " + token},
      'contentType' : 'application/json'
  };
    

  
  UrlFetchApp.fetch(url, options);
  }

        
}

function postMessage() {
  const url = 'https://api.line.me/v2/bot/message/broadcast';
  const token = "pGSdulkFD4MjEPfGUvWVdLpG+8hxe8H5eTd0ufNct9qNnq1hfirad7BvU0Q4eF7yBjVYLiaFcbjFFFDRYfYUAWnINManDppnGRCNcaznKXSwt11T+Z68XxW4QDFt1Vx1AqSidUoNUknT5jDSMjgxlgdB04t89/1O/w1cDnyilFU=";

  getJSON_SwitchBotHubMini();
   
  const ss = SpreadsheetApp.getActiveSpreadsheet();
    
  const sheet = ss.getSheetByName("SwitchBot");
    
  const lastRow = sheet.getLastRow();
    
  const range = sheet.getRange("B"+lastRow+":E"+lastRow);
   
  var values = range.getValues();
    
  const temperature_u = "温度：" + values[0][0] + "℃";
  const humidity_u = "湿度：" + Math.floor(values[0][1] *1000)/10 + "%";
    
  const temperature_i = "温度：" + values[0][2] + "℃";
  const humidity_i = "湿度：" + Math.floor(values[0][3] *1000)/10 + "%";
 
  let replyMessage = "うに\n" +temperature_u + "\n" + humidity_u + "\nいくら\n" + temperature_i + "\n" + humidity_i;

  const payload = {
    messages: [
      { type: 'text', text: replyMessage }
    ]
  };

  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, params);
}