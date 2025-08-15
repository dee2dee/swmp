// login.js
import { renderLoginForm } from './utils/formLogin.js';
import { focusOnUsername, handlerLogin } from './services/authLogin.js';

export function initLogin() {
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) {
        loginContainer.innerHTML = renderLoginForm();

        // Menambahkan event listener pada form submit setelah form selesai dirender
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", handlerLogin);
        }

        // Panggil fungsi untuk fokus ke username
        focusOnUsername();

        // Pastikan elemen-elemen input ada di dalam DOM setelah form dirender
        const username = document.getElementById("username");
        const password = document.getElementById("password");

        // Jika elemen username dan password ada, pasang event listener untuk input
        if (username) {
            username.addEventListener("input", function () {
                const usernameError = username.nextElementSibling;
                if (username.checkValidity()) {
                    username.classList.remove('is-invalid');
                    if (usernameError) usernameError.style.display = 'none';
                }
            });
        }

        if (password) {
            password.addEventListener("input", function () {
                const passwordError = password.nextElementSibling;
                if (password.checkValidity()) {
                    password.classList.remove('is-invalid');
                    if (passwordError) passwordError.style.display = 'none';
                }
            });
        }

    } else {
        console.error("Element dengan ID 'loginContainer' tidak ditemukan.");
    }
}

