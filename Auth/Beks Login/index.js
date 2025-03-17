const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password i");

function togglePasswordVisibility() {
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


const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const role = document.getElementById("role").value;
async function handleLogin(event) {
    event.preventDefault(); 

    const data = {
        email: email,
        password: password, 
        role: role, 
    };

    try {
        const response = await fetch("https://bekcodingclub-server.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(data), 
        });

        if (response.ok) {
            const result = await response.json(); 
            console.log("Login successful:", result);
            alert("Login successful!"); 
        } else {
            const errorResult = await response.json(); 
            console.error("Login failed:", errorResult);
            alert(`Login failed: ${errorResult.message}`); 
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later."); 
    }
}

document.querySelector(".form").addEventListener("submit", handleLogin);