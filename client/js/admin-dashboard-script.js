// ==========================================
// 1. SETUP CODE (Runs when page loads)
// ==========================================
let itemToDelete = null;
let savedSelection = null; // To store text selection for links
let selectedImage = null;
let currentResizer = null;  // Tracks which image we are editing

document.addEventListener('DOMContentLoaded', () => {

    // --- Auth Guard ---
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'internal-login.html';
        return;
    }

    // --- Logout Button Logic ---
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userDepartment');
            localStorage.removeItem('userTitle');
            window.location.href = 'internal-login.html';
        });
    }

    // --- Progress Chart Logic ---
    const allProgressCircles = document.querySelectorAll(".progress-circle");
    const progressColor = "#6200EA";
    const trackColor = "#374151";

    allProgressCircles.forEach(progressBar => {
        const progressValueEl = progressBar.querySelector(".progress-value");
        const endValue = parseInt(progressBar.dataset.value) || 0;
        let progressStartValue = 0;
        let progress = setInterval(() => {
            if (progressValueEl) {
                progressValueEl.textContent = `${progressStartValue}%`;
                progressValueEl.style.color = progressColor;
            }
            progressBar.style.background = `conic-gradient(
                ${progressColor} ${progressStartValue * 3.6}deg,
                ${trackColor} ${progressStartValue * 3.6}deg
            )`;
            if (progressStartValue === endValue) clearInterval(progress);
            progressStartValue++;
        }, 20);
    });

    // --- Speech Bubble Logic ---
    const bubble = document.querySelector('.speech-bubble');
    if (bubble) {
        const quotes = [
            "You’re capable of amazing things.", "Small steps lead to success.",
            "Stay focused, keep moving forward.", "Believe in yourself every day.",
            "Your journey starts right here."
        ];
        let quoteIndex = 0;
        const startQuoteRotation = () => {
            setInterval(() => {
                bubble.style.opacity = 0;
                setTimeout(() => {
                    bubble.textContent = quotes[quoteIndex];
                    quoteIndex = (quoteIndex + 1) % quotes.length;
                    bubble.style.opacity = 1;
                }, 500);
            }, 4000);
        };

        if (sessionStorage.getItem('showWelcome') === 'true') {
            bubble.textContent = "Welcome back, keep shining today!";
            sessionStorage.setItem('showWelcome', 'false');
            setTimeout(startQuoteRotation, 4000);
        } else {
            bubble.textContent = quotes[0];
            quoteIndex = 1;
            startQuoteRotation();
        }
    }

    // --- Digital Clock Logic ---
    const digitalClockTimeEl = document.querySelector('#clock .time');
    const digitalClockDateEl = document.querySelector('#clock .date');
    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    function zeroPadding(num, digit) {
        let zero = '';
        for (let i = 0; i < digit; i++) zero += '0';
        return (zero + num).slice(-digit);
    }

    function updateDigitalClock() {
        const cd = new Date();
        const timeStr = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
        const dateStr = zeroPadding(cd.getDate(), 2) + '/' + zeroPadding(cd.getMonth() + 1, 2) + '/' + zeroPadding(cd.getFullYear(), 4).slice(-2) + ' ' + week[cd.getDay()];

        if (digitalClockTimeEl) digitalClockTimeEl.textContent = timeStr;
        if (digitalClockDateEl) digitalClockDateEl.textContent = dateStr;
    }

    if (digitalClockTimeEl && digitalClockDateEl) {
        updateDigitalClock();
        setInterval(updateDigitalClock, 1000);
    }

    // --- "More Updates" Arrow Logic ---
    const updatesList = document.querySelector('.updates-list');
    const moreArrow = document.getElementById('more-updates-arrow');
    if (updatesList && moreArrow) {
        if (updatesList.scrollHeight > updatesList.clientHeight) {
            moreArrow.style.display = 'block';
        }
    }

    // --- UNDO / REDO BUTTONS (Manual Editor) ---
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');

    if (undoBtn && redoBtn) {
        undoBtn.addEventListener('click', () => {
            document.execCommand('undo', false, null);
        });

        redoBtn.addEventListener('click', () => {
            document.execCommand('redo', false, null);
        });
    }

    // --- DELETE CONFIRM LOGIC ---
    const confirmBtn = document.getElementById('confirm-delete-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (itemToDelete) {
                itemToDelete.style.transition = "all 0.3s ease";
                itemToDelete.style.opacity = "0";
                itemToDelete.style.transform = "translateX(20px)";
                setTimeout(() => {
                    itemToDelete.remove();
                }, 300);
            }
            closeDeleteModal();
        });
    }

    // --- LINK CONFIRM LOGIC ---
    const confirmLinkBtn = document.getElementById('confirm-link-btn');
    if (confirmLinkBtn) {
        confirmLinkBtn.addEventListener('click', function () {
            const urlInput = document.getElementById('link-url-input');
            const url = urlInput ? urlInput.value : '';

            if (url && savedSelection) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(savedSelection);
                formatDoc('createLink', url);
            }
            closeLinkModal();
        });
    }

    // Close menus AND Image Tools when clicking outside
    document.addEventListener('click', (e) => {
        closeAllMenus();

        // Check if we clicked: 
        // 1. An Image
        // 2. The Toolbar
        // 3. The Resize Handles/Overlay
        const isImage = e.target.tagName === 'IMG';
        const isToolbar = e.target.closest('#image-toolbar');
        const isResizer = e.target.closest('.image-resizer-overlay') || e.target.classList.contains('resize-handle');

        if (!isImage && !isToolbar && !isResizer) {
            const toolbar = document.getElementById('image-toolbar');
            if (toolbar) toolbar.style.display = 'none';

            // Remove the resize handles
            if (typeof removeResizeHandles === "function") {
                removeResizeHandles();
            }
            selectedImage = null;
        }
    });

    // --- ACTIVATE FORMATTING TOOLBAR ---
    setupToolbar();

}); // <--- END OF DOMContentLoaded

