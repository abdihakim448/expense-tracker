const API_URL = 'http://localhost:3000/api/expenses';
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

// ✅ Redirect to login if token is missing
if (!token || token.length < 10) {
  alert('You must be logged in');
  window.location.href = 'login.html';
}

// ✅ Submit form handler
document.getElementById('expense-form').addEventListener('submit', submitForm);

async function submitForm(e) {
  e.preventDefault();

  const id = document.getElementById('expenseId').value;
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const currency = document.getElementById('currency').value.trim();
  const category = document.getElementById('category').value.trim();
  const date_spent = document.getElementById('date_spent').value;
  const file = document.getElementById('file').files[0];

  // ✅ Validate fields
  if (!description || isNaN(amount) || amount < 0 || !currency || !category || !date_spent) {
    alert('Please fill out all fields correctly.');
    return;
  }

  const formData = new FormData();
  formData.append('description', description);
  formData.append('amount', amount);
  formData.append('currency', currency);
  formData.append('category', category);
  formData.append('date_spent', date_spent);

  // ✅ Handle date_created
  let date_created = document.getElementById('date_created').value;
  if (!id) {
    // Only set date_created if creating new expense
    date_created = new Date().toISOString();
  }
  formData.append('date_created', date_created);

  if (file) {
    formData.append('file', file);
  }

  try {
    const res = await fetch(`${API_URL}${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // ❗ Do NOT set 'Content-Type' when using FormData
      },
      body: formData
    });

    if (res.status === 403) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Server response:', data);
      throw new Error('Failed to save expense');
    }

    alert(id ? '✅ Expense updated successfully!' : '✅ Expense added successfully!');
    window.location.href = 'index.html';
  } catch (err) {
    console.error('❌ Submit error:', err);
    alert('Error submitting expense.');
  }
}
