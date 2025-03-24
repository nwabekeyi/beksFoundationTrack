import { showLoader } from "../../utils/loader.js";
import { showModal } from "../../utils/modal.js";
import { endpoints } from "../../secrets.js";

// Helper function to decode JWT and check expiration
function isTokenExpired(token) {
    try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return tokenPayload.exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Assume expired if decoding fails
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

function redirectToDashboard(role) {
    if (role === "student") {
        window.location.href = "../../StudentDashboard/studentDashBoard.html";
    } else {
        window.location.href = "../../StudentDashboard/AdminDashBoard.html";
    }
}

// Function to fetch user details by email (only called if needed)
async function fetchUserDetails(email) {
    const accessToken = localStorage.getItem("accessToken");

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
                title: "Error",
                message: errorResponse.message || "Could not fetch your details from server",
                noConfirm: true,
            });
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        showModal({
            title: "Error",
            message: "Could not fetch your details from server",
            noConfirm: true,
        });
    }
}

// Login function
async function handleLogin(event) {
    event.preventDefault();
    const loader = showLoader("Logging you in...");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = "student"; // Hardcoded as per your example

    const data = { email, password, role };

    try {
        const response = await fetch(endpoints.loginEnpoint, { // Typo fixed in endpoint name if applicable
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("accessToken", result.access_token);
            localStorage.setItem("userEmail", email);
            await fetchUserDetails(email); // Fetch user details after successful login
        } else {
            const errorResult = await response.json();
            showModal({
                title: "Login Failed",
                message: `Login failed: ${errorResult.message}`,
                noConfirm: true,
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        showModal({
            title: "Login Error",
            message: "Login error, please try again later",
            noConfirm: true,
        });
    } finally {
        loader.remove();
    }
}

// Check token and redirect on page load
document.addEventListener("DOMContentLoaded", () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired(accessToken)) {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (userDetails) {
            redirectToDashboard(userDetails.role); // Navigate to dashboard if token is valid
            return;
        }
        // If no userDetails in sessionStorage, fetch them
        const email = localStorage.getItem("userEmail");
        if (email) {
            fetchUserDetails(email);
        }
    }

    // Attach login handler if no valid token or userDetails
    const loginForm = document.querySelector("#loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Attach toggle password visibility if element exists
    const togglePassword = document.querySelector(".toggle-password");
    if (togglePassword) {
        togglePassword.addEventListener("click", togglePasswordVisibility);
    }
});