// ==========================================
// 2. GLOBAL FUNCTIONS (Called by HTML onclick="")
// ==========================================

// --- Blog Hub Navigation ---
function switchToEditor(type) {
    const hub = document.getElementById('blog-hub');
    const blogEditor = document.getElementById('blog-editor');
    const courseEditor = document.getElementById('course-editor');

    if (hub) {
        hub.style.display = 'none';
        if (type === 'course') {
            if (courseEditor) courseEditor.style.display = 'flex';
        } else {
            if (blogEditor) blogEditor.style.display = 'flex';
        }
    }
}

function backToHub() {
    const hub = document.getElementById('blog-hub');
    const blogEditor = document.getElementById('blog-editor');
    const courseEditor = document.getElementById('course-editor');

    if (hub) {
        hub.style.display = 'flex';
        if (blogEditor) blogEditor.style.display = 'none';
        if (courseEditor) courseEditor.style.display = 'none';
    }
}

// --- Menu & Modal Logic ---
function toggleMenu(btn, event) {
    event.stopPropagation();
    closeAllMenus();
    const menu = btn.nextElementSibling;
    if (menu) menu.classList.toggle('show');
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
}

function openDeleteModal(menuItem) {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'flex';
        itemToDelete = menuItem.closest('.file-item');
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.style.display = 'none';
    itemToDelete = null;
}

// --- Link Modal Logic ---
function openLinkModal() {
    const selection = window.getSelection();
    const editor = document.getElementById('editor-text-area');

    if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
        savedSelection = selection.getRangeAt(0);
        const modal = document.getElementById('link-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                const input = document.getElementById('link-url-input');
                if (input) input.focus();
            }, 100);
        }
    } else {
        alert("Please select the text inside the editor that you want to link.");
    }
}

function closeLinkModal() {
    const modal = document.getElementById('link-modal');
    if (modal) modal.style.display = 'none';
    const input = document.getElementById('link-url-input');
    if (input) input.value = '';
    savedSelection = null;
}

// --- Pin Toggle Logic ---
function togglePin(menuItem) {
    const fileRow = menuItem.closest('.file-item');
    fileRow.classList.toggle('pinned');
    const textSpan = menuItem.querySelector('.pin-text');
    const iconSpan = menuItem.querySelector('.material-symbols-outlined');

    if (fileRow.classList.contains('pinned')) {
        textSpan.textContent = "Unpin";
        iconSpan.textContent = "keep_off";
    } else {
        textSpan.textContent = "Pin";
        iconSpan.textContent = "keep";
    }
    closeAllMenus();
}

// --- Tab Filtering Logic ---
function filterFiles(filterType, clickedTab) {
    document.querySelectorAll('.section-label').forEach(tab => {
        tab.classList.remove('active');
    });
    clickedTab.classList.add('active');

    const list = document.querySelector('.recent-files-list');
    if (filterType === 'pinned') {
        if (list) list.classList.add('view-pinned-only');
    } else {
        if (list) list.classList.remove('view-pinned-only');
    }

    const allFiles = document.querySelectorAll('.file-item');
    allFiles.forEach(file => {
        file.style.display = 'none';
        if (filterType === 'recent') {
            file.style.display = 'grid';
        }
        else if (filterType === 'drafts') {
            const isDraft = file.querySelector('.status-draft');
            if (isDraft) file.style.display = 'grid';
        }
        else if (filterType === 'pinned') {
            if (file.classList.contains('pinned')) file.style.display = 'grid';
        }
    });
}

