// Navigation
const navButtons = document.querySelectorAll('[data-page]');
const pageSections = document.querySelectorAll('.page');

// Dashboard
const cardBudgetEl = document.getElementById('card-budget');
const cardIncomeEl = document.getElementById('card-income');
const cardExpensesEl = document.getElementById('card-expenses');
const cardBalanceEl = document.getElementById('card-balance');
const dashboardStatusBadge = document.getElementById('dashboard-status-badge');
const dashboardProgressFill = document.getElementById('dashboard-progress-fill');
const dashboardProgressCaption = document.getElementById('dashboard-progress-caption');
const recentTransactionsBody = document.getElementById('recent-transactions-body');
const recentTransactionsEmpty = document.getElementById('recent-transactions-empty');

// Monthly Budget page
const currentBudgetDisplay = document.getElementById('current-budget-display');
const budgetStatusBadge = document.getElementById('budget-status-badge');
const budgetProgressFill = document.getElementById('budget-progress-fill');
const budgetProgressCaption = document.getElementById('budget-progress-caption');
const budgetForm = document.getElementById('budget-form');
const budgetAmountInput = document.getElementById('budget-amount-input');
const budgetFormMessage = document.getElementById('budget-form-message');

// Add Income page
const incomeForm = document.getElementById('income-form');
const incomeAmountInput = document.getElementById('income-amount-input');
const incomeSourceInput = document.getElementById('income-source-input');
const incomeDateInput = document.getElementById('income-date-input');
const incomeFormMessage = document.getElementById('income-form-message');
const incomeClearBtn = document.getElementById('income-clear-btn');

// Add Expense page
const expenseForm = document.getElementById('expense-form');
const expenseAmountInput = document.getElementById('expense-amount-input');
const expenseCategoryInput = document.getElementById('expense-category-input');
const expenseDescriptionInput = document.getElementById('expense-description-input');
const expenseDateInput = document.getElementById('expense-date-input');
const expenseFormMessage = document.getElementById('expense-form-message');
const expenseClearBtn = document.getElementById('expense-clear-btn');

// Transaction History page
const historyTransactionsBody = document.getElementById('history-transactions-body');
const historyTransactionsEmpty = document.getElementById('history-transactions-empty');
const filterButtons = document.querySelectorAll('.filter-btn');

// Category Summary page
const categorySummaryList = document.getElementById('category-summary-list');
const categorySummaryEmpty = document.getElementById('category-summary-empty');

// Dark mode
const themeToggleInput = document.getElementById('theme-toggle-input');
