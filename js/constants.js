// Keys used to read/write data in the browser's Local Storage.
const STORAGE_KEY_BUDGET = 'walletwise_budget';
const STORAGE_KEY_TRANSACTIONS = 'walletwise_transactions';
const STORAGE_KEY_THEME = 'walletwise_theme';

// The six expense categories offered in the Add Expense form.
// Reused here so the Category Summary page always shows all six,
// even ones with ৳0 spent so far.
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Shopping', 'Others'];

// One color per category (matches the CSS variables in css/variables.css),
// used to draw the little colored dot and bar on the Category
// Summary page.
const CATEGORY_COLORS = {
  Food: 'var(--color-cat-1)',
  Transport: 'var(--color-cat-2)',
  Books: 'var(--color-cat-3)',
  Entertainment: 'var(--color-cat-4)',
  Shopping: 'var(--color-cat-5)',
  Others: 'var(--color-cat-6)'
};

// Short names used for the readable date format, e.g. "Jul 29, 2026".
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