// --- FORMATTING TOOLS (Manual Editor) ---
function formatDoc(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd);
    }
    const editor = document.getElementById('editor-text-area');
    if (editor) editor.focus();
}

function setupToolbar() {
    document.execCommand('enableObjectResizing', false, 'false');
    const editor = document.getElementById('editor-text-area');

    // 1. Map buttons
    const buttons = [
        { selector: 'button[title="Bold"]', cmd: 'bold' },
        { selector: 'button[title="Italic"]', cmd: 'italic' },
        { selector: 'button[title="Underline"]', cmd: 'underline' },
        { selector: 'button[title="Align Left"]', cmd: 'justifyLeft' },
        { selector: 'button[title="Align Center"]', cmd: 'justifyCenter' },
        { selector: 'button[title="Align Right"]', cmd: 'justifyRight' },
        { selector: 'button[title="Bullet List"]', cmd: 'insertUnorderedList' },
        { selector: 'button[title="Numbered List"]', cmd: 'insertOrderedList' },
    ];

    // 2. Add Click Listeners
    buttons.forEach(btn => {
        const element = document.querySelector(btn.selector);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                formatDoc(btn.cmd);
                checkToolbarState(buttons);
            });
        }
    });

    // 3. State Checker
    function checkToolbarState(btns) {
        btns.forEach(btn => {
            const element = document.querySelector(btn.selector);
            if (element) {
                const isActive = document.queryCommandState(btn.cmd);
                if (isActive) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            }
        });
    }

    // 4. Run Checker
    if (editor) {
        editor.addEventListener('mouseup', () => checkToolbarState(buttons));
        editor.addEventListener('keyup', () => checkToolbarState(buttons));
    }

    // 5. Dropdowns
    const formatSelect = document.getElementById('format-block');
    if (formatSelect) {
        formatSelect.addEventListener('change', function () {
            formatDoc('formatBlock', this.value);
        });
    }

    const fontSelect = document.getElementById('font-family');
    if (fontSelect) {
        fontSelect.addEventListener('change', function () {
            formatDoc('fontName', this.value);
            this.style.fontFamily = this.value;
        });
    }

    const sizeSelect = document.getElementById('font-size');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function () {
            formatDoc('fontSize', this.value);
        });
    }

    const textColorSelect = document.getElementById('color-text');
    if (textColorSelect) {
        textColorSelect.addEventListener('change', function () {
            formatDoc('foreColor', this.value);
            this.style.color = this.value;
        });
    }

    const hiliteColorSelect = document.getElementById('color-hilite');
    if (hiliteColorSelect) {
        hiliteColorSelect.addEventListener('change', function () {
            formatDoc('hiliteColor', this.value);
        });
    }

    // 6. Checklist
    const checklistBtn = document.querySelector('button[title="Checklist"]');
    if (checklistBtn) {
        checklistBtn.addEventListener('click', function (e) {
            e.preventDefault();
            formatDoc('insertHTML', '<input type="checkbox" style="margin-right: 8px;"> ');
        });
    }

    // 7. Link
    const linkBtn = document.querySelector('button[title="Link"]');
    if (linkBtn) {
        linkBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openLinkModal();
        });
    }

    // 9. Enable Ctrl+Click for Links
    if (editor) {
        editor.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (link && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                window.open(link.href, '_blank');
            }
        });

        editor.addEventListener('mousemove', function (e) {
            const link = e.target.closest('a');
            if (link && (e.ctrlKey || e.metaKey)) {
                editor.style.cursor = 'pointer';
            } else {
                editor.style.cursor = 'text';
            }
        });
    }

    // 10. Link Tooltip
    const tooltip = document.getElementById('editor-tooltip');
    if (editor && tooltip) {
        editor.addEventListener('mousemove', function (e) {
            const link = e.target.closest('a');
            if (link) {
                tooltip.style.display = 'block';
                tooltip.style.left = (e.clientX + 15) + 'px';
                tooltip.style.top = (e.clientY + 15) + 'px';
            } else {
                tooltip.style.display = 'none';
            }
        });
        editor.addEventListener('mouseleave', function () {
            tooltip.style.display = 'none';
        });
    }

    // 11. Image Upload (Local File)
    const imgBtn = document.querySelector('button[title="Image"]');
    const hiddenInput = document.getElementById('hidden-image-input');

    if (imgBtn && hiddenInput) {
        imgBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hiddenInput.click();
        });

        hiddenInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imgUrl = e.target.result;
                    const html = `<br><img src="${imgUrl}" class="editor-image"><p><br></p>`;
                    formatDoc('insertHTML', html);
                    hiddenInput.value = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 12. Image Click Listener (Show Settings)
    if (editor) {
        editor.addEventListener('click', function (e) {
            if (e.target.tagName === 'IMG') {
                selectedImage = e.target;
                showImageToolbar(e.target);
            } else {
                document.getElementById('image-toolbar').style.display = 'none';
                selectedImage = null;
            }
        });
    }
}

