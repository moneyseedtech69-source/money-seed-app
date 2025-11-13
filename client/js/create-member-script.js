document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('create-member-form');
    const messageEl = document.getElementById('message');

    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageEl.textContent = '';

        const username = document.getElementById('username-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const role = document.getElementById('role-select').value;
        const department = document.getElementById('department-select').value;

        const token = localStorage.getItem('userToken');

        if (!token) {
            messageEl.textContent = 'Error: You are not authenticated.';
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // --- THIS IS THE CRITICAL PART ---
                    // This proves you are a logged-in Admin
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role,
                    department
                })
            });

            const data = await response.json();

            if (!response.ok) {
                messageEl.style.color = 'red';
                messageEl.textContent = data.message;
            } else {
                // Success!
                messageEl.style.color = 'green'
                messageEl.textContent = `Success! User '${data.username}' created.`;
                createForm.reset();
            }
        } catch (error) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'Server connection error';
        }
    });
});