//更新日時を書き込む
function RowUpdated(){
  var mySheet = SpreadsheetApp.getActiveSheet();
  
  var UpdateColumn = 0;
  if(mySheet.getName() == "飲食団体") UpdateColumn = 7;
  else return;
  
  var myCell = mySheet.getActiveCell();
  
  Logger.log(myCell.getRow());
  
  if(myCell.getRow() > 1.0){
    var date = new Date();
    mySheet.getRange(myCell.getRow(), UpdateColumn).setValue(
      Utilities.formatDate(date, "Asia/Tokyo", "MM月dd日HH:mm 更新")
    );
  }
}

//CFからのリクエストを受け取る
function doPost(e){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var foodssheet = sheet.getSheetByName("飲食団体");
  var showssheet = sheet.getSheetByName("展示団体");
  var eventsheet = sheet.getSheetByName("イベント");
  var schdlsheet = sheet.getSheetByName("スケジュール");
  
  var params = JSON.parse(e.postData.getDataAsString());
  //var params = JSON.parse(e);
  //var Type = params.reqtype;
  var resarr = [];
  console.log(params);
  console.log(params["Club"]);
  if("Club" in params){
    console.log("Now IfClub");
    var Group = params.Club;
    resarr.push(FindClubinfo(foodssheet, Group));
    resarr.push(FindClubinfo(showssheet, Group));
    resarr.push(FindClubinfo(eventsheet, Group));
    //resarr.push(FindClubinfo(schdlsheet, Group));
  }
  /*else if(params["Food"]){
    resarr.concat(Findinfo(foodssheet, "種別", params.Food));
  }
  else if(params["Location"]){
    var Locate = params.Location;
    if(Locate == "ピロティ"){
      resarr.concat(Findinfo(foodssheet, "業種", "飲食"));
      resarr.concat(Findinfo(showssheet, "場所", "ピロティ"));
    }
    else{
      resarr[0] = Findinfo(showssheet, "場所", Locate);
      resarr[1] = Findinfo(eventsheet, "場所", Locate);
      resarr[2] = Findinfo(schdlsheet, "場所", Locate);
    }
  }
  else if(params["ShopType"]){
    var type = params.ShopType;
    resarr.push(Findinfo(foodssheet, "業種", type));
    resarr.push(Findinfo(showssheet, "業種", type));
  }
  else{
    //パラメータが無ければ何もできない
  }*/
  
  console.log("resarr");
  console.log(resarr);
  
  resarr = resarr.filter(function(x){ return Object.keys(x).length != 0 });
  console.log(resarr);
  var json = { "result" : resarr };
  console.log(json);
  var res = ContentService.createTextOutput();
  res = res.setMimeType(ContentService.MimeType.JAVASCRIPT);
  res = res.setContent(JSON.stringify(json));
  
  return res;
}

function doGet(e){
  var json = {
    hoge: 'hoge',
    hogehoge: 'hogehoge'
  };
  
  var res = ContentService.createTextOutput();
  res = res.setMimeType(ContentService.MimeType.JAVASCRIPT);
  res = res.setContent(JSON.stringify(json));
  
  return res
}

//団体名から詳細を調べる
function FindClubinfo(sheet,Name){
  var range = sheet.getRange(2,1,sheet.getLastRow(),7).getValues();
  var title = sheet.getRange(1,1,1,7).getValues()[0];
  var selected =  [];
  
  //Logger.log(range);
  
  range.forEach(function(value){
    if(value[0] == Name){
      selected = value;
    }
  })
  
  if(selected.length == 0) return {};
  
  console.log(selected);
  //Logger.log(title);
  
  var ret = Arr2Dic(title,selected);
  
  ret["団体種"] = sheet.getName();
  
  console.log("ret");
  console.log(ret);
  
  return ret;
}

function Findinfos(sheet, column, target){
  var header = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  
  var index = header.indexOf(column);
  
  if(index < 0) return [];
  
  var range = sheet.getRange(2,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
  
  var selected = [];
  
  range.forEach(function(value){
    if(value[index] == target){
      var ret = Arr2Dic(header, value);
      ret["団体種"] = sheet.getName();
      selected.push(ret);
    }
  });
  
  return selected;
}

function Arr2Dic(header, arr){
  var ret = {};
  
  for(var i = 0; i < arr.length; i++){
    ret[header[i]] = arr[i];
  }
  
  return ret;
}

function Sample(){
  //var a = doPost(JSON.stringify({ "Club" : "電子工学研究会" }));
  var a = doGet(JSON.stringify({ "Club" : "電子工学研究会" }));
  Logger.log("a");
  Logger.log(a);
}