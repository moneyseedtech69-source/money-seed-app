document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GET ELEMENTS ---
    const bookmarkButton = document.getElementById('bookmark-btn');
    const feedbackButton = document.getElementById('feedback-btn');
    const feedbackPopup = document.getElementById('feedback-popup');
    const closeFeedbackButton = document.getElementById('close-feedback-btn');
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackModalOverlay = document.getElementById('feedback-modal-overlay');
    const newCommentTextarea = document.querySelector('.new-comment textarea');
    const postCommentButton = document.querySelector('.new-comment button');
    const commentList = document.querySelector('.comment-list');
    const sidebarLinks = document.querySelectorAll('.heading-link');
    const blogHeadings = document.querySelectorAll('.blog-body h3'); // Assuming h3 are section starts

    // Basic checks
    if (!feedbackButton || !feedbackPopup || !closeFeedbackButton || !feedbackForm || !newCommentTextarea || !postCommentButton || !commentList) {
        console.error("Blog detail script could not find all required elements!");
        return;
    }

    // --- 2. LIKE BUTTON FUNCTIONALITY ---


    // --- 3. FEEDBACK POPUP FUNCTIONALITY ---
    feedbackButton.addEventListener('click', () => {
        feedbackModalOverlay.style.display = 'flex';
    });

    closeFeedbackButton.addEventListener('click', () => {
        feedbackModalOverlay.style.display = 'none';
    });

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Get the new values
        const selectedRating = feedbackForm.querySelector('input[name="rating"]:checked');
        const feedbackText = document.getElementById('feedback-text').value;

        // 2. Log them (you can send to a server later)
        console.log("Feedback submitted:");
        console.log("Rating:", selectedRating ? selectedRating.value : "No rating");
        console.log("Text:", feedbackText);

        // 3. Show the "Thank You" message
        document.getElementById('feedback-form-content').style.display = 'none';
        document.getElementById('feedback-thanks').style.display = 'block';

        // 4. Reset the form for next time
        feedbackForm.reset();
        document.getElementById('feedback-text').value = '';

        // 5. Automatically close the popup after 3 seconds
        setTimeout(() => {
            // --- THIS IS THE FIXED LINE ---
            feedbackModalOverlay.style.display = 'none'; // <-- Hide the OVERLAY, not the popup
            // --- END OF FIX ---

            // Reset to show the form again, not the thanks message
            document.getElementById('feedback-form-content').style.display = 'block';
            document.getElementById('feedback-thanks').style.display = 'none';
        }, 3000);
    });

    // --- 4. ADD NEW COMMENT FUNCTIONALITY ---
    postCommentButton.addEventListener('click', () => {
        const commentText = newCommentTextarea.value.trim(); // Get text and remove whitespace

        if (commentText === "") {
            return; // Don't add empty comments
        }

        // --- Create the new comment elements ---
        const newCommentItem = document.createElement('li');
        newCommentItem.classList.add('comment-item');

        const avatarImg = document.createElement('img');
        avatarImg.src = 'images/avatar-profile-1.png'; // Use your own avatar placeholder
        avatarImg.alt = 'Your Avatar';
        avatarImg.classList.add('comment-avatar');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('comment-content');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('comment-header');
        const authorSpan = document.createElement('span');
        authorSpan.classList.add('comment-author');
        authorSpan.textContent = 'You'; // Placeholder for current user
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('comment-date');
        dateSpan.textContent = `on ${new Date().toLocaleDateString()}`; // Add current date
        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(dateSpan);

        const textP = document.createElement('p');
        textP.classList.add('comment-text');
        textP.textContent = commentText;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('comment-actions');
        const likeBtn = document.createElement('button');
        likeBtn.classList.add('comment-action-btn', 'btn-comment-like');
        likeBtn.textContent = 'Like';
        const likeCountSpanNew = document.createElement('span');
        likeCountSpanNew.classList.add('comment-like-count');
        likeCountSpanNew.textContent = '0';
        const replyBtn = document.createElement('button');
        replyBtn.classList.add('comment-action-btn', 'btn-comment-reply');
        replyBtn.textContent = 'Reply';
        actionsDiv.appendChild(likeBtn);
        actionsDiv.appendChild(likeCountSpanNew);
        actionsDiv.appendChild(replyBtn);

        // Add the Hidden Reply Area for new comments
        const replyAreaDiv = document.createElement('div');
        replyAreaDiv.classList.add('reply-input-area');
        replyAreaDiv.style.display = 'none'; // Initially hidden
        const replyTextarea = document.createElement('textarea');
        replyTextarea.placeholder = 'Write a reply...';
        replyTextarea.rows = 2;
        const postReplyBtn = document.createElement('button');
        postReplyBtn.classList.add('btn', 'btn-primary-alt', 'btn-post-reply');
        postReplyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
        replyAreaDiv.appendChild(replyTextarea);
        replyAreaDiv.appendChild(postReplyBtn);

        // --- Assemble the new comment ---
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textP);
        contentDiv.appendChild(actionsDiv);
        contentDiv.appendChild(replyAreaDiv);
        newCommentItem.appendChild(avatarImg);
        newCommentItem.appendChild(contentDiv);

        // --- Add the new comment to the list ---
        commentList.appendChild(newCommentItem);

        // --- Clear the textarea and reset its height ---
        newCommentTextarea.value = '';
        newCommentTextarea.style.height = 'auto'; // Reset height before recalculating
        newCommentTextarea.style.height = '60px'; // Reset to default min-height
    });

    // --- 5. COMMENT ACTIONS (LIKE/REPLY - Basic) ---
    commentList.addEventListener('click', (event) => {
        const targetButton = event.target;

        // --- Handle LIKE clicks ---
        if (targetButton.classList.contains('btn-comment-like')) {
            // Find the parent comment item and the count span
            const commentItem = targetButton.closest('.comment-item');
            const countSpan = commentItem.querySelector('.comment-like-count');
            let currentCount = parseInt(countSpan.textContent) || 0; // Get current count, default to 0

            targetButton.classList.toggle('liked'); // Toggle visual state

            if (targetButton.classList.contains('liked')) {
                targetButton.textContent = 'Liked';
                currentCount++; // Increment count
            } else {
                targetButton.textContent = 'Like';
                currentCount--; // Decrement count
            }
            countSpan.textContent = currentCount; // Update count display
            console.log("Comment Like clicked, count:", currentCount);
        }
        // --- Handle REPLY clicks ---
        else if (targetButton.classList.contains('btn-comment-reply')) {
            console.log("Comment Reply clicked");
            // Find the parent comment item and the reply area
            const commentItem = targetButton.closest('.comment-item');
            const replyArea = commentItem.querySelector('.reply-input-area');

            if (replyArea) {
                // Toggle the display of the reply area
                const isHidden = replyArea.style.display === 'none';
                replyArea.style.display = isHidden ? 'block' : 'none';
                if (isHidden) {
                    // Optional: focus the textarea when shown
                    replyArea.querySelector('textarea').focus();
                }
            }
        }
        // --- Handle POST REPLY clicks ---
        else if (targetButton.classList.contains('btn-post-reply')) {
            const replyArea = targetButton.closest('.reply-input-area');
            const replyTextarea = replyArea.querySelector('textarea');
            const replyText = replyTextarea.value.trim();

            if (replyText) {
                // --- Create the new reply elements ---
                const replyItem = document.createElement('li');
                replyItem.classList.add('reply-item');

                // Avatar (optional, can reuse placeholder)
                const avatarImg = document.createElement('img');
                avatarImg.src = 'images/avatar-profile-1.png';
                avatarImg.alt = 'You';
                avatarImg.classList.add('comment-avatar');

                // Content container
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('comment-content');

                // Header (Author + Date)
                const headerDiv = document.createElement('div');
                headerDiv.classList.add('comment-header');
                const authorSpan = document.createElement('span');
                authorSpan.classList.add('comment-author');
                authorSpan.textContent = 'You';
                const dateSpan = document.createElement('Span');
                dateSpan.classList.add('comment-date');
                dateSpan.textContent = `on ${new Date().toLocaleDateString()}`;
                headerDiv.appendChild(authorSpan);
                headerDiv.appendChild(dateSpan);

                // Reply Text
                const textP = document.createElement('p');
                textP.classList.add('comment-text');
                textP.textContent = replyText;

                // Reply Actions (Like only for simplicity, could add Reply)
                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('comment-action');
                const likeBtn = document.createElement('button');
                likeBtn.classList.add('comment-action-btn', 'btn-comment-like');
                likeBtn.textContent = 'Like';
                const likeCountSpanNew = document.createElement('span');
                likeCountSpanNew.classList.add('comment-like-count');
                likeCountSpanNew.textContent(likeBtn);
                actionsDiv.appendChild(likeCountSpanNew);

                // Assemble the reply content
                contentDiv.appendChild(headerDiv);
                contentDiv.appendChild(textP);
                contentDiv.appendChild(actionsDiv);

                // Assemble the reply item
                replyItem.appendChild(avatarImg);
                replyItem.appendChild(contentDiv);

                // --- Add the reply to the container ---
                const commentContent = targetButton.closest('.comment-content');
                const repliesContainer = commentContent.querySelector('.replies-container');

                if (repliesContainer) {
                    repliesContainer.appendChild(replyItem);
                    repliesContainer.style.display = 'block';

                    const viewRepliesBtn = commentContent.querySelector('view-replies-btn');
                    if (viewRepliesBtn) {
                        const count = repliesContainer.children.length;
                        viewRepliesBtn.querySelector('.reply-count-text').textContent = `${count} ${count === 1 ? 'reply' : 'replies'}`;
                        viewRepliesBtn.style.display = 'inline-flex';
                    }
                }

                replyTextarea.value = '';
                replyArea.style.display = 'none';
                console.log("Reply posted:", replyText);


            }
        }
    });
    // Add a simple style for the 'liked' state (optional, add to CSS)
    // .comment-action-btn.liked { color: var(--color-highlight); font-weight: bold; }

    // --- 6. TEXTAREA AUTO-RESIZE ---
    newCommentTextarea.addEventListener('input', () => {
        newCommentTextarea.style.height = 'auto'; // Temporarily shrink to get scrollHeight
        // Set height to scrollHeight (content height) but not less than initial height (e.g., 60px)
        newCommentTextarea.style.height = `${Math.max(newCommentTextarea.scrollHeight, 60)}px`;
    });

    // --- 7. SIDEBAR SCROLL SPY (Highlight link based on scroll position) ---
    // (This is a basic implementation - might need tweaking)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.heading-link[href="#${id}"]`);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                // Remove active from all links
                sidebarLinks.forEach(link => link.classList.remove('active'));
                // Add active to the intersecting one
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: "-40% 0px -60% 0px", // Adjust margins to trigger when heading is roughly centered
        threshold: 0 // Trigger as soon as element enters/leaves rootMargin area
    });

    // Observe each heading (h3) in the blog body
    blogHeadings.forEach(heading => {
        observer.observe(heading);
    });

    // Add smooth scrolling for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- 8. BOOKMARK BUTTON FUNCTIONALITY ---
    if (bookmarkButton) {
        bookmarkButton.addEventListener('click', () => {
            bookmarkButton.classList.toggle('saved');

            if (bookmarkButton.classList.contains('saved')) {
                console.log('Blog post saved to bookmarks');
            } else {
                console.log('Blog post removed from bookmarks');
            }
        });
    }

    // --- 9. "SEE MORE" COMMENTS FUNCTIONALITY ---
    const seeMoreButton = document.getElementById('see-more-comments');
    const commentsPerLoad = 4; // How many comments to show at a time

    function updateSeeMoreButton() {
        // Find all hidden comments
        const hiddenComments = commentList.querySelectorAll('.comment-item:not(.is-visible)');

        if (hiddenComments.length > 0) {
            seeMoreButton.style.display = 'block'; // Show the button
        } else {
            seeMoreButton.style.display = 'none'; // Hide the button
        }
    }

    function showNextComments() {
        // Find all comments that are currently hidden
        const hiddenComments = commentList.querySelectorAll('.comment-item:not(.is-visible)');

        // Loop through the *next 4* (or fewer)
        for (let i = 0; i < commentsPerLoad && i < hiddenComments.length; i++) {
            hiddenComments[i].classList.add('is-visible'); // Add our "visible" class
            hiddenComments[i].style.display = 'flex'; // Force it to show
        }

        // Check again if the button should still be visible
        updateSeeMoreButton();
    }

    // --- On Page Load ---
    // 1. Get ALL comments
    const allComments = commentList.querySelectorAll('.comment-item');

    // 2. Show the first 4 immediately
    for (let i = 0; i < commentsPerLoad && i < allComments.length; i++) {
        allComments[i].classList.add('is-visible');
        allComments[i].style.display = 'flex'; // Force them to show (overrides the CSS)
    }

    // 3. Check if the "See More" button is needed
    updateSeeMoreButton();

    // 4. Add the click event
    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', showNextComments);
    }

    // --- Fix for New Comments ---
    // Make sure new comments are also counted
    postCommentButton.addEventListener('click', () => {
        // After posting a comment (from your existing code)
        // We need to re-check the button
        updateSeeMoreButton();
    });

}); 