// ==========================================
// 3. IMAGE EDITING FUNCTIONS (Align & Resize)
// ==========================================

// --- A. SHOW TOOLBAR & HANDLES ---
function showImageToolbar(img) {
    const toolbar = document.getElementById('image-toolbar');

    // 1. Position the Toolbar
    const rect = img.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Show toolbar 50px above the image
    toolbar.style.display = 'flex';
    toolbar.style.top = `${rect.top + scrollTop - 50}px`;
    toolbar.style.left = `${rect.left + scrollLeft + (rect.width / 2)}px`;

    // 2. Create the Resize Handles (White corners)
    createResizeHandles(img);
}

// --- B. ALIGNMENT LOGIC ---
function alignImage(direction) {
    if (!selectedImage) return;

    // Remove old classes
    selectedImage.classList.remove('img-left', 'img-right', 'img-center');

    // Add new class
    selectedImage.classList.add(`img-${direction}`);

    // Update position of toolbar/handles since image moved
    showImageToolbar(selectedImage);
}

// --- MISSING FUNCTION ADDED HERE ---
function removeResizeHandles() {
    if (currentResizer) {
        currentResizer.remove();
        currentResizer = null;
    }
    const oldOverlay = document.querySelector('.image-resizer-overlay');
    if (oldOverlay) oldOverlay.remove();
}

// --- C. RESIZE HANDLE CREATION (FIXED) ---
function createResizeHandles(img) {
    removeResizeHandles(); // Clear old ones first

    // Create overlay wrapper
    const resizerOverlay = document.createElement('div');
    resizerOverlay.className = 'image-resizer-overlay';
    resizerOverlay.style.position = 'absolute';
    resizerOverlay.style.border = '1px solid #10B981'; // Green border visual

    // CRITICAL: This allows clicks to pass through to the image (fixing selection)
    resizerOverlay.style.pointerEvents = 'none';

    // Match image position exactly
    const rect = img.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;

    resizerOverlay.style.top = `${rect.top + scrollTop}px`;
    resizerOverlay.style.left = `${rect.left + scrollLeft}px`;
    resizerOverlay.style.width = `${rect.width}px`;
    resizerOverlay.style.height = `${rect.height}px`;
    resizerOverlay.style.zIndex = '1000';

    document.body.appendChild(resizerOverlay);
    currentResizer = resizerOverlay;

    // Add 4 Corner Handles
    const corners = ['nw', 'ne', 'sw', 'se'];
    corners.forEach(c => {
        const handle = document.createElement('div');
        handle.className = `resize-handle handle-${c}`;

        // CRITICAL: Re-enable clicks JUST for the handles
        handle.style.pointerEvents = 'auto';

        handle.addEventListener('mousedown', (e) => initDragResize(e, img, c));
        resizerOverlay.appendChild(handle);
    });
}

// --- D. DRAG TO RESIZE CALCULATION ---
function initDragResize(e, img, corner) {
    e.preventDefault(); // Prevent text selection while dragging
    e.stopPropagation(); // Stop other events

    const startX = e.clientX;
    const startWidth = parseInt(window.getComputedStyle(img).width, 10);

    function doDrag(e) {
        let newWidth;
        // Calculate width based on which corner is pulled
        if (corner === 'se' || corner === 'ne') {
            // Pulling Right: Width increases
            newWidth = startWidth + (e.clientX - startX);
        } else {
            // Pulling Left: Width increases as mouse moves left (negative delta)
            newWidth = startWidth - (e.clientX - startX);
        }

        if (newWidth > 50) { // Minimum width safety
            img.style.width = `${newWidth}px`;
            // Force toolbar to follow the resizing image
            showImageToolbar(img);
        }
    }

    function stopDrag() {
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
    }

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
}

// --- E. DELETE IMAGE ---
function deleteImage() {
    if (selectedImage) {
        selectedImage.remove();
        document.getElementById('image-toolbar').style.display = 'none';
        removeResizeHandles();
        selectedImage = null;
    }
}

// --- F. PRESERVE OLD RESIZE BUTTONS (Optional support) ---
function resizeImage(width) {
    if (selectedImage) {
        selectedImage.style.width = width;
        showImageToolbar(selectedImage); // Update handle position
    }
}