const sheet = SpreadsheetApp.getActiveSheet();
const lastRow = sheet.getLastRow(); //一番最新のトレーニング記録の行

function doGet(){
  var template = 'index';
  var t=HtmlService.createTemplateFromFile(template);

  //各種値をHTMLに受け渡し
  t.benchpress = get_value_gs("B",2.5);
  t.roversquat = get_value_gs("C",2.5);
  t.legcurl = get_value_gs("D",5);
  t.chinning = get_value_gs("E",1);
  t.sideraise = get_value_gs("F",1);
  return t.evaluate().setTitle('TrainingReport')
  .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

//最新のトレーニング記録の取得   stepは各種種目の上げ下げの基準値
function get_value_gs(culum,step) {
  var before_value = sheet.getRange(culum+lastRow).getValue(); //値
  var before_background = sheet.getRange(culum+lastRow).getBackground(); //背景色

  //前回の結果(背景色)から、今回の使用重量に上下があるか... #f4ccccの場合は今回の使用重量を下げる #d9ead3の場合は今回の使用重量を上げる
  if(before_background == "#f4cccc") {
    before_value -= step;
  } else if(before_background == "#d9ead3") {
    before_value += step;
  }
  return before_value;
}

//ボタン押下
function input_to_sheet_gs(benchpressValue,roversquatValue,legcurlValue,chinningValue,sideaiseValue,comment) {
  //値の入力
  set_value(get_value_gs("B",2.5),get_value_gs("C",2.5),get_value_gs("D",5),get_value_gs("E",1),get_value_gs("F",1),comment);
  //文字色・背景色の設定
  set_color("B",benchpressValue);
  set_color("C",roversquatValue);
  set_color("D",legcurlValue);
  set_color("E",chinningValue);
  set_color("F",sideaiseValue);
}

//スプレッドシートに値を入力する
function set_value(benchpress,roversquat,legcurl,chinning,sideraise,comment) {
  var day = new Date();
  day = Utilities.formatDate( day, 'Asia/Tokyo', 'yyyy/MM/dd');
  sheet.getRange("A"+(lastRow+1)).setValue(day)
  sheet.getRange("B"+(lastRow+1)).setValue(benchpress)
  sheet.getRange("C"+(lastRow+1)).setValue(roversquat)
  sheet.getRange("D"+(lastRow+1)).setValue(legcurl)
  sheet.getRange("E"+(lastRow+1)).setValue(chinning)
  sheet.getRange("F"+(lastRow+1)).setValue(sideraise)
  sheet.getRange("G"+(lastRow+1)).setValue(comment)
}

//スプレッドシートに文字色をセット
function set_color(colum,flag) {
  var color;
  //文字色の取得-------------
  //Bad
  if(flag == 0) {
    color = "#ff0000"
  //good or perfect
  } else {
   color = "#000000"
  }
  //----------------------
  sheet.getRange(colum+(lastRow+1)).setFontColor(color);
  set_background(colum,flag);
}

//スプレッドシートに背景色をセット 最新のトレーニング記録3件が、全て赤字の場合背景色を赤にする。 Perfectの時は緑にする
function set_background(colum,flag) {

  //perfect
  if(flag == 2) {
    sheet.getRange(colum+(lastRow+1)).setBackground("#d9ead3");

  //Bad  ...前回もBadだった場合背景色を赤に
  } else if(flag == 0) {

    //過去3回分見る
    var count = 0; //文字色が赤の数
    for(var i = 0;i<3;i++) {
      var before_color = sheet.getRange(colum+(lastRow-i)).getFontColor();
      if(before_color == "#ff0000")count++;
    }

    //過去3回全て赤字なら今回入力分を背景色を赤にする
    if(count == 3)sheet.getRange(colum+(lastRow+1)).setBackground("#f4cccc");
  }
}
