// transactions.js
// Adding, deleting, and rendering income/expense transactions.

function setupTransactionForm() {
  const form = document.getElementById('txnForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('txnAmount').value);
    const description = document.getElementById('txnDescription').value.trim();
    const date = document.getElementById('txnDate').value;

    if (!amount || amount <= 0 || !date) return;

    const newTransaction = {
      id: Date.now(),
      type: currentTxnType,
      amount: amount,
      description: description,
      date: date
    };

    if (currentTxnType === 'expense') {
      newTransaction.category = document.getElementById('txnCategory').value;
    } else {
      const source = document.getElementById('txnSource').value.trim();
      newTransaction.source = source || 'Other';
    }

    transactions.push(newTransaction);
    saveTransactions();
    closeTxnModal();
    renderAll();
  });

  // Delete buttons use event delegation so we only need one listener per list.
  document.getElementById('recentTransactionsList').addEventListener('click', handleDeleteClick);
  document.getElementById('allTransactionsList').addEventListener('click', handleDeleteClick);
}

function handleDeleteClick(event) {
  const button = event.target.closest('.entry-delete');
  if (!button) return;

  const id = Number(button.dataset.id);
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderAll();
}

// Returns transactions newest-first.
function getSortedTransactions() {
  return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
}

// Builds one <li> row for a transaction. entryNumber is the ledger-style index.
function buildEntryRow(transaction, entryNumber) {
  const li = document.createElement('li');
  li.className = 'entry-row ' + transaction.type;

  const label = transaction.type === 'expense' ? transaction.category : transaction.source;
  const sign = transaction.type === 'expense' ? '−' : '+';

  li.innerHTML = `
    <span class="entry-no">№ ${String(entryNumber).padStart(3, '0')}</span>
    <span class="entry-main">
      <span class="entry-title">${escapeHtml(label)}</span>
      <span class="entry-desc">${escapeHtml(transaction.description || 'No description')}</span>
    </span>
    <span class="entry-date">${formatDate(transaction.date)}</span>
    <span class="entry-amount">${sign} ${formatMoney(transaction.amount)}</span>
    <button type="button" class="entry-delete btn-icon" data-id="${transaction.id}" aria-label="Delete entry">×</button>
  `;

  return li;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Dashboard: show the 5 most recent transactions.
function renderRecentTransactions() {
  const list = document.getElementById('recentTransactionsList');
  const emptyNote = document.getElementById('recentEmptyNote');
  const sorted = getSortedTransactions();

  list.innerHTML = '';

  if (sorted.length === 0) {
    emptyNote.classList.remove('hidden');
    return;
  }
  emptyNote.classList.add('hidden');

  const total = sorted.length;
  sorted.slice(0, 5).forEach((transaction, index) => {
    // Entry number reflects its position in the full history (oldest = 1).
    const entryNumber = total - sorted.indexOf(transaction);
    list.appendChild(buildEntryRow(transaction, entryNumber));
  });
}

// Transactions page: show the full history.
function renderAllTransactions() {
  const list = document.getElementById('allTransactionsList');
  const emptyNote = document.getElementById('allEmptyNote');
  const sorted = getSortedTransactions();

  list.innerHTML = '';

  if (sorted.length === 0) {
    emptyNote.classList.remove('hidden');
    return;
  }
  emptyNote.classList.add('hidden');

  const total = sorted.length;
  sorted.forEach((transaction, index) => {
    const entryNumber = total - index;
    list.appendChild(buildEntryRow(transaction, entryNumber));
  });
}

function renderTransactionsPage() {
  renderAllTransactions();
}
