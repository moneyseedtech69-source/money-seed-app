// ==========================================
// 1. SETUP CODE (Runs when page loads)
// ==========================================
let itemToDelete = null;

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

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        closeAllMenus();
    });

    // ==========================================
    // 2. TINYMCE EDITOR SETUP (SELF-HOSTED)
    // ==========================================

    if (document.getElementById('my-pro-editor')) {

        // No API Key or Cloud Script needed!
        // We assume you loaded <script src="js/tinymce/tinymce.min.js"></script> in HTML

        tinymce.init({
            selector: '#my-pro-editor',

            license_key: 'gpl',

            // IMPORTANT: Tell TinyMCE where the local files are
            base_url: 'js/tinymce',
            suffix: '.min',

            height: '100%',
            menubar: false,
            resize: false,

            // Dark Theme Settings
            skin: 'oxide-dark',
            content_css: 'dark',

            // Features
            plugins: 'image link lists media wordcount autoplay fullscreen code table save',
            toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media table | removeformat code',

            // Allow Pasting Images
            paste_data_images: true,
            images_file_types: 'jpg,svg,png,webp,gif',

            // Professional Image Handling
            image_caption: true,
            image_title: true,
            automatic_uploads: true,

            // Styling the content
            content_style: `
                body { font-family: 'Poppins', sans-serif; font-size: 16px; line-height: 1.6; color: #F9FAFB; }
                img { max-width: 100%; height: auto; border-radius: 8px; }`,

            // Reading Time Calculation
            setup: function (editor) {
                editor.on('keyup change', function () {
                    const text = editor.getContent({ format: 'text' });
                    const wordCount = text.split(/\s+/).length;
                    const readingTime = Math.ceil(wordCount / 200);

                    const timeDisplay = document.getElementById('reading-time');
                    if (timeDisplay) {
                        timeDisplay.innerText = `${readingTime} min read`;
                    }
                });
            }
        });
    }

}); // <--- END OF DOMContentLoaded logic

// ==========================================
// 4. GLOBAL HELPER FUNCTIONS
// ==========================================

function switchToEditor(type) {
    const hub = document.getElementById('blog-hub');
    const blogEditor = document.getElementById('blog-editor');
    const courseEditor = document.getElementById('course-editor');

    if (hub) {
        hub.style.display = 'none';

        if (type === 'course') {
            if (blogEditor) blogEditor.style.display = 'none';
            if (courseEditor) {
                courseEditor.style.display = 'flex'; // Use Flex to match layout
                initCourseEditor(); // <--- START THE LOGIC HERE
            }
        } else {
            if (courseEditor) courseEditor.style.display = 'none';
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

// ==========================================
// 5. PUBLISH LOGIC (Gather Data)
// ==========================================

const publishBtn = document.querySelector('.btn-publish');
const saveDraftBtn = document.querySelector('.btn-save-draft');

if (publishBtn) {
    publishBtn.addEventListener('click', () => {
        collectAndLogData('Published');
    });
}

if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
        collectAndLogData('Draft');
    });
}

function collectAndLogData(status) {
    // 1. Get Title
    const title = document.querySelector('.post-title-input').value;

    // 2. Get Content (From TinyMCE)
    let content = "";
    if (tinymce.get('my-pro-editor')) {
        content = tinymce.get('my-pro-editor').getContent();
    }

    // 3. Get Sidebar Settings
    const category = document.getElementById('post-category').value;
    const author = document.getElementById('post-author').value;
    const tags = document.getElementById('post-tags').value;

    // 4. Bundle it into an Object
    const postData = {
        title: title || "Untitled Post",
        author: author || "Admin",
        status: status,
        category: category,
        tags: tags.split(',').map(tag => tag.trim()),
        content: content,
        date: new Date().toISOString()
    };

    // 5. SIMULATE SENDING TO DATABASE
    console.log("🚀 READY TO SEND TO DB:", postData);

    // Visual Feedback
    alert(`Success! Post packaged as '${status}'. Check Console (F12) to see the data.`);
}

// ==========================================
// 6. REAL PREVIEW LOGIC (New Window)
// ==========================================
const previewBtn = document.getElementById('real-preview-btn');

if (previewBtn) {
    previewBtn.addEventListener('click', () => {
        // 1. Get Content
        let content = "";
        if (tinymce.get('my-pro-editor')) {
            content = tinymce.get('my-pro-editor').getContent();
        }
        const title = document.querySelector('.post-title-input').value || "Untitled Post";
        const author = document.getElementById('post-author').value || "Admin";

        // 2. Open New Window
        const win = window.open('', '_blank');

        // 3. Write the HTML (Simulating your Main Site)
        win.document.write(`
            <html>
            <head>
                <title>Preview: ${title}</title>
                <link rel="stylesheet" href="css/style.css"> 
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                <style>
                    body { background-color: #111827; color: white; padding: 40px; font-family: 'Poppins', sans-serif; }
                    .blog-container { max-width: 800px; margin: 0 auto; }
                    h1 { font-size: 3rem; margin-bottom: 10px; }
                    .meta { color: #9CA3AF; margin-bottom: 30px; border-bottom: 1px solid #374151; padding-bottom: 20px; }
                    img { max-width: 100%; height: auto; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="blog-container">
                    <h1>${title}</h1>
                    <div class="meta">By ${author} • Preview Mode</div>
                    <div class="content">
                        ${content}
                    </div>
                </div>
            </body>
            </html>
        `);
    });
}

