document.addEventListener('DOMContentLoaded', () => {

    // --- 1.SETUP ---
    const prevButton = document.getElementById('pagination-prev');
    const nextButton = document.getElementById('pagination-next');
    const pageNumbers = document.querySelectorAll('.tab-group input[name="tab"]');

    let currentPage = 1;
    const maxPages = pageNumbers.length;

    // --- 2.MAIN FUNCTION ---
    function updatePagination() {

        // --- Previous Button Logic ---
        if (currentPage === 1) {
            prevButton.style.visibility = 'hidden';
        } else {
            prevButton.style.visibility = 'visible'
        }

        // --- Next Button Logic ---
        if (currentPage === maxPages) {
            nextButton.style.visibility = 'hidden';
        } else {
            nextButton.style.visibility = 'visible';
        }

        pageNumbers[currentPage - 1].checked = true;
    }

    // --- 3.Event Listener ---
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < maxPages) {
            currentPage++;
            updatePagination();
            // TODO: Add code here to load new courses for 'currentPage'
        }
    });

    pageNumbers.forEach(radio => {
        radio.addEventListener('click', () => {
            currentPage = parseInt(radio.value);
            updatePagination();
            // TODO: Add code here to load new courses for 'currentPage'
        });
    });

    // --- 4.Run on Load ---
    updatePagination();
});