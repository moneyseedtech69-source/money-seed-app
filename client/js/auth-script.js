document.addEventListener('DOMContentLoaded', () => {

    /* --- ============================ --- */
    /* --- PART 1: ANIMATION LOGIC      --- */
    /* --- ============================ --- */

    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    } else {
        console.error("Animation buttons not found!");
    }

    /* --- ============================ --- */
    /* --- PART 2: DUMMY ACCOUNT      --- */
    /* --- ============================ --- */

    const DUMMY_USER = "admin";
    const DUMMY_PASS = "pass1234";

    /* --- ============================ --- */
    /* --- PART 3: SIGNUP LOGIC       --- */
    /* --- ============================ --- */

    const registerForm = document.getElementById('register-form');
    const registerUsername = document.getElementById('register-username');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const registerError = document.getElementById('register-error');
    const registerButton = registerForm.querySelector('.btn');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // --- Reset state ---
            registerError.style.display = 'none';
            registerUsername.parentElement.classList.remove('is-invalid');
            registerPassword.parentElement.classList.remove('is-invalid');
            registerButton.classList.add('is-loading'); // Show loader
            registerButton.disabled = true; // Disable button

            // --- FAKE DELAY (simulates server check) ---
            setTimeout(() => {
                // Get values
                const username = registerUsername.value;
                const email = registerEmail.value;
                const password = registerPassword.value;

                // Simple validation
                if (username.length < 3) {
                    registerError.textContent = "Username must be at least 3 characters.";
                    registerError.style.display = 'block';
                    registerUsername.parentElement.classList.add('is-invalid'); // Shake
                    registerButton.classList.remove('is-loading'); // Hide loader
                    registerButton.disabled = false;
                    return;
                }
                if (password.length < 8) {
                    registerError.textContent = "Password must be at least 8 characters.";
                    registerError.style.display = 'block';
                    registerPassword.parentElement.classList.add('is-invalid'); // Shake
                    registerButton.classList.remove('is-loading'); // Hide loader
                    registerButton.disabled = false;
                    return;
                }

                // --- Success ---
                registerError.style.display = 'none';

                // 1. Save to localStorage
                localStorage.setItem('newUser_username', username);
                localStorage.setItem('newUser_password', password);
                localStorage.setItem('newUser_email', email);
                console.log("New account saved to localStorage:", username);

                // 2. Show success message on button
                registerButton.classList.remove('is-loading');
                registerButton.querySelector('.btn-text').textContent = 'Success!';

                // 3. Wait 2 seconds, then switch
                setTimeout(() => {
                    // 4. Switch to login panel
                    container.classList.remove('active');

                    // 5. Reset the register form
                    registerButton.querySelector('.btn-text').textContent = 'Register';
                    registerButton.disabled = false;
                    registerForm.reset();

                    // 6. Pre-fill the login form
                    document.getElementById('login-username').value = username;

                }, 2000); // 2000ms = 2 seconds

            }, 1000); // 1-second fake processing time
        });
    }

    /* --- ============================ --- */
    /* --- PART 4: LOGIN LOGIC        --- */
    /* --- ============================ --- */

    const loginForm = document.getElementById('login-form');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const loginSubmitButton = loginForm.querySelector('.btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // --- Reset state ---
            loginError.style.display = 'none';
            loginUsername.parentElement.classList.remove('is-invalid');
            loginPassword.parentElement.classList.remove('is-invalid');
            loginSubmitButton.classList.add('is-loading'); // Show loader
            loginSubmitButton.disabled = true; // Disable button

            // --- FAKE DELAY (simulates server check) ---
            setTimeout(() => {
                // Get values
                const username = loginUsername.value;
                const password = loginPassword.value;

                // Get the new user from localStorage
                const storedUser = localStorage.getItem('newUser_username');
                const storedPass = localStorage.getItem('newUser_password');

                let loginSuccess = false;

                if (username === storedUser && password === storedPass) {
                    loginSuccess = true;
                    console.log("Logged in as new user:", username);
                }

                if (username === DUMMY_USER && password === DUMMY_PASS) {
                    loginSuccess = true;
                    console.log("Logged in as dummy admin");
                }

                // --- Handle Success or Failure ---
                if (loginSuccess) {
                    loginError.style.display = 'none';
                    loginSubmitButton.classList.remove('is-loading');
                    loginSubmitButton.querySelector('.btn-text').textContent = 'Success!';

                    // Redirect to home.html
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1000);
                } else {
                    // Failed
                    loginError.textContent = 'Invalid username or password.';
                    loginError.style.display = 'block';
                    loginUsername.parentElement.classList.add('is-invalid'); // Shake
                    loginPassword.parentElement.classList.add('is-invalid'); // Shake
                    loginSubmitButton.classList.remove('is-loading'); // Hide loader
                    loginSubmitButton.disabled = false; // Re-enable
                }
            }, 1000); // 1-second fake processing time
        });
    }

});