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

    // --- 3. Progress Chart Setting ---
    // 1. Find ALL progress circles
    const allProgressCircles = document.querySelectorAll(".progress-circle");

    // === SET VALUES ===
    // Get colors from the CSS :root (or hardcode them)
    // Using the purple you requested from the test example
    const progressColor = "#6200EA";
    // Using a track color from your dark theme
    const trackColor = "#374151"; // This is var(--bg-tertiary)
    const speed = 20; // Time in ms, lower is faster
    // ====================

    // 2. Loop through each one
    allProgressCircles.forEach(progressBar => {
        // Find the elements for *this* circle
        const progressValueEl = progressBar.querySelector(".progress-value");

        // Get the end value from the HTML data-value attribute
        const endValue = parseInt(progressBar.dataset.value) || 0;

        // Run the animation for *this* circle
        let progressStartValue = 0;
        let progress = setInterval(() => {

            // 1. UPDATE text and graphics with the CURRENT value
            progressValueEl.textContent = `${progressStartValue}%`;
            progressValueEl.style.color = progressColor;
            progressBar.style.background = `conic-gradient(
                ${progressColor} ${progressStartValue * 3.6}deg,
                ${trackColor} ${progressStartValue * 3.6}deg
            )`;

            // 2. CHECK if this is the end value
            if (progressStartValue === endValue) {
                clearInterval(progress);
            }

            // 3. INCREMENT the value for the *next* loop
            progressStartValue++;

        }, speed);
    });

});