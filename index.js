import { showLoader } from "./utils/loader.js";

// Loader setup
let loading = true;
const loader = showLoader("Welcome to your foundation track learning app...");

// Initial page load welcome loader
const setLoader = setTimeout(() => {
  loader.remove();
  loading = false;
  clearInterval(setLoader); // Note: clearInterval isn’t needed for setTimeout, keeping your logic
}, 2000); // Wait 2 seconds (fade-out duration)

// Sign Up button redirect
const signupBtn = document.querySelector('.sign-up-btn');
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    window.location.href = './Auth/Signup/registrationForm.html';
  });
}

// Mobile navbar toggle and title animation (runs after loader)
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navbar toggle
  const menuIcon = document.querySelector('.menu-icon');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuIcon && mobileMenu) {
    menuIcon.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');
      if (!isActive) {
        // When opening: Show, slide down, and rotate icon to 45deg
        mobileMenu.style.display = 'flex'; // Show immediately
        mobileMenu.offsetHeight; // Force reflow for transition
        mobileMenu.classList.add('active'); // Slide down
        menuIcon.style.transform = 'rotate(45deg)'; // Rotate to 45deg
      } else {
        // When closing: Slide up, reset icon, then hide
        mobileMenu.classList.remove('active'); // Slide up
        menuIcon.style.transform = 'rotate(0deg)'; // Rotate back to normal
        setTimeout(() => {
          mobileMenu.style.display = 'none'; // Hide after slide-up
        }, 500); // Match transition duration (0.5s)
      }
    });
  }

  // Title animation (only runs after loader is done)
  if (!loading) {
    const titles = [
      "Novice To Experts With Beks Coding Club",
      "Experts To Masters With Beks Coding Club",
      "Masters To Pioneers With Beks Coding Club"
    ];
    let currentIndex = 0;
    const titleElement = document.getElementById("title");

    function updateTitle() {
      titleElement.style.opacity = 0;

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % titles.length;
        titleElement.textContent = titles[currentIndex];
        titleElement.style.opacity = 1;
      }, 1000); // Wait 1 second (fade-out duration)
    }

    titleElement.style.opacity = 1;
    setTimeout(updateTitle, 5000); // Wait 5 seconds before first transition
    setInterval(updateTitle, 5000); // Update every 5 seconds
  } else {
    setTimeout(() => {
      const titles = [
        "Novice To Experts With Beks Coding Club",
        "Experts To Masters With Beks Coding Club",
        "Masters To Pioneers With Beks Coding Club"
      ];
      let currentIndex = 0;
      const titleElement = document.getElementById("title");

      function updateTitle() {
        titleElement.style.opacity = 0;

        setTimeout(() => {
          currentIndex = (currentIndex + 1) % titles.length;
          titleElement.textContent = titles[currentIndex];
          titleElement.style.opacity = 1;
        }, 1000); // Wait 1 second (fade-out duration)
      }

      titleElement.style.opacity = 1;
      setTimeout(updateTitle, 5000); // Wait 5 seconds before first transition
      setInterval(updateTitle, 5000); // Update every 5 seconds
    }, 2000); // Match loader timeout
  }
});