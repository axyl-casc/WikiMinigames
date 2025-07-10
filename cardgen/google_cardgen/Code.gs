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

function getFormData() {
  var formId = 'YOUR_FORM_ID'; // Replace with your form ID
  var form = FormApp.openById(formId);
  var responses = form.getResponses();
  if (responses.length === 0) return {};

  var latest = responses[responses.length - 1];
  var items = latest.getItemResponses();
  var result = {};

  // By convention the first question contains the JSON text
  // and the last question is a file upload for the tank image.
  if (items.length >= 1) {
    result.json = items[0].getResponse();
  }

  if (items.length >= 2) {
    var upload = items[items.length - 1].getResponse();
    if (upload && upload.length > 0) {
      var file = DriveApp.getFileById(upload[0]);
      var blob = file.getBlob();
      result.imageDataUrl = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
    }
  }

  return result;
}
