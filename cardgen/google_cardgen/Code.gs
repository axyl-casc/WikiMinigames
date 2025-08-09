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

function createCardPdf(cardHtml) {
  var template = HtmlService.createTemplateFromFile('pdf_template');
  template.cardHtml = cardHtml || '';
  var html = template.evaluate().getContent();
  var blob = Utilities.newBlob(html, 'text/html', 'card.html');
  var pdf = blob.getAs('application/pdf').setName('robot_card.pdf');
  var file = DriveApp.createFile(pdf);
  return file.getUrl();
}

function createCardPng(cardHtml) {
  var template = HtmlService.createTemplateFromFile('pdf_template');
  template.cardHtml = cardHtml || '';
  var html = template.evaluate();
  var blob = html.getBlob().getAs('image/png').setName('robot_card.png');
  var folder = getOrCreateFolder_('robocode_cards');
  var file = folder.createFile(blob);
  return file.getId();
}

function getLatestCardUrl() {
  var folder = getOrCreateFolder_('robocode_cards');
  var files = folder.getFiles();
  var latest;
  while (files.hasNext()) {
    var file = files.next();
    if (!latest || file.getDateCreated() > latest.getDateCreated()) {
      latest = file;
    }
  }
  return latest ? 'https://drive.google.com/uc?export=view&id=' + latest.getId() : '';
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

function getOrCreateFolder_(name) {
  var folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function buildStars_(count) {
  var result = '';
  count = Number(count) || 0;
  for (var i = 0; i < count; i++) {
    result += '★';
  }
  return result;
}

function buildCardHtml_(info, imageDataUrl) {
  var html = '<div class="card">';
  if (info && info.role) {
    html += '<div class="player-role">' + info.role + '</div>';
  }
  var stars = info ? buildStars_(info.stars) : '';
  if (stars) {
    html += '<div class="stars">' + stars + '</div>';
  }
  if (imageDataUrl) {
    html += '<img src="' + imageDataUrl + '" style="width:100%;border-radius:0.5rem;margin-bottom:0.5rem;" />';
  }
  var name = info && info.name ? info.name : '';
  var version = info && info.version ? info.version : '';
  html += '<h2>' + name + ' ' + version + '</h2>';
  if (info && info.meta) {
    html += '<div class="meta">' + info.meta + '</div>';
  }
  if (info && info.stats && info.stats.length) {
    html += '<div class="stats">';
    for (var i = 0; i < info.stats.length; i++) {
      var s = info.stats[i];
      html += '<p><span>' + s.label + '</span><span>' + s.value + '</span></p>';
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

// Attach this function to the Google Form's submit trigger.
function onFormSubmit(e) {
  var data = getFormData();
  if (!data || !data.json) return;
  try {
    var info = JSON.parse(data.json);
    var cardHtml = buildCardHtml_(info, data.imageDataUrl);
    createCardPng(cardHtml);
  } catch (err) {
    Logger.log('Failed to generate card: ' + err);
  }
}
