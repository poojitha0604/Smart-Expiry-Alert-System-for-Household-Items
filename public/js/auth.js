function switchTab(tab) {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tab}-form`).classList.add('active');
    event.target.classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = '';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            window.location.href = '/';
        } else {
            errorEl.textContent = data.error;
        }
    } catch (err) {
        errorEl.textContent = 'Network error. Try again later.';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const errorEl = document.getElementById('auth-error');
    const successEl = document.getElementById('auth-success');
    errorEl.textContent = '';
    successEl.textContent = '';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            successEl.textContent = 'Registration successful! Please login.';
            setTimeout(() => switchTab('login'), 2000);
        } else {
            errorEl.textContent = data.error;
        }
    } catch (err) {
        errorEl.textContent = 'Network error. Try again later.';
    }
}
