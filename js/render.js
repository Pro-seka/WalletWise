// ===================================================================
// WalletWise - js/render.js
// RENDER FUNCTIONS
// Each function below reads the current application state and
// updates a piece of the screen to match it. renderAll() is called
// after every change (in js/forms.js and js/transactions.js) so the
// whole app always stays in sync, no matter which page is visible.
// ===================================================================

// Builds one <tr> of a transaction table, shared by the Dashboard's
// "Recent Transactions" table and the full Transaction History table.
// Pass showDeleteButton = true to add a delete button in the last column.
function buildTransactionRow(transaction, showDeleteButton) {
  const row = document.createElement('tr');

  const isIncome = transaction.type === 'income';
  const amountSign = isIncome ? '+' : '-';
  const amountClass = isIncome ? 'income-amount' : 'expense-amount';
  const typeLabel = isIncome ? 'Income' : 'Expense';
  const typeClass = isIncome ? 'income' : 'expense';

  let rowHtml =
    '<td>' + formatDateForDisplay(transaction.date) + '</td>' +
    '<td><span class="type-badge ' + typeClass + '">' + typeLabel + '</span></td>' +
    '<td>' + transaction.categoryOrSource + '</td>' +
    '<td>' + (transaction.description || '-') + '</td>' +
    '<td class="amount-cell ' + amountClass + '">' + amountSign + formatCurrency(transaction.amount) + '</td>';

  if (showDeleteButton) {
    rowHtml += '<td>' +
      '<button class="delete-btn" data-id="' + transaction.id + '" type="button" title="Delete transaction">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="4" y1="7" x2="20" y2="7"></line>' +
      '<path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>' +
      '<path d="M8 7v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7"></path>' +
      '<line x1="10" y1="11" x2="10" y2="17"></line>' +
      '<line x1="14" y1="11" x2="14" y2="17"></line>' +
      '</svg></button></td>';
  }

  row.innerHTML = rowHtml;
  return row;
}

// Updates a status badge + progress bar pair to reflect whether the
// user is within budget or over budget. Used by both the Dashboard
// and the Monthly Budget page.
function updateBudgetStatusDisplay(badgeEl, fillEl, captionEl, totalExpenses) {
  const remaining = monthlyBudget - totalExpenses;
  const isOverBudget = remaining < 0;

  badgeEl.textContent = isOverBudget ? 'Over Budget' : 'Within Budget';
  badgeEl.classList.toggle('badge-danger', isOverBudget);

  // Work out how full the progress bar should be (0-100%).
  let percentSpent = 0;
  if (monthlyBudget > 0) {
    percentSpent = (totalExpenses / monthlyBudget) * 100;
  } else if (totalExpenses > 0) {
    percentSpent = 100;
  }
  percentSpent = Math.min(percentSpent, 100); // never draw past the end of the bar

  fillEl.style.width = percentSpent + '%';
  fillEl.classList.toggle('over-budget', isOverBudget);

  captionEl.textContent = formatCurrency(totalExpenses) + ' of ' + formatCurrency(monthlyBudget) + ' spent';
}

// ---- Dashboard ----
function renderDashboard() {
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const remaining = calculateRemainingBudget();

  cardBudgetEl.textContent = formatCurrency(monthlyBudget);
  cardIncomeEl.textContent = formatCurrency(totalIncome);
  cardExpensesEl.textContent = formatCurrency(totalExpenses);
  cardBalanceEl.textContent = formatCurrency(remaining);

  updateBudgetStatusDisplay(dashboardStatusBadge, dashboardProgressFill, dashboardProgressCaption, totalExpenses);

  // Recent Transactions: the 5 newest transactions.
  const recentTransactions = getTransactionsSortedByDateDesc().slice(0, 5);

  recentTransactionsBody.innerHTML = '';
  recentTransactions.forEach(function (transaction) {
    recentTransactionsBody.appendChild(buildTransactionRow(transaction, false));
  });

  recentTransactionsEmpty.classList.toggle('visible', recentTransactions.length === 0);
}

// ---- Monthly Budget page ----
function renderBudgetPage() {
  const totalExpenses = calculateTotalExpenses();
  const remaining = calculateRemainingBudget();

  currentBudgetDisplay.textContent = formatCurrency(monthlyBudget);
  updateBudgetStatusDisplay(budgetStatusBadge, budgetProgressFill, budgetProgressCaption, totalExpenses);
  budgetProgressCaption.textContent = formatCurrency(Math.max(remaining, 0)) + ' remaining';
}

// ---- Transaction History page ----
function renderTransactionHistory() {
  let visibleTransactions = getTransactionsSortedByDateDesc();

  // Apply the currently selected filter (All / Income / Expense).
  if (currentHistoryFilter !== 'all') {
    visibleTransactions = visibleTransactions.filter(function (transaction) {
      return transaction.type === currentHistoryFilter;
    });
  }

  historyTransactionsBody.innerHTML = '';
  visibleTransactions.forEach(function (transaction) {
    historyTransactionsBody.appendChild(buildTransactionRow(transaction, true));
  });

  historyTransactionsEmpty.classList.toggle('visible', visibleTransactions.length === 0);
}

// ---- Category Summary page ----
function renderCategorySummary() {
  const categoryTotals = calculateCategoryTotals();
  const totalExpenses = calculateTotalExpenses();

  categorySummaryList.innerHTML = '';

  EXPENSE_CATEGORIES.forEach(function (category) {
    const amount = categoryTotals[category];
    const color = CATEGORY_COLORS[category];
    const percentOfTotal = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

    const row = document.createElement('div');
    row.className = 'category-row';
    row.innerHTML =
      '<div class="category-row-top">' +
      '<span class="category-name"><span class="category-dot" style="background-color:' + color + '"></span>' + category + '</span>' +
      '<span class="category-amount">' + formatCurrency(amount) + '</span>' +
      '</div>' +
      '<div class="progress-bar-track small">' +
      '<div class="progress-bar-fill" style="width:' + percentOfTotal + '%; background:' + color + '"></div>' +
      '</div>';

    categorySummaryList.appendChild(row);
  });

  categorySummaryEmpty.classList.toggle('visible', totalExpenses === 0);
}

// Calls every render function - run this any time the underlying
// data (budget or transactions) changes, so the whole app stays
// up to date no matter which page the user is currently viewing.
function renderAll() {
  renderDashboard();
  renderBudgetPage();
  renderTransactionHistory();
  renderCategorySummary();
}
