document.addEventListener('DOMContentLoaded', () => {

    /* ============================================= */
    /* == PART 1: TROPHY CAROUSEL (2-Slide Logic) == */
    /* ============================================= */
    const track = document.querySelector('.trophy-carousel-track');

    // Check if track exists
    if (track) {
        // Get the SLIDES (trophy-slide), not the cards
        const slides = Array.from(track.children).filter(child => child.classList.contains('trophy-slide'));
        const nextButton = document.querySelector('.trophy-arrow.next');
        const prevButton = document.querySelector('.trophy-arrow.prev');

        if (slides.length > 0 && nextButton && prevButton) {

            let currentIndex = 0;
            const totalSlides = slides.length; // This should be 2

            // Function to update arrow states
            const updateArrows = () => {
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex === totalSlides - 1;
            };

            // Function to move the track
            const goToSlide = (slideIndex) => {
                // Move 50% for slide 1, 0% for slide 0
                track.style.transform = `translateX(-${slideIndex * 50}%)`;
                currentIndex = slideIndex;
                updateArrows();
            };

            // Click next
            nextButton.addEventListener('click', () => {
                if (currentIndex < totalSlides - 1) {
                    goToSlide(currentIndex + 1);
                }
            });

            // Click previous
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            });

            // Set initial state
            goToSlide(0); // Go to first slide

        } else {
            console.error("Trophy carousel elements (slides/buttons) not found!");
        }
    } else {
        console.error("Trophy carousel track not found!");
    }

    /* ============================================= */
    /* == PART 2: PROFILE BACKGROUND CONTROLS == */
    /* ============================================= */
    // (This part was correct, leaving it as is)
    const bgContainer = document.getElementById('profile-bg-container');
    const bgImage = document.getElementById('profile-bg-image');
    const changeBgBtn = document.getElementById('btn-change-bg');
    const fileInput = document.getElementById('bg-file-input');
    const adjustBgBtn = document.getElementById('btn-adjust-bg');
    const saveBgBtn = document.getElementById('btn-save-bg');

    if (bgContainer && bgImage && changeBgBtn && fileInput && adjustBgBtn && saveBgBtn) {
        changeBgBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    bgImage.src = e.target.result;
                    bgImage.style.objectPosition = '50% 50%';
                };
                reader.readAsDataURL(file);
            }
        });

        let isAdjusting = false;
        let isDragging = false;
        let startPos = { x: 0, y: 0 };
        let startImgPos = { x: 50, y: 50 };

        const getImgPos = () => {
            const pos = window.getComputedStyle(bgImage).objectPosition.split(' ');
            return { x: parseFloat(pos[0]), y: parseFloat(pos[1]) };
        };

        adjustBgBtn.addEventListener('click', () => {
            isAdjusting = !isAdjusting;
            bgImage.classList.toggle('is-adjusting', isAdjusting);
            adjustBgBtn.textContent = isAdjusting ? 'Cancel Adjust' : 'Adjust Background';
            saveBgBtn.style.display = isAdjusting ? 'inline-block' : 'none';
        });

        saveBgBtn.addEventListener('click', () => {
            isAdjusting = false;
            bgImage.classList.remove('is-adjusting');
            adjustBgBtn.textContent = 'Adjust Background';
            saveBgBtn.style.display = 'none';
            console.log('Saved position:', bgImage.style.objectPosition);
        });

        bgImage.addEventListener('mousedown', (e) => {
            if (!isAdjusting) return;
            e.preventDefault();
            isDragging = true;
            startPos = { x: e.clientX, y: e.clientY };
            startImgPos = getImgPos();
        });

        bgContainer.addEventListener('mousemove', (e) => {
            if (!isDragging || !isAdjusting) return;
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;
            const newX = startImgPos.x + deltaX;
            const newY = startImgPos.y + deltaY;
            bgImage.style.objectPosition = `${newX}px ${newY}px`;
        });

        window.addEventListener('mouseup', () => isDragging = false);
        bgContainer.addEventListener('mouseleave', () => isDragging = false);
    }

    /* ============================================= */
    /* == PART 3: EDIT PROFILE MODAL == */
    /* ============================================= */
    // (This part was correct, leaving it as is)
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    const modalOverlay = document.getElementById('edit-profile-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalLinks = document.querySelectorAll('.modal-link');
    const modalSections = document.querySelectorAll('.modal-section');
    const showPasswordResetBtn = document.getElementById('btn-show-password-reset');
    const passwordResetContent = document.getElementById('password-reset-content');
    const cancelPasswordResetBtn = document.getElementById('btn-cancel-password-reset');
    const avatarUpload = document.getElementById('avatar-upload');
    const modalAvatar = document.querySelector('.modal-avatar');

    if (editProfileBtn && modalOverlay && modalCloseBtn && modalLinks.length > 0 && modalSections.length > 0) {

        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.style.display = 'flex';
        });

        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });

        modalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                modalSections.forEach(section => {
                    section.style.display = 'none';
                });
                document.getElementById(targetId).style.display = 'block';
                modalLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        if (showPasswordResetBtn && passwordResetContent) {
            showPasswordResetBtn.addEventListener('click', () => {
                passwordResetContent.style.display = 'block';
            });
        }

        if (cancelPasswordResetBtn && passwordResetContent) {
            cancelPasswordResetBtn.addEventListener('click', () => {
                passwordResetContent.style.display = 'none';
            });
        }

        if (avatarUpload && modalAvatar) {
            avatarUpload.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        modalAvatar.src = e.target.result;
                        const mainProfilePic = document.querySelector('.profile-picture img');
                        if (mainProfilePic) {
                            mainProfilePic.src = e.target.result;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    } // End modal JS
});