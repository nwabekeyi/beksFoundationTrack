import { apiRequest } from '../../utils/apiCalls.js';
import { endpoints } from '../../secrets.js';
import { showModal } from '../../utils/modal.js';

const handleFormSubmissions = () => {
  const pathname = window.location.pathname;

  // Reset password link request
  if (pathname.includes('requestResetPassword.html')) {
    const resetPasswordForm = document.querySelector('.requestPasswordReset');

    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.querySelector('.forgot-password-email').value;
        const url = endpoints.forgotPassword;
        const body = { email };
        const headers = { 'Content-Type': 'application/json' };

        try {
          if (!email) {
            showModal({
              title: "Password reset response",
              message: 'Please provide an email address, the field is empty',
              noConfirm: true
            });
          } else {
            const response = await apiRequest(url, 'POST', body, headers, 'Password Reset');
            console.log(response.message); // "Reset link sent to your email"
          }
        } catch (error) {
          console.error('Password reset request failed:', error.message);
        }
      });
    }
  }

  // Registration link request
  if (pathname.includes('signUp.html')) {
    const registrationLink = document.querySelector('.registration-link');

    if (registrationLink) {
      registrationLink.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.querySelector('.registration-link-email').value;
        const firstName = document.querySelector('.registration-link-name').value;
        const url = endpoints.regLink;
        const body = { email, firstName };
        const headers = { 'Content-Type': 'application/json' };

        try {
          if (!email || !firstName) {
            showModal({
              title: "Registration response",
              message: 'Field for first name or email is missing. Kindly verify',
              noConfirm: true
            });
          } else {
            const response = await apiRequest(url, 'POST', body, headers, 'Registration response');
            console.log(response.message); // "Registration link sent to your email"
            registrationLink.reset();
          }
        } catch (error) {
          console.error('Registration link request failed:', error.message);
        }
      });
    }
  }

  // Registration form
  if (pathname.includes('registrationForm.html')) {
    // Handle "Have an Account?" button click
    const accountBtn = document.querySelector('#account-btn');
    if (accountBtn) {
      accountBtn.addEventListener('click', () => {
        window.location.href = '../Login/index.html'; // Adjust redirect URL as needed
      });
    }

    // Registration form handling
    const registerForm = document.querySelector('.register-form'); 

    if (registerForm) {
      // Extract token and email from URL search params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const emailFromUrl = urlParams.get('email');

      // Set email field default value and make it read-only
      const emailInput = document.querySelector('#email');
      if (emailFromUrl) {
        emailInput.value = decodeURIComponent(emailFromUrl);
        emailInput.readOnly = true; // Make email field read-only
      }

      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const firstName = document.querySelector('#first-name').value;
        const lastName = document.querySelector('#last-name').value;
        const phone = document.querySelector('#phone').value;
        const email = emailInput.value;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;
        const terms = document.querySelector('#terms').checked;

        let errors = false;

        // Validation
        // Clear previous errors
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword || !terms) {
          showModal({
            title: 'Registration Error',
            message: 'All fields are required, and you must agree to the Terms and Conditions.',
            noConfirm: true
          });
          return;
        }

        // Password validation: Minimum 8 characters
        if (password.length < 8) {
          const passwordError = document.createElement('p');
          passwordError.textContent = 'Password must be at least 8 characters long.';
          passwordError.classList.add('error-message');
          passwordInput.parentNode.appendChild(passwordError);
          errors = true;
        }

        // Phone number validation
        const phoneRegex = /^(?:\+234|070|090|081|080|091)\d{9}$/;
        if (!phoneRegex.test(phone)) {
          const phoneError = document.createElement('p');
          phoneError.textContent = 'Invalid phone number. It must start with +234, 070, 090, 081, 080, or 091.';
          phoneError.classList.add('error-message');
          phoneInput.parentNode.appendChild(phoneError);
          errors = true;
        }

        if (phone.startsWith('+234') && phone.length !== 13) {
          const phoneLengthError = document.createElement('p');
          phoneLengthError.textContent = 'If starting with +234, phone number must be 13 digits long.';
          phoneLengthError.classList.add('error-message');
          phoneInput.parentNode.appendChild(phoneLengthError);
          errors = true;
        } else if (!phone.startsWith('+234') && phone.length !== 11) {
          const phoneLengthError = document.createElement('p');
          phoneLengthError.textContent = 'Phone number must be 11 digits long.';
          phoneLengthError.classList.add('error-message');
          phoneInput.parentNode.appendChild(phoneLengthError);
          errors = true;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
          const confirmPasswordError = document.createElement('p');
          confirmPasswordError.textContent = 'Passwords do not match.';
          confirmPasswordError.classList.add('error-message');
          confirmPasswordInput.parentNode.appendChild(confirmPasswordError);
          errors = true;
        }

        if (errors) return;

        // Prepare API request
        const url = endpoints.register;
        const body = {
          firstName,
          lastName,
          phone,
          email,
          password,
          role: 'student',
          token
        };
        const headers = { 'Content-Type': 'application/json' };

        try {
          const response = await apiRequest(url, 'POST', body, headers, 'Registration');
          console.log(response.message);
          registerForm.reset();
          window.location.href = '../Login/index.html'; // Adjust redirect URL as needed
        } catch (error) {
          console.error('Registration failed:', error.message);
          showModal({
            title: 'Registration Error',
            message: error.message,
            noConfirm: true
          });
        }
      });
    }
  }
};

// Call the function to attach event listeners based on the current page
handleFormSubmissions();
