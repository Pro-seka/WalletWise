// forecast.js
// A simple RULE-BASED spending forecast. This is not machine learning and
// has no confidence score — it just projects the month forward using the
// average daily spending seen so far.
//
//   Average Daily Spending   = Total Expenses / Days Passed
//   Predicted Monthly Spend  = Average Daily Spending × Days in Month

function calculateForecast(totalExpenses) {
  const today = new Date();
  const daysPassed = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const avgDailySpending = daysPassed > 0 ? totalExpenses / daysPassed : 0;
  const predictedSpending = avgDailySpending * daysInMonth;

  return { avgDailySpending, predictedSpending, daysPassed, daysInMonth };
}

function renderForecast(monthlyBudget, totalExpenses) {
  const forecast = calculateForecast(totalExpenses);

  const predictedEl = document.getElementById('forecastPredicted');
  const noteEl = document.getElementById('forecastNote');

  predictedEl.textContent = `Predicted Monthly Spending: ${formatMoney(forecast.predictedSpending)}`;

  noteEl.classList.remove('over', 'ok');

  if (monthlyBudget <= 0) {
    noteEl.textContent = 'Set a monthly budget in the Budget tab to see if you\u2019re on track.';
    return;
  }

  if (forecast.predictedSpending > monthlyBudget) {
    const excess = forecast.predictedSpending - monthlyBudget;
    noteEl.textContent = `Likely to exceed your budget by ${formatMoney(excess)} this month.`;
    noteEl.classList.add('over');
  } else {
    noteEl.textContent = 'On track to stay within your budget this month.';
    noteEl.classList.add('ok');
  }
}
