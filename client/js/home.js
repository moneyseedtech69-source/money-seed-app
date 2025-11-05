document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. LOG OUT BUTTON --- */
    const logoutButton = document.querySelector('.btn-logout');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    /* --- 2. NOTIFICATION DROPDOWN --- */
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const closeNotiBtn = document.getElementById('close-noti-btn');

    if (notificationBtn && notificationPanel && closeNotiBtn) {
        // --- Show/Hide on Bell Icon Click ---
        notificationBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = notificationPanel.style.display === 'none';
            notificationPanel.style.display = isHidden ? 'block' : 'none';
        });

        // --- Hide on Close Button (X) Click ---
        closeNotiBtn.addEventListener('click', () => {
            notificationPanel.style.display = 'none';
        });

        // --- Hide when clicking outside the panel ---
        document.addEventListener('click', (event) => {
            if (!notificationBtn.contains(event.target) && !notificationPanel.contains(event.target)) {
                notificationPanel.style.display = 'none';
            }
        });

        // --- Stop clicks *inside* the panel from closing it ---
        notificationPanel.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

});