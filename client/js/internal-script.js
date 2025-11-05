document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('internal-login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;

        try {
            const response = await fetch('https://money-seed-project-api-9458.onrender.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage.textContent = data.message;
            } else {
                // --- THIS IS THE KEY LOGIC ---
                // Check the role before redirecting

                if (data.role === 'Admin') {
                    // Go to Admin Dashboard
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userDepartment', data.department);
                    window.location.href = 'admin-dashboard.html';
                } else if (data.role === 'Member') {
                    // It's my team! Go to Member Dashboard
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userDepartment', data.department);
                    window.location.href = 'member-dashboard.html';
                } else {
                    // A "Website User" tried to log in here
                    errorMessage.textContent = 'Access Denied. This is for internal team use only.';
                }
            }
        } catch (error) {
            errorMessage.textContent = 'Server connection error';
        }
    });
});