document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. ROTATING QUOTES (HERO SECTION) --- */
    // This part remains unchanged
    const quotes = [
        `"An investment in knowledge pays the best interest." - Benjamin Franklin`,
        `"The best way to predict the future is to create it." - Peter Drucker`,
        `"Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work." - Steve Jobs`,
        `"Success is not final; failure is not fatal: It is the courage to continue that counts." - Winston Churchill`,
        `"The secret of getting ahead is getting started." - Mark Twain`
    ];

    const quoteDisplay = document.getElementById('quote-display');
    let currentQuoteIndex = 0;

    // This function changes the quote
    function changeQuote() {
        if (quoteDisplay) {
            // 1. Fade out
            quoteDisplay.style.opacity = '0';

            // 2. Wait for the fade-out (400ms) to finish
            setTimeout(() => {
                // 3. Change the text
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                quoteDisplay.textContent = quotes[currentQuoteIndex];

                // 4. Fade back in
                quoteDisplay.style.opacity = '1';
            }, 400); // This time MUST match the CSS transition time
        }
    }

    // Set initial opacity so it's not invisible
    if (quoteDisplay) {
        quoteDisplay.style.opacity = '1';
    }

    // Run the changeQuote function every 3.5 seconds
    setInterval(changeQuote, 3500);
    setInterval(changeQuote, 3500);

    /* --- 2. UNIVERSAL CAROUSEL INITIALIZER --- */
    // We find ALL carousels on the page
    const carousels = document.querySelectorAll('.carousel-wrapper');

    // We loop through each one and give it its own functionality
    carousels.forEach(carousel => {

        // We find the elements *inside* this specific carousel
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.right-arrow');
        const prevButton = carousel.querySelector('.left-arrow');

        // Check if all parts exist for this carousel
        if (track && slides.length > 0 && nextButton && prevButton) {

            const totalSlides = slides.length;

            // Start on slide 1 (A3, A4, A5 are visible, A4 is central)
            // Note: Arrays are 0-indexed, so index 1 is the 2nd slide (A3)
            let currentIndex = 1;

            // This function updates all slide classes and moves the track
            function updateCarousel(targetIndex) {

                // 1. Calculate the new transform value
                const newTransform = -33.333 * targetIndex;

                // 2. Move the track
                track.style.transform = `translateX(${newTransform}%)`;

                // 3. Update the 'central-card' class
                slides.forEach(slide => {
                    // Find the card *inside* this slide
                    const card = slide.querySelector('.value-card, .collab-card');
                    if (card) {
                        card.classList.remove('central-card');
                    }
                });

                // 4. Add class to the new central slide
                if (slides[targetIndex + 1]) {
                    // Find the card in the *new* central slide
                    const centralCard = slides[targetIndex + 1].querySelector('.value-card, .collab-card');
                    if (centralCard) {
                        centralCard.classList.add('central-card');
                    }
                }

                // 5. Update the currentIndex
                currentIndex = targetIndex;
            }

            // When the user clicks the "Next" (right) arrow
            nextButton.addEventListener('click', () => {
                // Stop at the 3rd slide (index 2) because that's the
                // last position where 3 slides are visible (A4, A5, A6)
                if (currentIndex < totalSlides - 3) { // Use -3 to show 3 slides at the end
                    updateCarousel(currentIndex + 1);
                }
            });

            // When the user clicks the "Previous" (left) arrow
            prevButton.addEventListener('click', () => {
                // Stop at the 1st slide (index 0)
                if (currentIndex > 0) { // Use 0 to stop at the beginning
                    updateCarousel(currentIndex - 1);
                }
            });

            // This makes sure the correct card (A4) is highlighted on first load
            updateCarousel(currentIndex);
        }
    });

    /* --- 3. MOBILE MENU (We'll add responsive CSS for this next) --- */
    // This part remains unchanged
    const menuToggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.main-header');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            header.classList.toggle('is-active');
        });
    }

    /* --- 4. SCROLL-REVEAL ANIMATION --- */

    // 1. Select all the sections we added the class to
    const selectionsToFade = document.querySelectorAll('.fade-up-section');

    // 2. Set up the observer options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // 3. Create the observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 4. Tell the observer to watch each of our sections
    selectionsToFade.forEach(section => {
        observer.observe(section);
    });

    /* --- 6. DARK MODE LOGIC --- */

    // 1. Define our elements
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'moneyseed-theme';

    // 2. Function to apply the saved theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.checked = true;
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.checked = false;
            }
        }
    }

    // 3. Function to save the theme
    function saveTheme(theme) {
        localStorage.setItem(themeKey, theme);
    }

    // 4. THIS IS THE MOST IMPORTANT PART:
    //    Check for a saved theme when *any* page loads
    //    Run this *immediately*
    const savedTheme = localStorage.getItem(themeKey) || 'light'; // 'light' is the default
    applyTheme(savedTheme);


    // 5. Add a listener *only if* the toggle exists on this page
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                applyTheme('dark');
                saveTheme('dark');
            } else {
                applyTheme('light');
                saveTheme('light');
            }
        });
    }

    /* --- 7. STICKY HEADER WITH SHADOW --- */
    const header1 = document.querySelector('.main-header');

    if (header1) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header1.classList.add('is-scrolled');
            } else {
                header1.classList.remove('is-scrolled');
            }
        });
    }

});