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
    const registerForm = document.querySelector('.register-form'); // Using querySelector as requested
    console.log('Register form found:', registerForm);

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

        // Validation
        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword || !terms) {
          showModal({
            title: 'Registration Error',
            message: 'All fields are required, and you must agree to the Terms and Conditions.',
            noConfirm: true
          });
          return;
        }

        if (password !== confirmPassword) {
          showModal({
            title: 'Registration Error',
            message: 'Passwords do not match.',
            noConfirm: true
          });
          return;
        }

        if (!token) {
          showModal({
            title: 'Registration Error',
            message: 'Registration token is missing. Please use a valid registration link.',
            noConfirm: true
          });
          return;
        }

        // Prepare API request
        const url = endpoints.register;
        console.log(url)
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