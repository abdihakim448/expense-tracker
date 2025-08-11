// 📁 public/login.js

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email')?.value?.trim();
  const password = document.getElementById('password')?.value?.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  const loginBtn = document.querySelector('button[type="submit"]');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  const API_BASE = 'http://localhost:3000'; // ✅ Pointing to backend port

  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid server response (HTML instead of JSON)');
    }

    const data = await response.json();

    if (!response.ok || !data.token) {
      alert(data.error || '❌ Invalid credentials.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user?.username || '');

    alert('✅ Login successful!');
    window.location.href = 'index.html';

  } catch (error) {
    console.error('Login error:', error);
    alert('❌ Network or server error. Please try again.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Log In';
  }
});
