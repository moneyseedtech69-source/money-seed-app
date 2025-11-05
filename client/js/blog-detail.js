document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GET ELEMENTS ---
    const likeButton = document.getElementById('like-btn');
    const likeCountSpan = document.getElementById('like-count');
    const feedbackButton = document.getElementById('feedback-btn');
    const feedbackPopup = document.getElementById('feedback-popup');
    const closeFeedbackButton = document.getElementById('close-feedback-btn');
    const feedbackForm = document.getElementById('feedback-form');
    const newCommentTextarea = document.querySelector('.new-comment textarea');
    const postCommentButton = document.querySelector('.new-comment button');
    const commentList = document.querySelector('.comment-list');
    const sidebarLinks = document.querySelectorAll('.heading-link');
    const blogHeadings = document.querySelectorAll('.blog-body h3'); // Assuming h3 are section starts

    // Basic checks
    if (!likeButton || !likeCountSpan || !feedbackButton || !feedbackPopup || !closeFeedbackButton || !feedbackForm || !newCommentTextarea || !postCommentButton || !commentList) {
        console.error("Blog detail script could not find all required elements!");
        return;
    }

    // --- 2. LIKE BUTTON FUNCTIONALITY ---
    let likeCount = 15; // Starting count from your HTML example
    let liked = false; // Track if user has liked

    likeCountSpan.textContent = `${likeCount} Likes`; // Initial display

    likeButton.addEventListener('click', () => {
        if (!liked) {
            likeCount++;
            likeButton.classList.add('active'); // Add active style (optional)
            liked = true;
        } else {
            likeCount--;
            likeButton.classList.remove('active'); // Remove active style
            liked = false;
        }
        likeCountSpan.textContent = `${likeCount} Likes`; // Update display
    });

    // --- 3. FEEDBACK POPUP FUNCTIONALITY ---
    feedbackButton.addEventListener('click', () => {
        feedbackPopup.style.display = 'block'; // Show popup
    });

    closeFeedbackButton.addEventListener('click', () => {
        feedbackPopup.style.display = 'none'; // Hide popup
    });

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop form submission
        const selectedFeedback = feedbackForm.querySelector('input[name="feedback"]:checked');
        if (selectedFeedback) {
            console.log("Feedback submitted:", selectedFeedback.value); // Log selected value
            // In a real app, you'd send this to the server
        } else {
            console.log("No feedback selected.");
        }
        feedbackPopup.style.display = 'none'; // Hide popup after submission
        feedbackForm.reset(); // Clear selection
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
        postReplyBtn.textContent = 'Post Reply';
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

}); 