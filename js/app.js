// app.js
// Shared state, Local Storage helpers, navigation, and the add-transaction
// modal. Other files (transactions.js, budget.js, forecast.js) use the
// global variables and functions defined here.

// ---------- Shared state ----------

let transactions = [];   // array of { id, type, amount, category/source, description, date }
let monthlyBudget = 0;   // number

const STORAGE_KEYS = {
  TRANSACTIONS: 'walletwise_transactions',
  BUDGET: 'walletwise_budget'
};

// Keeps track of which type ("income" or "expense") the modal is currently set to.
let currentTxnType = 'expense';

// ---------- Local Storage helpers ----------

function loadData() {
  const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const savedBudget = localStorage.getItem(STORAGE_KEYS.BUDGET);

  transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
  monthlyBudget = savedBudget ? JSON.parse(savedBudget) : 0;
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

function saveBudget() {
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(monthlyBudget));
}

// ---------- Formatting helpers ----------

function formatMoney(amount) {
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const parts = rounded.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
  return '৳' + parts;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// ---------- Render dispatcher ----------
// Called any time the underlying data changes so every page stays in sync.

function renderAll() {
  renderDashboard();
  renderTransactionsPage();
  renderBudgetPage();
}

// ---------- Navigation ----------

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.toggle('active', page.id === pageId));

  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.page === pageId));

  const bottomBtns = document.querySelectorAll('.bottom-nav-btn');
  bottomBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.page === pageId));
}

function setupNavigation() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => showPage(tab.dataset.page));
  });

  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });
}

// ---------- Add-transaction modal ----------

function openTxnModal(type) {
  currentTxnType = type;

  const modal = document.getElementById('txnModal');
  const title = document.getElementById('txnModalTitle');
  const categoryField = document.getElementById('categoryField');
  const sourceField = document.getElementById('sourceField');

  if (type === 'income') {
    title.textContent = 'Add Income';
    categoryField.classList.add('hidden');
    sourceField.classList.remove('hidden');
  } else {
    title.textContent = 'Add Expense';
    categoryField.classList.remove('hidden');
    sourceField.classList.add('hidden');
  }

  document.getElementById('txnDate').value = todayISO();
  modal.classList.remove('hidden');
}

function closeTxnModal() {
  document.getElementById('txnModal').classList.add('hidden');
  document.getElementById('txnForm').reset();
}

function setupModal() {
  document.querySelectorAll('.js-open-modal').forEach(btn => {
    btn.addEventListener('click', () => openTxnModal(btn.dataset.type));
  });

  document.getElementById('txnModalClose').addEventListener('click', closeTxnModal);
  document.getElementById('txnCancel').addEventListener('click', closeTxnModal);

  document.getElementById('txnModal').addEventListener('click', (event) => {
    if (event.target.id === 'txnModal') closeTxnModal();
  });
}

// ---------- Tutorial video modal ----------

function openVideoModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('tutorialVideo');

  modal.classList.remove('hidden');

  // Start from the beginning every time it's opened, and ignore the error
  // some browsers throw if autoplay-with-sound is blocked — the user can
  // just press the visible play button in that case.
  video.currentTime = 0;
  video.play().catch(() => {});
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('tutorialVideo');

  video.pause();
  modal.classList.add('hidden');
}

function setupVideoModal() {
  document.querySelectorAll('.js-open-video').forEach(btn => {
    btn.addEventListener('click', openVideoModal);
  });

  document.getElementById('videoModalClose').addEventListener('click', closeVideoModal);

  document.getElementById('videoModal').addEventListener('click', (event) => {
    if (event.target.id === 'videoModal') closeVideoModal();
  });
}

// ---------- Init ----------

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupNavigation();
  setupModal();
  setupVideoModal();
  setupTransactionForm(); // defined in transactions.js
  setupBudgetForm();      // defined in budget.js
  renderAll();
});
