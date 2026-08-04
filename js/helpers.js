// ===================================================================
// WalletWise - js/helpers.js
// HELPER / UTILITY FUNCTIONS
// Small, reusable functions for formatting values and doing the
// app's math (totals, remaining balance, category totals). Used by
// js/render.js and js/forms.js.
// ===================================================================

// Turns a number into a Taka string, e.g. 42.5 -> "৳42.50"
function formatCurrency(amount) {
  return '৳' + amount.toFixed(2);
}

// Turns "2026-07-29" (from a <input type="date">) into "Jul 29, 2026".
// We build this manually instead of using new Date() to avoid
// timezone issues that can shift the day by one.
function formatDateForDisplay(dateString) {
  const parts = dateString.split('-');
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return MONTH_NAMES[monthIndex] + ' ' + day + ', ' + year;
}

// Returns today's date as "YYYY-MM-DD", the format <input type="date"> uses.
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}

// Creates a unique id for a new transaction, based on the current time.
function generateTransactionId() {
  return Date.now().toString();
}

// Adds up every income transaction's amount using filter() + forEach().
function calculateTotalIncome() {
  const incomeTransactions = transactions.filter(function (transaction) {
    return transaction.type === 'income';
  });

  let total = 0;
  incomeTransactions.forEach(function (transaction) {
    total += transaction.amount;
  });
  return total;
}

// Adds up every expense transaction's amount using filter() + forEach().
function calculateTotalExpenses() {
  const expenseTransactions = transactions.filter(function (transaction) {
    return transaction.type === 'expense';
  });

  let total = 0;
  expenseTransactions.forEach(function (transaction) {
    total += transaction.amount;
  });
  return total;
}

// Remaining balance = Monthly Budget - Total Expenses
function calculateRemainingBudget() {
  return monthlyBudget - calculateTotalExpenses();
}

// Builds an object like { Food: 120, Transport: 45, ... } with the
// total spent in each expense category.
function calculateCategoryTotals() {
  const totals = {};

  // Start every category at 0 so categories with no spending yet
  // still show up on the Category Summary page.
  EXPENSE_CATEGORIES.forEach(function (category) {
    totals[category] = 0;
  });

  const expenseTransactions = transactions.filter(function (transaction) {
    return transaction.type === 'expense';
  });

  expenseTransactions.forEach(function (transaction) {
    totals[transaction.categoryOrSource] += transaction.amount;
  });

  return totals;
}

// Returns a copy of the transactions array sorted with the newest
// transaction date first. Transactions on the same date are ordered
// by when they were created (their id), newest first.
function getTransactionsSortedByDateDesc() {
  const copy = transactions.slice(); // slice() with no arguments copies the array
  copy.sort(function (a, b) {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    return b.id.localeCompare(a.id);
  });
  return copy;
}
