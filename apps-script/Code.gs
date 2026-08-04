/**
 * Portfolio site — "Request a Demo" form handler.
 *
 * SETUP (see README.md for full step-by-step):
 * 1. Create a Google Sheet, name a tab "Demo Requests".
 * 2. In the Sheet: Extensions > Apps Script, paste this file's contents in.
 * 3. Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the deployment URL into assets/js/main.js (SCRIPT_URL).
 */

const SHEET_NAME = "Demo Requests";

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.company || "",
      data.message || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Email", "Company", "Message"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
