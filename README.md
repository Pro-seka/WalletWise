[Click here to try](https://pro-seka.github.io/WalletWise/)


## Project structure

```text
WalletWise/
├── index.html          
├── css/
│   ├── style.css        
│   └── responsive.css   
├── js/
│   ├── app.js           
│   ├── transactions.js  
│   ├── budget.js        
│   └── forecast.js      
├── WalletWise Gallery/
│   └── How_to_Use_WalletWise.mp4   
├── main.js               
└── package.json          
```
# WalletWise — Code Understanding Guide

## 1. index.html

- **What it is:** The one HTML page. It has 3 sections (Dashboard, Transactions, Budget) that show/hide with CSS, and 2 popups (Add Transaction, Tutorial Video). Every important element has an `id` so JavaScript can grab it.
- **Why it exists:** Structure has to exist before CSS can style it or JS can control it.
- **Connects to:** `style.css` + `responsive.css` (via `<link>`), and all 4 JS files (via `<script>` at the bottom).
- **If removed:** No app at all — nothing to load.

## 2. style.css

- **What it is:** The design file. Colors and fonts are stored as CSS variables at the top (like `--credit: green`), so the same color is reused everywhere by name instead of retyping the code. The ledger look — ruled lines, the round stamp badge, ruler-style bars — is built with plain CSS, no images.
- **Why it exists:** Keeps "how it looks" separate from "how it works."
- **Connects to:** Loaded by `index.html`.
- **If removed:** App still runs, but shows as plain unstyled text.

## 3. responsive.css

- **What it is:** Rules wrapped in `@media (max-width: ...)` blocks — they only switch on below 800px, 600px, and 360px screen widths. They override `style.css`.
- **Why it exists:** So the app looks right on a phone, not just a laptop.
- **Connects to:** Loaded right after `style.css`, so it can win.
- **If removed:** App still works, but looks broken on small screens.

## 4. app.js — the shared brain

- **What it is:** The first script that loads. It holds the app's two shared variables — `transactions` (an array) and `monthlyBudget` (a number) — plus helper functions every other file needs.
- **Why it exists:** All the other files need one common place to read and write the app's data.
- **Connects to:** Loaded first; `transactions.js`, `budget.js`, `forecast.js` all call functions defined here.
- **If removed:** Nothing works — no data, no saving, no page switching.

### `loadData()`

- **What it is:** Reads both saved values from Local Storage (`localStorage.getItem`) and turns them from text back into a real array and number using `JSON.parse`. If nothing was saved yet, it uses an empty array and 0.
- **Why it exists:** So old data comes back when the app reopens.
- **Connects to:** Called once, at startup, before anything else runs.
- **If removed:** App always starts empty, even if data was saved before.

### `saveTransactions()` / `saveBudget()`

- **What it is:** Takes the current `transactions` array (or `monthlyBudget` number) and writes it into Local Storage as text, using `JSON.stringify` (Local Storage can only store text).
- **Why it exists:** Local Storage is the app's only "database" — this is how data actually gets saved.
- **Connects to:** Called right after every add, delete, or budget change.
- **If removed:** Changes disappear the moment the app is closed.

### `formatMoney(amount)`

- **What it is:** Takes a plain number like `4000` and returns `"৳4,000"` — rounds it to 2 decimals and adds comma separators.
- **Why it exists:** Every screen in the app needs money to look the same way.
- **Connects to:** Used by all 4 JS files, everywhere a number is shown.
- **If removed:** Money would show as raw numbers with no ৳ sign or commas.

### `formatDate()` / `todayISO()`

- **What it is:** `formatDate` turns a stored date like `2026-08-09` into `"Aug 9, 2026"` for display. `todayISO` builds today's date in the `YYYY-MM-DD` format the date input needs. Both add a fake midnight time (`T00:00:00`) so the date never shifts by one day due to timezones.
- **Why it exists:** Dates typed by an `<input type="date">` and dates shown to a user need two different formats.
- **Connects to:** `formatDate` is used when showing transactions; `todayISO` pre-fills the date field when the popup opens.
- **If removed:** Dates could show wrong (off by a day) or the date field wouldn't default to today.

### `renderAll()`

- **What it is:** Calls `renderDashboard()`, `renderTransactionsPage()`, and `renderBudgetPage()` — one after another. That's it, 3 lines.
- **Why it exists:** So every part of the code that changes data only has to remember ONE function name to "refresh the screen."
- **Connects to:** Called after every add, delete, and budget save.
- **If removed:** The screen would freeze — new data would be saved but never appear.

### `showPage(pageId)` / `setupNavigation()`

- **What it is:** `showPage` goes through every page section and every tab button, and turns "active" ON only for the one matching `pageId` — turning it OFF everywhere else automatically. `setupNavigation` attaches a click listener to every tab/bottom-nav button so clicking one calls `showPage` with that button's page name.
- **Why it exists:** One simple function handles switching between all 3 pages, instead of writing separate code per tab.
- **Connects to:** Tied to `data-page="..."` attributes in the HTML.
- **If removed:** Clicking tabs would do nothing — you'd be stuck on Dashboard.

### `openTxnModal(type)` / `closeTxnModal()`

- **What it is:** `openTxnModal` sets the popup title to "Add Income" or "Add Expense," shows the right field (Category or Source), fills in today's date, and makes the popup visible. `closeTxnModal` hides it and clears the form.
- **Why it exists:** One popup is reused for both income and expense, instead of building two separate forms.
- **Connects to:** Opened by the "+ Add Income / Expense" buttons; the actual saving happens in `transactions.js`.
- **If removed:** No way to open the add-transaction form at all.

### `openVideoModal()` / `closeVideoModal()`

- **What it is:** `openVideoModal` shows the video popup and plays the video from the start. `closeVideoModal` pauses the video and hides the popup (so it doesn't keep playing in the background).
- **Why it exists:** Runs the "How to use WalletWise" tutorial popup.
- **Connects to:** Opened by the "▶ Watch Tutorial" button on the Dashboard.
- **If removed:** The tutorial button would do nothing.

### The startup code (`DOMContentLoaded`)

- **What it is:** One block that runs once the page has fully loaded. In order: `loadData()` → set up navigation → set up both popups → set up both forms → `renderAll()`.
- **Why it exists:** This is what actually starts the whole app.
- **Connects to:** Everything — it's the very first code that runs.
- **If removed:** The app would load a blank page and never come alive.

## 5. transactions.js — adding & deleting entries

- **What it is:** Everything about individual income/expense entries.
- **Why it exists:** Keeps "handling one transaction" separate from "doing budget math."
- **Connects to:** Uses `app.js`'s shared array + helpers. Its render functions are called by `budget.js`.
- **If removed:** Can't add or delete a transaction; lists stay empty.

### `setupTransactionForm()`

- **What it is:** Listens for the popup form's submit. When submitted: reads the amount/description/date, checks the amount is a real positive number and the date isn't empty, builds a plain object like `{id, type, amount, date, category}`, adds it to the `transactions` array, saves, closes the popup, and redraws everything.
- **Why it exists:** This is the one place a new transaction is created.
- **Connects to:** Fires on the popup's "Save Entry" button (or Enter key).
- **If removed:** The Save button would do nothing.

### `handleDeleteClick(event)`

- **What it is:** One shared click-listener on the whole list (not one per button). When clicked, it checks if a delete "×" button was actually clicked, reads which transaction's ID it belongs to, and rebuilds the array without that one transaction using `.filter()`.
- **Why it exists:** Rows are rebuilt every render, so listening on the parent list (instead of each row) means new rows work automatically without extra setup.
- **Connects to:** Attached once, at startup, to both transaction lists.
- **If removed:** The × button would do nothing.

### `getSortedTransactions()`

- **What it is:** Makes a copy of the `transactions` array and sorts it newest-date-first (ties broken by which was added most recently).
- **Why it exists:** Both lists (Dashboard + Transactions page) need the same "newest first" order.
- **Connects to:** Called by both render functions below.
- **If removed:** Transactions would show in random/insertion order.

### `buildEntryRow(transaction, entryNumber)`

- **What it is:** Builds one `<li>` row: the ledger number (like №001), the category/source, the description, the date, the amount with a `+` or `−` sign, and a delete button.
- **Why it exists:** One function builds every row, so all rows look the same automatically.
- **Connects to:** Called inside a loop by both render functions.
- **If removed:** No transaction rows would ever appear.

### `escapeHtml(text)`

- **What it is:** Takes any text and makes it safe to insert into the page, so if someone types something like `<script>` as a description, it shows as plain text instead of running as code.
- **Why it exists:** Security — stops user-typed text from being treated as real HTML.
- **Connects to:** Used inside `buildEntryRow` for the title and description.
- **If removed:** A typed-in description could break the page or run unwanted code (XSS risk).

### `renderRecentTransactions()` / `renderAllTransactions()`

- **What it is:** Both clear their list, show an "empty" message if there's nothing to show, then loop through the sorted transactions and append a built row for each. `renderRecentTransactions` only takes the first 5 (Dashboard); `renderAllTransactions` shows every single one (Transactions page).
- **Why it exists:** Two different views need slightly different amounts of the same data.
- **Connects to:** Called from `renderDashboard()` and `renderTransactionsPage()`.
- **If removed:** The lists would stay empty forever, even with saved data.

## 6. budget.js — the money math

- **What it is:** All budget calculations, plus writing numbers onto the Dashboard and Budget page.
- **Why it exists:** Keeps math separate from how transactions are entered.
- **Connects to:** Reads `transactions` + `monthlyBudget` from `app.js`; calls `forecast.js` and `transactions.js`.
- **If removed:** No totals, no remaining balance, no category breakdown.

### `setupBudgetForm()`

- **What it is:** Listens for the Budget form's submit. Checks the number isn't negative or invalid, saves it as the new `monthlyBudget`, clears the input box, and redraws everything.
- **Why it exists:** This is the only place the budget number changes.
- **Connects to:** Fires on the "Save Budget" button.
- **If removed:** The budget could never be set.

### `isThisMonth()` / `getCurrentMonthTransactions()`

- **What it is:** `isThisMonth` checks if a date's month AND year match today's. `getCurrentMonthTransactions` uses that to filter the full list down to just this month's entries.
- **Why it exists:** "Monthly Budget" should only count this month, not every transaction ever made.
- **Connects to:** Used by almost every other function in this file.
- **If removed:** Totals would include every past month too — wrong numbers.

### `calculateMonthlyTotals()`

- **What it is:** Loops through this month's transactions and adds income into one total and expenses into another, then returns both.
- **Why it exists:** The single source for "how much came in / went out" this month.
- **Connects to:** Used by both `renderDashboard()` and `renderBudgetPage()`.
- **If removed:** No income/expense stats anywhere.

### `getCategoryBreakdown()`

- **What it is:** Loops through this month's expenses, adds up totals per category (Food, Transport, etc.) into an object, then converts that into a list sorted highest-spending category first.
- **Why it exists:** Powers the category bars on the Budget page.
- **Connects to:** Called by `renderCategoryBreakdown()`.
- **If removed:** No category breakdown bars.

### `renderDashboard()`

- **What it is:** Gets this month's totals, works out `remaining = budget − expenses`, writes the 3 stat cards, colors the balance badge green/red, sets the progress bar width, then calls `renderForecast()` and `renderRecentTransactions()`.
- **Why it exists:** This one function is responsible for everything on the Dashboard.
- **Connects to:** Called by `renderAll()`.
- **If removed:** The Dashboard would stay blank/stuck at ৳0.

### `renderBudgetPage()`

- **What it is:** Does almost the same math as `renderDashboard()` again, but writes it into the Budget page's own elements. Also shows the red "over budget" warning banner if expenses are bigger than the budget, and calls `renderCategoryBreakdown()`.
- **Why it exists:** The Budget page needs its own full view of the numbers.
- **Connects to:** Called by `renderAll()`.
- **If removed:** The Budget page would stay blank.

## 7. forecast.js — the prediction (not AI)

- **What it is:** A small file — one math function, one display function.
- **Why it exists:** Warns the student before they overspend, not after.
- **Connects to:** Called by `budget.js`'s `renderDashboard()`.
- **If removed:** No forecast text on the Dashboard; nothing else breaks.

### `calculateForecast(totalExpenses)`

- **What it is:** Finds today's day-of-month (`daysPassed`) and how many days are in this month (`daysInMonth`), divides expenses by days passed to get an average, then multiplies that average by the days in the month.
- **Why it exists:** This IS the forecast — two lines of arithmetic, no AI, no model.
- **Connects to:** Called by `renderForecast()`.
- **If removed:** No prediction number could be calculated at all.

### `renderForecast(monthlyBudget, totalExpenses)`

- **What it is:** Runs `calculateForecast`, shows the predicted amount, then compares it to the budget — if higher, shows a red "likely to exceed" message with the exact excess; if not, shows a green "on track" message.
- **Why it exists:** Turns the raw number into something the student can actually read.
- **Connects to:** Writes into the two forecast text elements on the Dashboard.
- **If removed:** Forecast numbers would exist in code but never show on screen.

## 8. main.js — opens the desktop window

- **What it is:** Electron's entry file. Not run in the browser — runs separately, as the "main process."
- **Why it exists:** Turns the HTML/CSS/JS into an actual desktop app.
- **Connects to:** `win.loadFile('index.html')` is the one line linking it to everything else.
- **If removed:** The app can't open as a window at all.

### `createWindow()`

- **What it is:** Creates one `BrowserWindow` with a set size, a background color (so there's no white flash while loading), and security settings (`nodeIntegration: false` — the page can't touch Node.js directly). Then loads `index.html` into it.
- **Why it exists:** This is the actual "open the app" step.
- **Connects to:** Called once on startup, and again on macOS if the dock icon is clicked with no windows open.
- **If removed:** No window would ever appear.

## 9. package.json — project settings

- **What it is:** Tells npm what to install (`electron`) and what `npm start` should run (`electron .`). Its `"main"` field points to `main.js`.
- **Why it exists:** Without it, `npm install` and `npm start` have nothing to read.
- **Connects to:** Read by `npm install` and `npm start`.
- **If removed:** Neither command would work.

## 10. Tutorial video feature (WalletWise Gallery/)

- **What it is:** A folder with a tutorial video, a button + popup in `index.html`, open/close logic in `app.js`, and matching styles in `style.css`.
- **Why it exists:** Helps a new user learn the app fast.
- **Connects to:** Button (`js-open-video` class) → `openVideoModal()` → plays `WalletWise Gallery/How_to_Use_WalletWise.mp4`.
- **If removed:** The "How to use" button and popup disappear; nothing else in the app is affected.

---

## How it all connects (one diagram)

```
index.html
 |-- style.css --> responsive.css        (looks)
 |-- app.js            shared data + startup     loaded 1st
 |-- transactions.js   add/delete transactions    loaded 2nd
 |-- budget.js         money math + rendering     loaded 3rd
 |-- forecast.js       prediction                 loaded 4th

main.js --> opens index.html in a desktop window (Electron)
```

## Data flow (one line)

> User does something → JS updates `transactions[]` or `monthlyBudget` → saved to Local Storage → `renderAll()` redraws the screen.

Every feature in this app — add, delete, set budget — follows this exact same loop.
