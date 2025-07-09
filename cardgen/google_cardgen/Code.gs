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

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var title = item.getItem().getTitle().toLowerCase();

    if (title.indexOf('json') !== -1) {
      result.json = item.getResponse();
    } else if (title.indexOf('image') !== -1) {
      var fileIds = item.getResponse();
      if (fileIds && fileIds.length > 0) {
        var file = DriveApp.getFileById(fileIds[0]);
        var blob = file.getBlob();
        result.imageDataUrl = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
      }
    }
  }

  return result;
}
