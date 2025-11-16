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

    // --- 4. Speech Bubble Logic ---
    const introMessage = "Welcome back, keep shining today!";
    const quotes = [
        "You’re capable of amazing things.",
        "Small steps lead to success.",
        "Stay focused, keep moving forward.",
        "Believe in yourself every day.",
        "Your journey starts right here."
    ];

    // Find the speech bubble element
    const bubble = document.querySelector('.speech-bubble');

    if (bubble) { // Check if the bubble exists on the page
        let quoteIndex = 0;

        // This is the function that runs on a loop
        const startQuoteRotation = () => {
            // Set an interval to run forever
            // (4000ms = 4 seconds. 2s is a bit too fast for reading)
            setInterval(() => {
                // 1. Fade the bubble out
                bubble.style.opacity = 0;

                // 2. Wait 500ms (for the CSS transition to finish)
                setTimeout(() => {
                    // 3. Change the text & update the index
                    bubble.textContent = quotes[quoteIndex];
                    quoteIndex = (quoteIndex + 1) % quotes.length;

                    // 4. Fade the bubble back in
                    bubble.style.opacity = 1;
                }, 500); // 500ms must match your CSS transition time

            }, 4000);
        };

        // --- This is the main startup logic ---
        const showWelcome = sessionStorage.getItem('showWelcome');

        if (showWelcome === 'true') {
            // 1. User JUST logged in. Show the intro message.
            bubble.textContent = introMessage;

            // 2. Set the flag to false so it won't show again
            sessionStorage.setItem('showWelcome', 'false');

            // 3. Start the regular rotation after the intro message has been read
            setTimeout(startQuoteRotation, 4000);
        } else {
            // User is already in the session.
            // Show the first quote immediately and start the rotation.
            bubble.textContent = quotes[0];
            quoteIndex = 1; // Set the *next* quote to be index 1
            startQuoteRotation();
        }
    }
    // --- End of Speech Bubble Logic ---

    // --- 5. Digital Clock Logic ---

    // Find the new elements
    const digitalClockTimeEl = document.querySelector('#clock .time');
    const digitalClockDateEl = document.querySelector('#clock .date');

    // Logic from your main.js
    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    function zeroPadding(num, digit) {
        var zero = '';
        for (var i = 0; i < digit; i++) {
            zero += '0';
        }
        return (zero + num).slice(-digit);
    }

    function updateDigitalClock() {
        var cd = new Date();

        // Format time and date
        const timeStr = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
        const dateStr = zeroPadding(cd.getDate(), 2) + '/' + zeroPadding(cd.getMonth() + 1, 2) + '/' + zeroPadding(cd.getFullYear(), 4).slice(-2) + ' ' + week[cd.getDay()];

        // Update the HTML
        if (digitalClockTimeEl) digitalClockTimeEl.textContent = timeStr;
        if (digitalClockDateEl) digitalClockDateEl.textContent = dateStr;
    }

    // Check if the elements exist on the page
    if (digitalClockTimeEl && digitalClockDateEl) {
        // Run it once on load
        updateDigitalClock();
        // Set it to update every second
        setInterval(updateDigitalClock, 1000);
    }

    // --- 6. "More Updates" Arrow Logic ---

    const updatesList = document.querySelector('.updates-list');
    const moreArrow = document.getElementById('more-updates-arrow');

    // Check if the elements exist
    if (updatesList && moreArrow) {
        // Check if the content is taller than the visible box
        if (updatesList.scrollHeight > updatesList.clientHeight) {
            // If yes, show the arrow
            moreArrow.style.display = 'block';
        }
    }

});