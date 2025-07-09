function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Robot Player‑Card Generator');
}

function getScores() {
  var sheetId = 'YOUR_SHEET_ID'; // Replace with your sheet ID
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Scores');
  return sheet.getDataRange().getValues();
}

function createCardPdf() {
  var html = HtmlService.createHtmlOutputFromFile('index').getContent();
  var blob = Utilities.newBlob(html, 'text/html', 'card.html');
  var pdf = blob.getAs('application/pdf').setName('robot_card.pdf');
  var file = DriveApp.createFile(pdf);
  return file.getUrl();
}
