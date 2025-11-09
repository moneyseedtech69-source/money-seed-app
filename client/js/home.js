document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. LOG OUT BUTTON (v3) --- */
    // The new 3D logout button
    const newLogoutButton = document.getElementById('new-logout-btn');

    if (newLogoutButton) {
        newLogoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    /* --- 2. LOAD USER DATA --- */
    const profileUsername = document.getElementById('profile-btn-username');
    const profileAvatar = document.getElementById('profile-btn-avatar');

    // Get username from localStorage (from signup)
    // Try to find "newUser_username" first, then "tempUsername"
    const savedUsername = localStorage.getItem('newUser_username') || localStorage.getItem('tempUsername');

    // Get avatar from localStorage (from profile)
    const savedAvatar = localStorage.getItem('userAvatar');

    if (savedUsername && profileUsername) {
        profileUsername.textContent = savedUsername;
    }

    if (savedAvatar && profileAvatar) {
        profileAvatar.src = savedAvatar;
    }

    /* --- 3. NOTIFICATION MODAL (NEW) --- */
    const notificationBtn = document.getElementById('new-noti-btn');
    const notificationModal = document.getElementById('notification-modal');
    const closeModalBtn = document.getElementById('noti-modal-close-btn');

    if (notificationBtn && notificationModal && closeModalBtn) {

        // --- Show modal on bell click ---
        notificationBtn.addEventListener('click', () => {
            notificationModal.style.display = 'flex';
        });

        // --- Hide modal on 'X' click ---
        closeModalBtn.addEventListener('click', () => {
            notificationModal.style.display = 'none';
        });

        // --- Hide modal when clicking overlay ---
        notificationModal.addEventListener('click', (event) => {
            // If the user clicked on the dark overlay (the modal-overlay)
            // and NOT the white container (.noti-modal-container)
            if (event.target === notificationModal) {
                notificationModal.style.display = 'none';
            }
        });
    }

    /* --- 4. HEADER SEARCH BAR --- */
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const searchSubmitBtn = document.getElementById('search-submit-btn');

    if (searchInput && searchClearBtn && searchSubmitBtn) {

        // Show/hide clear button based on input
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                searchClearBtn.style.display = 'block';
            } else {
                searchClearBtn.style.display = 'none';
            }
        });

        // Clear button logic
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchClearBtn.style.display = 'none';
            searchInput.focus();
        });

        // Submit button logic
        searchSubmitBtn.addEventListener('click', () => {
            if (searchInput.value.length > 0) {
                alert('Searching for: ' + searchInput.value);
            }
        });

        // Also submit on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stop form from submitting
                searchSubmitBtn.click();
            }
        });
    }

});