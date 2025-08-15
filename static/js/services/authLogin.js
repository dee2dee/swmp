// authLogin.js

// Fungsi untuk memberikan fokus pada input username
export function focusOnUsername() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    if (usernameInput) {
        usernameInput.focus();
        // Menghapus border Bootstrap dan mengganti border color saat fokus
        usernameInput.classList.add("custom-focus");
    }

    if (passwordInput) {
        passwordInput.classList.add("custom-focus");
    }

    usernameInput.addEventListener("keydown", function(event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener("keydown", function(event) {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            usernameInput.focus();
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            handlerLogin(event);
        }
    })

    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handlerLogin(event);
        }
    })
}

export async function handlerLogin(event) {
    event.preventDefault();

    // Ambil form login
    const loginForm = document.getElementById("loginForm");

    // Reset validasi dan feedback
    const invalidInputs = loginForm.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => {
        input.classList.remove('is-invalid');
        const feedback = input.nextElementSibling; // Mengambil elemen feedback (invalid-feedback)
        if (feedback) feedback.style.display = 'block';
    });

    // Validasi input
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    let isValid = true;

    // Validasi username
    if (username.value.trim() === '') {
        isValid = false;
        username.classList.add('is-invalid');
        const usernameError = username.nextElementSibling;
        if (usernameError) usernameError.style.display = 'block';  // Tampilkan pesan error
    }

    // Validasi password
    if (password.value.trim() === '') {
        isValid = false;
        password.classList.add('is-invalid');
        const passwordError = password.nextElementSibling;
        if (passwordError) passwordError.style.display = 'block';  // Tampilkan pesan error
    }

    if (!isValid) {
        return; // Jika form tidak valid, hentikan submit
    }
 
    // Mengambil nilai username dan password
    const usernameValue = username.value;
    const passwordValue = password.value;

        try {
            // Lakukan request API login dengan async/await
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: usernameValue, password: passwordValue }),
            });

            const data = await response.json();

            if (data.error) {
                showError(data.error);
            } else {
                showSuccess(data.message);

                setTimeout(() => {
                    window.location.href = data.redirect;  // Redirect ke halaman sesuai role
                }, 1000);
            }
        } catch (error) {
            console.error('Error:', error);
            showError("An error occurred. Please try again.");
        }
    // }
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    const loadingAlert = document.getElementById("loadingAlert");
    loadingAlert.classList.remove("d-none");
    loadingAlert.classList.remove("alert-info", "alert-success")
    loadingAlert.classList.add("alert-danger");
    loadingAlert.innerText = message;

    setTimeout(() => {
       loadingAlert.classList.add("d-none"); 
    }, 2000);
}

// Fungsi untuk menampilkan pesan sukses
function showSuccess(message) {
    const loadingAlert = document.getElementById("loadingAlert");
    loadingAlert.classList.remove("d-none");
    loadingAlert.classList.remove("alert-info", "alert-danger");
    loadingAlert.classList.add("alert-success");
    loadingAlert.innerText = message;

    setTimeout(() => {
        loadingAlert.classList.add("d-none");
    }, 2000);
}