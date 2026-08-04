// ===================================================================
// WalletWise - js/init.js
// APP INITIALIZATION
// Runs once when the app starts: load saved data, set sensible
// defaults for the date fields, apply the saved theme, and draw the
// whole app for the first time. This file must be loaded LAST in
// index.html, since it calls functions defined in every other file.
// ===================================================================

function initializeApp() {
  loadDataFromStorage();

  incomeDateInput.value = getTodayDateString();
  expenseDateInput.value = getTodayDateString();

  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
  applyTheme(savedTheme);

  renderAll();
}

initializeApp();
