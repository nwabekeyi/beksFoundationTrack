import { showLoader } from "./utils/loader.js";

console.log(document.referrer)

const loader = showLoader("Welcome to your foundation track learning app...")

//initial page load welcome loader 
const setLoader = setTimeout(() => {
  loader.remove();
  clearInterval(setLoader)
},3000); // Wait for 1 second (fade-out duration)


const titles = [
    "Novice To Experts With Beks Coding Club",
    "Experts To Masters With Beks Coding Club",
    "Masters To Pioneers With Beks Coding Club"
  ];
  
  let currentIndex = 0;
  const titleElement = document.getElementById("title");
  
  function updateTitle() {
    // Fade out the current title
    titleElement.style.opacity = 0;
  
    setTimeout(() => {
      // Update the title after fade-out
      currentIndex = (currentIndex + 1) % titles.length; // Loop through the titles
      titleElement.textContent = titles[currentIndex];
  
      // Fade in the new title
      titleElement.style.opacity = 1;
    }, 2000); // Wait for 1 second (fade-out duration)
  }
  
  // Automatically update the title when the page loads
  window.onload = () => {
    titleElement.style.opacity = 1; // Ensure the title is visible initially
    setTimeout(updateTitle, 5000); // Wait 3 seconds before the first transition
  };
  
  // Update the title every 5 seconds (loop continuously)
  setInterval(updateTitle, 5000); // 5000 milliseconds = 5 seconds