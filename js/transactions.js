// ===================================================================
// WalletWise - js/transactions.js
// TRANSACTION HISTORY - DELETE & FILTER
// Handles removing a transaction from the Transaction History table
// and switching between the All / Income / Expense filter buttons.
// ===================================================================

// Instead of adding a click listener to every delete button, we add
// ONE listener to the table body and check what was actually clicked.
// This is called "event delegation" and works even for rows that are
// added to the table later.
historyTransactionsBody.addEventListener('click', function (event) {
  const clickedButton = event.target.closest('.delete-btn');
  if (!clickedButton) {
    return; // the click wasn't on a delete button
  }

  const transactionId = clickedButton.dataset.id;
  const confirmed = confirm('Are you sure you want to delete this transaction?');
  if (!confirmed) {
    return;
  }

  // Find the transaction in the array and remove it with splice().
  const indexToRemove = transactions.findIndex(function (transaction) {
    return transaction.id === transactionId;
  });

  if (indexToRemove !== -1) {
    transactions.splice(indexToRemove, 1);
    saveTransactionsToStorage();
    renderAll();
  }
});

// Filter buttons (All / Income / Expense) above the history table.
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    currentHistoryFilter = button.dataset.filter;

    filterButtons.forEach(function (otherButton) {
      otherButton.classList.toggle('active', otherButton === button);
    });

    renderTransactionHistory();
  });
});
