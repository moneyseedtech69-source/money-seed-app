document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get Elements ---
    const moduleLinks = document.querySelectorAll('.module-link');
    const moduleContents = document.querySelectorAll('.module-content');
    const congratsMessage = document.getElementById('congrats');
    // Store module IDs in the order they appear
    const moduleOrder = Array.from(moduleLinks).map(link => link.dataset.module);
    let currentModuleIndex = 0;
    let highestUnlockedIndex = 0;

    // --- 2. Function to Show/Hide Module Content ---
    function showModule(moduleIndex) {
        // Ensure index is within bounds
        if (moduleIndex < 0 || moduleIndex >= moduleOrder.length) {
            console.error("Invalid module index:", moduleIndex);
            return;
        }

        const moduleId = moduleOrder[moduleIndex];

        // Hide all module content sections and the congrats message
        moduleContents.forEach(content => content.style.display = 'none');
        if (congratsMessage) congratsMessage.style.display = 'none';

        // Show the target module content
        const targetContent = document.getElementById(moduleId);
        if (targetContent) {
            targetContent.style.display = 'block';
        } else {
            console.error("Content not found for module:", moduleId);
            return;
        }

        // Update active class on sidebar links
        moduleLinks.forEach((link, index) => {
            if (index === moduleIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update navigation buttons within the target module
        updateNavigationButtons(targetContent, moduleIndex);
        // Update the current index
        currentModuleIndex = moduleIndex;
    }

    // --- 3. Function to Update Back/Next/Finish Buttons ---
    function updateNavigationButtons(contentElement, index) {
        const backButton = contentElement.querySelector('.btn-back');
        const nextButton = contentElement.querySelector('.btn-next');
        const finishButton = contentElement.querySelector('.btn-finish');

        if (!backButton || !nextButton || !finishButton) return;

        // Handle Back button visibility
        if (index === 0) {
            backButton.style.visibility = 'hidden';
        } else {
            backButton.style.visibility = 'visible';
        }

        // Handle Next/Finish button visibility
        if (index === moduleOrder.length - 1) {
            nextButton.style.display = 'none';
            finishButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'inline-block';
            finishButton.style.display = 'none';
        }
    }

    // --- 4. Function to Unlock the Next Module ---
    function unlockModule(moduleIndex) {
        if (moduleIndex < 0 || moduleIndex >= moduleOrder.length) return;

        // Update the highest unlocked index if this is further
        if (moduleIndex > highestUnlockedIndex) {
            highestUnlockedIndex = moduleIndex;
        }

        // Find the corresponding link and remove 'locked' class & icon
        const linkToUnlock = document.querySelector(`.module-link[data-module="${moduleOrder[moduleIndex]}"]`);
        if (linkToUnlock && linkToUnlock.classList.contains('locked')) {
            linkToUnlock.classList.remove('locked');
            const lockIcon = linkToUnlock.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.remove();
            }
            console.log("Unlocked:", moduleOrder[moduleIndex]);
        }
    }

    // --- 5. Event Listeners for Sidebar Links ---
    moduleLinks.forEach((link, index) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Only allow navigation if the link is NOT locked
            if (!link.classList.contains('locked')) {
                showModule(index);
            } else {
                console.log("Module locked:", link.dataset.module); // For debugging
                // Optional: Show a small message or animation indicating it's locked
            }
        });
    });

    // --- 6. Event Listeners for Back/Next/Finish Buttons (using event delegation) ---
    const contentArea = document.querySelector('.course-content-area');
    if (contentArea) {
        contentArea.addEventListener('click', (event) => {
            // Check if the clicked element is a Back button
            if (event.target.classList.contains('btn-back')) {
                if (currentModuleIndex > 0) {
                    showModule(currentModuleIndex - 1);
                }
            }

            // Check if the clicked element is a Next button
            else if (event.target.classList.contains('btn-next')) {
                if (currentModuleIndex < moduleOrder.length - 1) {
                    const nextIndex = currentModuleIndex + 1;
                    // Unlock the *next* module before showing it
                    unlockModule(nextIndex);
                    // Now show the next module
                    showModule(nextIndex);
                }
            }

            // Check if the clicked element is a Finish button
            else if (event.target.classList.contains('btn-finish')) {
                // Hide all module content and show congrats message
                moduleContents.forEach(content => content.style.display = 'none');
                if (congratsMessage) congratsMessage.style.display = 'block';

                // Optional: Update sidebar - maybe deactivate all links?
                moduleLinks.forEach(link => link.classList.remove('active'));
                console.log("Course Finished!");
            }
        });
    }

    // --- 7. Initial Setup ---
    // Ensure only the first module link is unlocked initially (Overview)
    // (HTML already sets only Overview as unlocked, JS respects this)
    // Show the first module (Overview) on page load
    showModule(0);
});