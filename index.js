// Handle login functionality
async function handleLogin() {
    try {
        // Replace prompts with a proper login form in production
        const email = email('Enter your email:');
        const password = password('Enter your password:');
        const role = role('Enter your role')

        // Validate inputs
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Send login request to the backend API
        const response = await fetch('https://bekcodingclub-server.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                role,
            }),
        });

        // Handle response
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = '../../StudentDashboard/studentDashboard.html'; // Redirect to dashboard
        } else {
            throw new Error(data.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(`Login failed: ${error.message}`);
    }
}

// Handle sign-up redirection (already handled in HTML)
function handleSignUp() {
    window.location.href = 'register/register.html';
}

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login-btn');
    const signUpButton = document.querySelector('.sign-up-btn');

    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }

    if (signUpButton) {
        signUpButton.addEventListener('click', handleSignUp);
    }
});