// client/js/admin-dashboard-script.js

// === 1. GET ALL DATA WHEN PAGE LOADS ===
document.addEventListener('DOMContentLoaded', () => {

    // --- Auth Guard & Permissions ---
    const token = localStorage.getItem('userToken');
    const department = localStorage.getItem('userDepartment');

    if (!token) {
        window.location.href = 'internal-login.html';
        return; // Stop running the script
    }

    // Show "Create Member" link if Tech Admin
    if (department === 'Tech') {
        document.getElementById('create-member-link').style.display = 'inline';
    }

    // --- Logout Button Logic ---
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userDepartment');
        window.location.href = 'internal-login.html';
    });

    // --- NEW: Fetch and Display All Users ---
    const userListBody = document.getElementById('user-list-body');

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://money-seed-project-api-123.onrender.com/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Must send token to prove we're Admin
                }
            });

            if (!response.ok) {
                userListBody.innerHTML = `<tr><td colspan="5">Error loading users.</td></tr>`;
                return;
            }

            const users = await response.json();

            // Clear loading text
            userListBody.innerHTML = '';

            // Loop through each user and add them to the table
            users.forEach(user => {

                // --- NEW LOGIC ---
                let deleteButtonHtml = ''; // Create an empty variable
                if (user.title === 'CEO') {
                    // If user is CEO, show grayed-out text instead of a button
                    deleteButtonHtml = '<span style="color: #999;">(Cannot Delete)</span>';
                } else {
                    // Otherwise, show the normal delete button
                    deleteButtonHtml = `<span class="delete-btn" data-id="${user._id}">Delete</span>`;
                }
                // --- END NEW LOGIC ---

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.department}</td>
                    <td>
                        ${deleteButtonHtml} </td>
                `;
                userListBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching users:', error);
            userListBody.innerHTML = `<tr><td colspan="5">Server connection error.</td></tr>`;
        }
    };

    // Run the function!
    fetchUsers();

    // We must listen for clicks on the TABLE BODY,
    // because the buttons are added dynamically.
    userListBody.addEventListener('click', async (e) => {
        // Check if the click was on a 'delete-btn'
        if (e.target.classList.contains('delete-btn')) {

            // Get the user ID from the button's 'data-id' attribute
            const userId = e.target.getAttribute('data-id');
            const username = e.target.closest('tr').cells[0].textContent; // Get username for confirm

            // Show a confirmation popup
            if (!confirm(`Are you sure you want to delete the user "${username}"?`)) {
                return; // User clicked "Cancel"
            }

            try {
                const response = await fetch(`https://money-seed-project-api-123.onrender.com/api/users${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Send token to prove we're Admin
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    // If server blocked it (e.g., Content Admin trying to delete you)
                    alert('Error: ' + data.message);
                } else {
                    // Success!
                    alert(data.message);
                    // Reload the user list to show the change
                    fetchUsers();
                }

            } catch (error) {
                console.error('Delete error:', error);
                alert('Server connection error.');
            }
        }
    });
});