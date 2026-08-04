// ===================================================================
// WalletWise - js/state.js
// APPLICATION STATE
// These variables hold the app's data while it is running in
// memory. They are filled in from Local Storage when the app
// starts (see js/storage.js -> loadDataFromStorage), and written
// back to Local Storage every time they change.
// ===================================================================

let monthlyBudget = 0;      // A single number, e.g. 500
let transactions = [];      // An array of transaction objects
let currentHistoryFilter = 'all'; // 'all' | 'income' | 'expense'
