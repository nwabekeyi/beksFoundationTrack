// main.js
import { getSessionData } from "../utils/getSessionData.js";
import {
    loadWelcomePage,
    setupSettingsDropdown
} from './cores.js';

const userDetails = getSessionData("userDetails");
const sidebar = document.querySelector('.sidebar');
const menuIcon = document.querySelector('.menu-icon');

// Log for debugging
console.log('Sidebar:', sidebar);
console.log('Menu Icon:', menuIcon);

// Media query for screens smaller than 1200px
const mediaQuery = window.matchMedia('(max-width: 1199px)');

// Toggle sidebar and menu icon rotation on smaller screens
function toggleSidebar() {
    if (mediaQuery.matches) {
        sidebar.classList.toggle('open');
        menuIcon.classList.toggle('rotated'); // Toggle rotation class
    }
}

// Close sidebar if clicking outside of it
function closeSidebarOnOutsideClick(event) {
    if (mediaQuery.matches) {
        // Check if the click is outside the sidebar and menu icon
        if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
            sidebar.classList.remove('open');
            menuIcon.classList.remove('rotated');
        }
    }
}

// Add event listener to menu icon
menuIcon.addEventListener('click', toggleSidebar);

// Add event listener to document for outside clicks
document.addEventListener('click', closeSidebarOnOutsideClick);

// Update sidebar and icon state on window resize
window.addEventListener('resize', () => {
    if (!mediaQuery.matches) {
        sidebar.classList.remove('open'); // Reset sidebar
        menuIcon.classList.remove('rotated'); // Reset icon rotation
    }
});

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    const heading = document.getElementById("heading");
    if (heading) heading.innerText = `Welcome to your learning dashboard, ${userDetails.firstName}`;
    loadWelcomePage();
    setupSettingsDropdown();
});