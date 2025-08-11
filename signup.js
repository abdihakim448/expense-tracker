// 📁 public/signup.js

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  const API_BASE = 'http://localhost:3000';

  try {
    const res = await fetch(`${API_BASE}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      alert('✅ Signup successful!');
      window.location.href = 'login.html'; // ✅ fixed
    } else {
      alert(`❌ Signup failed: ${data.error}`);
    }
  } catch (err) {
    console.error('❌ Signup failed:', err);
    alert('❌ Signup request failed');
  }
});
