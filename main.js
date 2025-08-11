const API_URL = 'http://localhost:3000/api/expenses';
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

// ✅ Redirect to login if not authenticated
if (!token || token.length < 10) {
  alert('You must be logged in');
  window.location.href = 'login.html';
}

// ✅ Set username and load expenses
window.addEventListener('DOMContentLoaded', () => {
  const usernameEl = document.getElementById('username');
  if (username && usernameEl) {
    usernameEl.textContent = `Logged in as: ${username}`;
  }

  getExpenses();
});

// ✅ Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
});

// ✅ Fetch expenses from backend
async function getExpenses() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 403) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    const expenses = await res.json();
    displayExpenses(expenses);
  } catch (err) {
    console.error('❌ Failed to fetch expenses:', err);
    alert('Failed to load expenses.');
  }
}

// ✅ Display expenses in the table
function displayExpenses(expenses) {
  const tbody = document.getElementById('expenses-list');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!expenses.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="9" style="text-align:center;">No expenses found.</td>`;
    tbody.appendChild(tr);
    return;
  }

  expenses.forEach(({ id, description, amount, currency, category, date_spent, created_at, receiptFile }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td>
      <td>${description || '-'}</td>
      <td>${parseFloat(amount).toFixed(2)}</td>
      <td>${currency || '-'}</td>
      <td>${category || '-'}</td>
      <td>${date_spent || '-'}</td>
      <td>${new Date(created_at).toLocaleString()}</td>
      <td>
        <a href="add.html?id=${id}">Edit</a> |
        <button onclick="deleteExpense(${id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ✅ Delete expense handler
async function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to delete");

    alert("Expense deleted successfully!");
    getExpenses(); // 🔁 Refresh list after deletion
  } catch (err) {
    console.error("❌ Delete error:", err);
    alert("Could not delete expense.");
  }
}

// 🔍 Optional: Stub for filtering (implement logic if needed)
function filterExpenses() {
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  alert(`Filtering from ${fromDate} to ${toDate} (to be implemented)`);
}

// 🔁 Optional: Reset filter
function resetFilter() {
  document.getElementById('fromDate').value = '';
  document.getElementById('toDate').value = '';
  getExpenses();
}
