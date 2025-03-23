import { showLoader } from "../../utils/loader.js";
import { showModal } from "../../utils/modal.js";
import { endpoints } from "../../secrets.js";

// Helper function to decode JWT and check expiration
function isTokenExpired(token) {
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return tokenPayload.exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password i");

    if (!passwordInput || !toggleIcon) {
        console.error("Password input or toggle icon not found");
        return;
    }

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

// Function to fetch user details by email
async function fetchUserDetails(email) {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired(accessToken)) {
        // Token is valid, redirect to dashboard
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (userDetails) {
            redirectToDashboard(userDetails.role);
            return;
        }
    }

    // Token is invalid or expired, continue with API call
    try {
        const response = await fetch(`${endpoints.fetchUserByEmail}/${encodeURIComponent(email)}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const userDetails = await response.json();
            sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
            redirectToDashboard(userDetails.role);
        } else {
            const errorResponse = await response.json();
            showModal({
                title: "Login response",
                message: errorResponse.message || 'Could not fetch your detials from server',
                noConfirm: true
            })
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        showModal({
            title: "Login response",
            message: 'Could not fetch your detials from server',
            noConfirm: true
        })
    }
}

function redirectToDashboard(role) {
    if (role === "student") {
        window.location.href = "../../StudentDashboard/studentDashBoard.html";
    } else {
        window.location.href = "../../StudentDashboard/AdminDashBoard.html";
    }
}

// Login function
async function handleLogin(event) {
    const loader = showLoader("Logging you in...");
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = 'student'

    const data = { email, password, role };

    try {
        const response = await fetch(endpoints.loginEnpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("accessToken", result.access_token);
            localStorage.setItem("userEmail", email);

            const userDetails = await fetchUserDetails(email);
            redirectToDashboard(userDetails.role);
        } else {
            const errorResult = await response.json();
            alert(`Login failed: ${errorResult.message}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        showModal({
            title: "Login response",
            message: 'Login error, please try again later',
            noConfirm: true
        })
    } finally {
        loader.remove();
    }
}

// Attach the login function to the form
document.querySelector("#loginForm").addEventListener("submit", handleLogin);

// Fetch user details on page load (if token exists)
document.addEventListener("DOMContentLoaded", () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired(accessToken)) {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (userDetails) {
            redirectToDashboard(userDetails.role);
        }
    }
});
