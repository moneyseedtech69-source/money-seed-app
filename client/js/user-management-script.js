// client/js/user-management-script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Auth Guard & Get User Info ---
    const token = localStorage.getItem('userToken');
    const department = localStorage.getItem('userDepartment');
    const title = localStorage.getItem('userTitle');

    if (!token) {
        window.location.href = 'internal-login.html';
        return;
    }

    // --- 2. Show "Create Member" link logic ---
    if (title === 'Technical Co-Founder') {
        document.getElementById('create-member-link').style.display = 'inline';
    }

    // --- 3. Logout Button Logic ---
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userDepartment');
        localStorage.removeItem('userTitle');
        window.location.href = 'internal-login.html';
    });

    // --- 4. NEW: Fetch, Group, and Display All Users ---
    const userManagementContainer = document.getElementById('user-management-container');

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                userManagementContainer.innerHTML = `<p>Error loading users.</p>`;
                return;
            }

            // This is now an object, e.g., { "Tech": [...], "Content": [...] }
            const groupedUsers = await response.json();
            userManagementContainer.innerHTML = ''; // Clear loading text

            // Loop through each department in the object (e.g., "Tech", "Content")
            for (const departmentName in groupedUsers) {
                const users = groupedUsers[departmentName]; // Get the list of users

                // Create the title for this department's table
                let titleHtml = `<h3>User Management (${departmentName} Department)</h3>`;

                // Create the table structure
                let tableHtml = `
                    <table class="department-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                // Loop through the users for this department and add them
                users.forEach(user => {
                    let deleteButtonHtml = '';
                    if (user.title === 'Technical Co-Founder') {
                        deleteButtonHtml = '<span style="color: #999;">(Cannot Delete)</span>';
                    } else {
                        deleteButtonHtml = `<span class="delete-btn" data-id="${user._id}">Delete</span>`;
                    }

                    tableHtml += `
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${deleteButtonHtml}</td>
                        </tr>
                    `;
                });

                tableHtml += `</tbody></table>`; // Close the table

                // Add the title and table to the page
                userManagementContainer.innerHTML += (titleHtml + tableHtml);
            }

        } catch (error) {
            console.error('Error fetching users:', error);
            userManagementContainer.innerHTML = `<p>Server connection error.</p>`;
        }
    };

    // Run the function!
    fetchUsers();

    // --- 5. NEW: Delete User Logic (Attached to the PARENT container) ---
    // This is safer and works for all tables
    userManagementContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const userId = e.target.getAttribute('data-id');
            const username = e.target.closest('tr').cells[0].textContent;

            if (!confirm(`Are you sure you want to delete the user "${username}"?`)) {
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                if (!response.ok) {
                    alert('Error: ' + data.message);
                } else {
                    alert(data.message);
                    fetchUsers(); // Reload ALL user lists
                }

            } catch (error) {
                console.error('Delete error:', error);
                alert('Server connection error.');
            }
        }
    });
});