// client/js/admin-dashboard-script.js

// This file is now very simple!
// It just handles the Auth Guard and Logout button for the main hub page.

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Auth Guard ---
    // (The HTML has a guard, but we'll double-check)
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'internal-login.html';
        return;
    }

    // --- 2. Logout Button Logic ---
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userDepartment');
        localStorage.removeItem('userTitle');
        window.location.href = 'internal-login.html';
    });

    // All the fetchUsers and deleteUser logic has been MOVED
    // to user-management-script.js
});