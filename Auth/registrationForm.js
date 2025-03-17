function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const terms = document.getElementById('terms').checked;


    //Basic validation 
    if(!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('All fields are required');
        return;
    }

    if (!terms) {
        alert ('You must agree to the Terms and Conditions.');
        return;
    }

    
    if (password !== confirmPassword) {
        alert('Password do not Match');
        return;
    }

    //Password strength validation (optional)
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    //Simulate API call for registration
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Registration successful');
            document.getElementById('registration-form').reset(); //reset the form

            window.location.href = '.../studentDashBoard.html'; //Redirect to student dashboard
        } else {
            throw new Error(data.message || 'Registration failed due to an unknown error.');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    //Optional: Prefill email from query parameters 
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (email) {
        document.getElementById('email').value = email;
    }

    //attach the form subnission handler
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegister);
    }
});