// budget.js
// Monthly budget calculations, category spending breakdown, and rendering
// for the Dashboard and Budget pages.

function setupBudgetForm() {
  const form = document.getElementById('budgetForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = document.getElementById('budgetInput');
    const value = parseFloat(input.value);

    if (isNaN(value) || value < 0) return;

    monthlyBudget = value;
    saveBudget();
    input.value = '';
    renderAll();
  });
}

// True if the transaction date falls in the current calendar month/year.
function isThisMonth(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function getCurrentMonthTransactions() {
  return transactions.filter(t => isThisMonth(t.date));
}

// Returns { income, expenses } totals for the current month.
function calculateMonthlyTotals() {
  const monthly = getCurrentMonthTransactions();
  let income = 0;
  let expenses = 0;

  monthly.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else expenses += t.amount;
  });

  return { income, expenses };
}

// Returns an array of { category, amount } sorted from highest to lowest,
// for expenses recorded this month.
function getCategoryBreakdown() {
  const monthly = getCurrentMonthTransactions();
  const totals = {};

  monthly.forEach(t => {
    if (t.type !== 'expense') return;
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  return Object.keys(totals)
    .map(category => ({ category, amount: totals[category] }))
    .sort((a, b) => b.amount - a.amount);
}

// ---------- Dashboard ----------

function renderDashboard() {
  const totals = calculateMonthlyTotals();
  const remaining = monthlyBudget - totals.expenses;

  document.getElementById('statBudget').textContent = formatMoney(monthlyBudget);
  document.getElementById('statIncome').textContent = formatMoney(totals.income);
  document.getElementById('statExpenses').textContent = formatMoney(totals.expenses);

  const stampBadge = document.getElementById('stampBadge');
  const stampAmount = document.getElementById('stampAmount');
  const stampStatus = document.getElementById('stampStatus');

  stampAmount.textContent = formatMoney(remaining);
  if (remaining < 0) {
    stampBadge.classList.add('over');
    stampStatus.textContent = 'Over Budget';
  } else {
    stampBadge.classList.remove('over');
    stampStatus.textContent = 'On Track';
  }

  const percent = monthlyBudget > 0 ? Math.min(100, (totals.expenses / monthlyBudget) * 100) : 0;
  const fill = document.getElementById('dashProgressFill');
  fill.style.width = percent + '%';
  fill.classList.toggle('over', totals.expenses > monthlyBudget && monthlyBudget > 0);
  document.getElementById('dashProgressText').textContent = Math.round(percent) + '%';

  renderForecast(monthlyBudget, totals.expenses); // forecast.js
  renderRecentTransactions();                     // transactions.js
}

// ---------- Budget page ----------

function renderBudgetPage() {
  const totals = calculateMonthlyTotals();
  const remaining = monthlyBudget - totals.expenses;

  document.getElementById('currentBudgetDisplay').textContent = formatMoney(monthlyBudget);
  document.getElementById('budgetTotalSpending').textContent = formatMoney(totals.expenses);

  const remainingEl = document.getElementById('budgetRemaining');
  remainingEl.textContent = formatMoney(remaining);
  remainingEl.classList.toggle('debit-text', remaining < 0);
  remainingEl.classList.toggle('credit-text', remaining >= 0);

  const warning = document.getElementById('overspendWarning');
  if (monthlyBudget > 0 && totals.expenses > monthlyBudget) {
    const excess = totals.expenses - monthlyBudget;
    warning.textContent = `You have gone over your monthly budget by ${formatMoney(excess)}.`;
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }

  const percent = monthlyBudget > 0 ? Math.min(100, (totals.expenses / monthlyBudget) * 100) : 0;
  const fill = document.getElementById('budgetProgressFill');
  fill.style.width = percent + '%';
  fill.classList.toggle('over', totals.expenses > monthlyBudget && monthlyBudget > 0);
  document.getElementById('budgetProgressText').textContent = Math.round(percent) + '%';

  renderCategoryBreakdown(totals.expenses);
}

function renderCategoryBreakdown(totalExpenses) {
  const container = document.getElementById('categoryBreakdown');
  const emptyNote = document.getElementById('categoryEmptyNote');
  const breakdown = getCategoryBreakdown();

  container.innerHTML = '';

  if (breakdown.length === 0) {
    emptyNote.classList.remove('hidden');
    return;
  }
  emptyNote.classList.add('hidden');

  breakdown.forEach(item => {
    const percent = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

    const row = document.createElement('div');
    row.className = 'category-row';
    row.innerHTML = `
      <div class="category-row-head">
        <span class="cat-name">${item.category}</span>
        <span class="cat-amount">${formatMoney(item.amount)}</span>
      </div>
      <div class="category-track">
        <div class="category-fill" style="width:${percent}%"></div>
      </div>
    `;
    container.appendChild(row);
  });
}