// ==========================================
// 7. COURSE BUILDER LOGIC
// ==========================================

// This Object holds ALL the course data in memory
let courseData = {
    overview: {
        title: "Welcome & Overview",
        content: "<h2>Welcome Message!</h2><p>Congratulations and Welcome!</p><h2>Course Overview</h2><p>Describe the course here...</p>"
    },
    modules: [] // We will add {id, title, content} here
};

let currentSectionId = 'overview'; // Tracks what we are currently editing

// 1. Initialize Course Editor (Call this when opening the Course Editor)
function initCourseEditor() {
    // Determine which editor to init. 
    // We need a SECOND TinyMCE instance for the course to avoid ID conflicts
    // OR we destroy the old one. For simplicity, let's init a specific ID.

    if (!tinymce.get('course-content-area')) {
        tinymce.init({
            selector: '#course-content-area',
            license_key: 'gpl',
            base_url: 'js/tinymce',
            suffix: '.min',
            height: '100%',
            menubar: false,
            resize: false,
            skin: 'oxide-dark',
            content_css: 'dark',
            plugins: 'image link lists media wordcount code table',
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | link image',

            // Important: update our data variable whenever user types
            setup: function (editor) {
                editor.on('change keyup', function () {
                    saveCurrentSectionToMemory();
                });
            }
        });
    }

    // Render the Sidebar
    renderModuleSidebar();
    // Load the default Overview
    loadCourseSection('overview');
}

// 2. Render the Left Sidebar List
function renderModuleSidebar() {
    const container = document.getElementById('module-list-container');
    container.innerHTML = ''; // Clear current list

    courseData.modules.forEach((mod, index) => {
        const div = document.createElement('div');
        div.className = `module-item ${currentSectionId === index ? 'active' : ''}`;
        div.onclick = () => loadCourseSection(index);
        div.innerHTML = `
            <span class="material-symbols-outlined">folder</span>
            <span>${mod.title}</span>
            <span class="material-symbols-outlined" style="margin-left:auto; font-size:16px; opacity:0.5;" onclick="deleteModule(${index}, event)">delete</span>
        `;
        container.appendChild(div);
    });
}

// 3. Add New Module
function addModule() {
    const count = courseData.modules.length + 1;
    const newModule = {
        title: `Module ${count}`,
        content: `<h2>Module ${count}</h2><p>Start adding content for this module...</p>`
    };
    courseData.modules.push(newModule);
    renderModuleSidebar();

    // Switch to the new module immediately
    loadCourseSection(courseData.modules.length - 1);
}

// 4. Switch Tabs (The Logic)
function loadCourseSection(sectionId) {
    // First, Save the OLD section before switching
    saveCurrentSectionToMemory();

    // Update Tracker
    currentSectionId = sectionId;

    // UI Updates
    document.querySelectorAll('.structure-sidebar .module-item').forEach(el => el.classList.remove('active'));

    // Load Data
    let dataToLoad = {};

    if (sectionId === 'overview') {
        document.getElementById('tab-overview').classList.add('active');
        dataToLoad = courseData.overview;
        // Make Title Read-Only for Overview if you want, or editable
        document.getElementById('course-section-title').value = "Course Overview";
        document.getElementById('course-section-title').disabled = true;
    } else {
        // It's a module index
        dataToLoad = courseData.modules[sectionId];
        // Highlight the module in sidebar
        const items = document.getElementById('module-list-container').children;
        if (items[sectionId]) items[sectionId].classList.add('active');

        document.getElementById('course-section-title').value = dataToLoad.title;
        document.getElementById('course-section-title').disabled = false;
    }

    // Set TinyMCE Content
    if (tinymce.get('course-content-area')) {
        tinymce.get('course-content-area').setContent(dataToLoad.content);
    }
}

// 5. Helper: Save Current Editor Content to the JSON Object
function saveCurrentSectionToMemory() {
    if (!tinymce.get('course-content-area')) return;

    const currentContent = tinymce.get('course-content-area').getContent();
    const currentTitle = document.getElementById('course-section-title').value;

    if (currentSectionId === 'overview') {
        courseData.overview.content = currentContent;
        // Overview title is static
    } else {
        // It is a module
        if (courseData.modules[currentSectionId]) {
            courseData.modules[currentSectionId].content = currentContent;
            courseData.modules[currentSectionId].title = currentTitle;
        }
    }
}

// 6. Save Entire Course (The Final Button)
function saveCourse() {
    saveCurrentSectionToMemory(); // Ensure last changes are caught

    const finalCoursePackage = {
        settings: {
            level: document.getElementById('course-level').value,
            price: document.getElementById('course-price').value
        },
        structure: courseData
    };

    console.log("📦 FULL COURSE DATA:", finalCoursePackage);
    alert("Course saved! Check console for the full object.");
}

// 7. Delete Module Function
function deleteModule(index, event) {
    event.stopPropagation(); // Stop the click from opening the module

    if (confirm('Are you sure you want to delete this module?')) {
        // Remove from array
        courseData.modules.splice(index, 1);

        // If we deleted the active section, switch back to overview
        if (currentSectionId === index) {
            loadCourseSection('overview');
        } else if (currentSectionId > index) {
            // Adjust index if we deleted something above the current one
            currentSectionId--;
        }

        // Re-render list
        renderModuleSidebar();
        alert('Module deleted.');
    }
}