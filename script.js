let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

function addTransaction() {
  let title = document.getElementById("title").value.trim();
  let amount = Number(document.getElementById("amount").value);

  if (!title || isNaN(amount)) return;

  transactions.push({
    id: Date.now(),
    title,
    amount
  });

  saveData();
  updateUI();

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  updateUI();
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateUI() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span>${t.title}</span>
      <span>${t.amount}</span>
      <span class="delete" onclick="deleteTransaction(${t.id})">❌</span>
    `;

    list.appendChild(li);

    if (t.amount > 0) income += t.amount;
    else expense += t.amount;
  });

  let balance = income + expense;

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = balance;

  updateChart(income, Math.abs(expense));
}

function updateChart(income, expense) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#00c853", "#ff1744"]
      }]
    }
  });
}

updateUI();