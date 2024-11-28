document.addEventListener("DOMContentLoaded", () => {
    const userLoginForm = document.getElementById("user-login-form");
    const adminLoginForm = document.getElementById("admin-login-form");
    const userRegisterForm = document.getElementById("user-register-form");
    const adminRegisterForm = document.getElementById("admin-register-form");

    const handleSubmit = async (url, formData) => {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        alert(result.message);
        if (response.ok && result.redirect) {
            window.location.href = result.redirect;
        }
    };

    if (userLoginForm) {
        userLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            handleSubmit("/api/user/login", { email, password });
        });
    }

    // Add similar event listeners for other forms
});
