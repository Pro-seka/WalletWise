// ===================================================================
// WalletWise - js/forms.js
// FORM HANDLING
// Validation and submit/clear logic for the three forms: Monthly
// Budget, Add Income, and Add Expense.
// ===================================================================

// Shows a message under a form. isError = true turns it red,
// false turns it green.
function showFormMessage(messageEl, message, isError) {
  messageEl.textContent = message;
  messageEl.classList.toggle('is-error', isError);
  messageEl.classList.toggle('is-success', !isError);
}

// ---- Monthly Budget form ----
budgetForm.addEventListener('submit', function (event) {
  event.preventDefault(); // stop the page from reloading

  const enteredAmount = parseFloat(budgetAmountInput.value);

  // Basic validation: the amount must be a number greater than 0.
  if (isNaN(enteredAmount) || enteredAmount <= 0) {
    showFormMessage(budgetFormMessage, 'Please enter a budget amount greater than ৳0.', true);
    return;
  }

  monthlyBudget = enteredAmount;
  saveBudgetToStorage();
  renderAll();

  budgetForm.reset();
  showFormMessage(budgetFormMessage, 'Budget saved!', false);
});

// ---- Add Income form ----
incomeForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const enteredAmount = parseFloat(incomeAmountInput.value);
  const enteredSource = incomeSourceInput.value.trim();
  const enteredDate = incomeDateInput.value;

  // Basic validation for every field.
  if (isNaN(enteredAmount) || enteredAmount <= 0) {
    showFormMessage(incomeFormMessage, 'Please enter an amount greater than ৳0.', true);
    return;
  }
  if (enteredSource === '') {
    showFormMessage(incomeFormMessage, 'Please enter where the income came from.', true);
    return;
  }
  if (enteredDate === '') {
    showFormMessage(incomeFormMessage, 'Please choose a date.', true);
    return;
  }

  const newIncome = {
    id: generateTransactionId(),
    type: 'income',
    amount: enteredAmount,
    categoryOrSource: enteredSource,
    description: '',
    date: enteredDate
  };

  transactions.push(newIncome);
  saveTransactionsToStorage();
  renderAll();

  incomeForm.reset();
  incomeDateInput.value = getTodayDateString();
  showFormMessage(incomeFormMessage, 'Income saved!', false);
});

incomeClearBtn.addEventListener('click', function () {
  incomeForm.reset();
  incomeDateInput.value = getTodayDateString();
  showFormMessage(incomeFormMessage, '', false);
});

// ---- Add Expense form ----
expenseForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const enteredAmount = parseFloat(expenseAmountInput.value);
  const enteredCategory = expenseCategoryInput.value;
  const enteredDescription = expenseDescriptionInput.value.trim();
  const enteredDate = expenseDateInput.value;

  if (isNaN(enteredAmount) || enteredAmount <= 0) {
    showFormMessage(expenseFormMessage, 'Please enter an amount greater than ৳0.', true);
    return;
  }
  if (enteredCategory === '') {
    showFormMessage(expenseFormMessage, 'Please select a category.', true);
    return;
  }
  if (enteredDescription === '') {
    showFormMessage(expenseFormMessage, 'Please enter a short description.', true);
    return;
  }
  if (enteredDate === '') {
    showFormMessage(expenseFormMessage, 'Please choose a date.', true);
    return;
  }

  const newExpense = {
    id: generateTransactionId(),
    type: 'expense',
    amount: enteredAmount,
    categoryOrSource: enteredCategory,
    description: enteredDescription,
    date: enteredDate
  };

  transactions.push(newExpense);
  saveTransactionsToStorage();
  renderAll();

  expenseForm.reset();
  expenseDateInput.value = getTodayDateString();
  showFormMessage(expenseFormMessage, 'Expense saved!', false);
});

expenseClearBtn.addEventListener('click', function () {
  expenseForm.reset();
  expenseDateInput.value = getTodayDateString();
  showFormMessage(expenseFormMessage, '', false);
});
