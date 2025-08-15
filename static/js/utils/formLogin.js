// formlogin.js
export function renderLoginForm() {
    return `
        <div class="container d-flex justify-content-center align-items-center vh-100">
            <div class="login-form">
                <div class="text-center mb-4">
                    <img src="/static/images/logo.png" alt="Logo" class="login-logo mb-2">
                    <h5 class="text-primary poppins-bold">SWM Pool</h5>
                </div>
                <form id="loginForm" novalidate>
                    <div class="mb-4">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input type="text" class="form-control border-input" id="username" placeholder="Username" required>
                            <div class="invalid-feedback" style="display:none;">Username is required.</div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock"></i></span>
                            <input type="password" class="form-control border-input" id="password" placeholder="Password" required>
                            <div class="invalid-feedback" style="display:none;">Password is required.</div>
                        </div>
                    </div>
                    <button type="submit" class="btn w-100 mt-3" id="btnSignIn">Sign in</button>
                    <div id="loadingAlert" class="alert d-none" role="alert"></div>
                </form>
            </div>
        </div>
    `;
}