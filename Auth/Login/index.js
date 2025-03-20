// Toggle password visibility
import { showLoader } from "../../utils/loader.js";
import { createModal } from "../../utils/modal.js";

    createModal({
        title: "Login response",
        message:"Failed to parse user details. Please try again.",
        noConfirm: true
    }
    )


function togglePasswordVisibility() {
    console.log("Toggle function called"); // Debugging log

    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password i");

    if (!passwordInput || !toggleIcon) {
        console.error("Password input or toggle icon not found"); // Debugging log
        return;
    }

    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Show password
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash"); // Change icon to "eye-slash"
    } else {
        passwordInput.type = "password"; // Hide password
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye"); // Change icon to "eye"
    }
}

// Function to fetch user details by email
async function fetchUserDetails(email) {
    //showLoader
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        console.log("Access token found. Fetching user details...");

        try {
            console.log("Fetching details for email:", email); // Log the email
            const response = await fetch(`https://bekcodingclub-server.onrender.com/users/email/${encodeURIComponent(email)}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Response status:", response.status); // Log the status code
            console.log("Response status text:", response.statusText); // Log the status text

            if (response.ok) {
                const responseText = await response.text(); // Get the raw response body
                console.log("Response body:", responseText); // Log the raw response body

                try {
                    const userDetails = JSON.parse(responseText); // Try to parse as JSON
                    console.log("User details fetched:", userDetails);

                    // Save user details in session storage
                    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
                    console.log("User details saved to session storage.");
                    console.log("Session storage contents:", sessionStorage); // Log session storage

                    //remove loader
                    return userDetails;
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                    loader.remove();
                    createModal({
                        title: "Login response",
                        message:"Failed to parse user details. Please try again.",
                        onCancel: () => alert('Action canceled!'),
                        noConfirm: true
                    }
                    )
                }
            } else {
                console.error("Failed to fetch user details:", response.statusText);
                console.log("Response body:", await response.text()); // Log the raw response body

                if (response.status === 404) {
                    alert("User not found. Please check your email.");
                } else {
                    alert("Failed to fetch user details. Please try again.");
                }
            }
        } catch (error) {
            loader.remove();
            console.error("Error fetching user details:", error);
            alert("An error occurred. Please try again later.");
        }
    } else {
        console.log("No access token found in local storage.");
        alert("No access token found. Please log in again.");
    }
}

// Login function
async function handleLogin(event) {
    const loader = showLoader("Loging you in...");
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const data = {
        email: email,
        password: password, 
        role: role, 
    };

    try {
        // POST request to log in
        const response = await fetch("https://bekcodingclub-server.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            loader.remove();
            const result = await response.json();
            console.log("Login successful:", result);

            if (result.access_token) {
                // Save the access token to local storage
                localStorage.setItem("accessToken", result.access_token);
                console.log("Access token saved to local storage.");

                // Save the email to local storage (optional)
                localStorage.setItem("userEmail", email);

                // Fetch user details by email after saving the token
                const userDetails =  await fetchUserDetails(email); // Pass the email here
                loader.remove();

                if(userDetails.email && userDetails.role === 'student' ){
                    window.location.href = '../../StudentDashboard/studentDashBoard.html'
                }else{
                    window.location.href = '../../StudentDashboard/AdminDashBoard.html'; 
                }
            }

        } else {
            loader.remove();
            const errorResult = await response.json(); 
            console.error("Login failed:", errorResult);
            alert(`Login failed: ${errorResult.message}`); 
        }
    } catch (error) {
        loader.remove();
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later."); 
    }
}

// Attach the login function to the form
document.querySelector("#loginForm").addEventListener("submit", handleLogin);

// Fetch user details on page load (if token exists)
document.addEventListener("DOMContentLoaded", () => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    if (!userDetails) {
        // Fetch user details by email if not already in session storage
        const email = localStorage.getItem("userEmail"); // Assuming you save the email in local storage
        if (email) {
            fetchUserDetails(email);
        }
    }

    // Initialize Swiper Carousel
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        loop: true, // Enables infinite looping
        autoplay: {
            delay: 3000, // Auto-slide every 3 seconds
        },
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // Scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
});