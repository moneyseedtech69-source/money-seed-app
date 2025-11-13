document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-profile-form');
    const messageEl = document.getElementById('message');

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageEl.textContent = '';

        const username = document.getElementById('username-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        const token = localStorage.getItem('userToken');

        const updates = {};
        if (username) {
            updates.username = username;
        }
        if (email) {
            updates.email = email;
        }
        if (password) {
            updates.password = password;
        }

        try {
            // Call the NEW protected API endpoint
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
                messageEl.style.color = 'red';
                messageEl.textContent = data.message;
            } else {
                messageEl.style.color = 'green';
                messageEl.textContent = 'Profile updated successfully!';
                editForm.reset();
            }
        } catch (error) {
            messageEl.style.error = 'red';
            messageEl.textContent = 'Server connection error';
        }
    });
});