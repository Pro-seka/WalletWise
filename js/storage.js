// ===================================================================
// WalletWise - js/storage.js
// LOCAL STORAGE FUNCTIONS
// WalletWise saves everything to the browser's built-in Local
// Storage, which keeps plain text data on the user's computer
// even after the app is closed. Local Storage can only store
// strings, so objects/arrays are converted with JSON.stringify()
// when saving, and read back with JSON.parse() when loading.
// ===================================================================

// Read the budget, transactions, and theme out of Local Storage
// and place them into our application state variables.
function loadDataFromStorage() {
  const savedBudget = localStorage.getItem(STORAGE_KEY_BUDGET);
  const savedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);

  // If nothing has been saved yet, fall back to sensible defaults.
  monthlyBudget = savedBudget ? parseFloat(savedBudget) : 0;
  transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
}

// Save the current monthly budget to Local Storage.
function saveBudgetToStorage() {
  localStorage.setItem(STORAGE_KEY_BUDGET, monthlyBudget.toString());
}

// Save the current transactions array to Local Storage.
function saveTransactionsToStorage() {
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

// Save the chosen theme ('light' or 'dark') to Local Storage.
function saveThemeToStorage(theme) {
  localStorage.setItem(STORAGE_KEY_THEME, theme);
}
