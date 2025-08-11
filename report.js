const API_URL = 'http://localhost:3000/api/expenses';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
  generateReport();
});

async function generateReport() {
  if (!token) {
    alert('Please log in to view your report.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch expenses');
    const expenses = await res.json();

    const reportList = document.getElementById('monthly-summary');
    const canvas = document.getElementById('expenseChart');

    if (!canvas || !reportList) {
      console.error('Canvas or summary container not found.');
      return;
    }

    const ctx = canvas.getContext('2d');
    reportList.innerHTML = '';

    let grandTotal = 0;
    const monthlyData = {};  // { 'Jul 2025': { USD: 100, KES: 500 } }
    const currencies = new Set();

    expenses.forEach(exp => {
      const currency = exp.currency || 'UNK';
      currencies.add(currency);

      const date = new Date(exp.date_spent);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthlyData[month]) monthlyData[month] = {};
      monthlyData[month][currency] = (monthlyData[month][currency] || 0) + parseFloat(exp.amount);

      grandTotal += parseFloat(exp.amount);
    });

    // Show total
    document.getElementById('total-expense').textContent = grandTotal.toFixed(2);

    // Prepare chart data
    const months = Object.keys(monthlyData);
    const currencyList = Array.from(currencies);

    const datasets = currencyList.map((currency, index) => {
      const data = months.map(month => monthlyData[month][currency] || 0);
      const color = `hsl(${index * 90 % 360}, 70%, 50%)`;

      return {
        label: currency,
        data,
        backgroundColor: color
      };
    });

    // Display monthly summary
    months.forEach(month => {
      const monthData = monthlyData[month];
      const summaryText = `${month} → ` + currencyList.map(cur => `${cur}: ${(monthData[cur] || 0).toFixed(2)}`).join(', ');
      const p = document.createElement('p');
      p.textContent = summaryText;
      reportList.appendChild(p);
    });

    // Render chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Expenses by Currency'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });

  } catch (err) {
    console.error('Report error:', err);
    alert('Error loading report.');
  }
}
