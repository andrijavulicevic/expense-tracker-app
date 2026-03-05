/**
 * Google Apps Script for Expense Tracker two-way sync.
 *
 * Setup:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code and save
 * 4. Click Deploy → New deployment
 * 5. Select "Web app", set "Execute as: Me", "Who has access: Anyone"
 * 6. Copy the URL and paste it into the app's Settings → Sync URL
 */

var SHEET_NAME = "Expenses";
var COLUMNS = [
  "id",
  "title",
  "amount",
  "category",
  "note",
  "date",
  "createdAt",
  "updatedAt",
];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var incoming = payload.expenses || [];
    var deletedIds = payload.deletedIds || [];

    var sheet = getOrCreateSheet();
    var existing = readExpenses(sheet);
    var merged = merge(existing, incoming, deletedIds);

    writeExpenses(sheet, merged);
    return json({ expenses: merged });
  } catch (err) {
    return json({ error: err.message });
  }
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    // Force date/timestamp columns (date, createdAt, updatedAt = columns 6-8)
    // to plain text so Sheets never auto-converts them to Date objects.
    sheet.getRange(1, 6, sheet.getMaxRows(), 3).setNumberFormat("@");
  }
  return sheet;
}

function readExpenses(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  return data.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) {
      if (row[i] === "" || row[i] === null || row[i] === undefined) return;
      obj[h] = row[i];
    });
    if (obj.amount !== undefined) obj.amount = Number(obj.amount);
    return obj;
  });
}

function writeExpenses(sheet, expenses) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, COLUMNS.length).clearContent();
  }
  if (expenses.length === 0) return;

  var rows = expenses.map(function (exp) {
    return COLUMNS.map(function (col) {
      var val = exp[col];
      if (val === undefined || val === null) return "";
      return val;
    });
  });
  sheet.getRange(2, 1, rows.length, COLUMNS.length).setValues(rows);
}

function merge(sheetExpenses, appExpenses, deletedIds) {
  var map = {};

  // Build delete lookup
  var deleteSet = {};
  deletedIds.forEach(function (id) {
    deleteSet[id] = true;
  });

  // Start with sheet data, skip deleted
  sheetExpenses.forEach(function (exp) {
    if (exp.id && !deleteSet[exp.id]) map[exp.id] = exp;
  });

  // Merge app data, skip deleted, last-write-wins
  appExpenses.forEach(function (exp) {
    if (!exp.id || deleteSet[exp.id]) return;
    var existing = map[exp.id];
    if (
      !existing ||
      new Date(exp.updatedAt || exp.createdAt) >=
        new Date(existing.updatedAt || existing.createdAt)
    ) {
      map[exp.id] = exp;
    }
  });

  var result = [];
  for (var id in map) {
    if (map.hasOwnProperty(id)) result.push(map[id]);
  }
  return result;
}
