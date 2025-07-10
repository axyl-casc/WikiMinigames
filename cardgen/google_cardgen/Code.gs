function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Robot Player‑Card Generator');
}

function getScores(gameId) {
  var sheetId = '19EhI436McUEme9iBLx64C9-s-GWsh19ZUXKpPjwz1sg';
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet;
  if (gameId) {
    sheet = ss.getSheetByName(String(gameId));
  }
  if (!sheet) {
    sheet = ss.getSheetByName('Scores');
  }
  return sheet ? sheet.getDataRange().getValues() : [];
}

function createCardPdf() {
  var html = HtmlService.createHtmlOutputFromFile('index').getContent();
  var blob = Utilities.newBlob(html, 'text/html', 'card.html');
  var pdf = blob.getAs('application/pdf').setName('robot_card.pdf');
  var file = DriveApp.createFile(pdf);
  return file.getUrl();
}

function getFormData() {
  var formId = '1F3NQCHt3Ki_6p9dNY6nAFMD_-t6FRbbxTkGUTQh4VXc';
  var form = FormApp.openById(formId);
  var responses = form.getResponses();
  if (responses.length === 0) return {};

  var latest = responses[responses.length - 1];
  var items = latest.getItemResponses();
  var result = {};

  // By convention the first question contains the JSON text,
  // the second last question holds the game ID,
  // and the last question is a file upload for the tank image.
  if (items.length >= 1) {
    result.json = items[0].getResponse();
  }

  if (items.length >= 3) {
    result.gameId = items[items.length - 2].getResponse();
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
