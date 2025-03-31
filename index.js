// Sign Up button redirect
const signupBtn = document.querySelector('.sign-up-btn');
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    window.location.href = './Auth/Signup/signUp.html';
  });
}

// Mobile navbar toggle and title animation
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuIcon && mobileMenu) {
    menuIcon.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');
      if (!isActive) {
        mobileMenu.style.display = 'flex';
        mobileMenu.offsetHeight; // Force reflow
        mobileMenu.classList.add('active');
        menuIcon.style.transform = 'rotate(45deg)';
      } else {
        mobileMenu.classList.remove('active');
        menuIcon.style.transform = 'rotate(0deg)';
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 500);
      }
    });
  }

  // Title animation
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
    }, 1000);
  }

  titleElement.style.opacity = 1;
  setTimeout(updateTitle, 5000);
  setInterval(updateTitle, 5000);
});

// Developers page
const profiles = [
  {
    name: "Chidiebere Nwabekeyi",
    role: "Lead Developer",
    bio: "A skilled Full Stack Developer with 4 years of experience in Javascript and Python, building scalable web applications. Strong in both front-end and back-end development, API design, and database integration. Proven ability to lead teams and deliver high-quality projects. Known for problem-solving and attention to detail.",
    github: "https://github.com/nwabekeyi",
    twitter: "https://x.com/nwabekeyi",
    facebook: "https://web.facebook.com/nwabekeyi.simeon",
    image: "./assets/ebere.png"
  },
  {
    name: "Daniel Ukpai",
    role: "Frontend developer/Cybersecurity analyst",
    bio: "Frontend Developer specialized in secure web applications, blending expertise in modern JavaScript frameworks with a strong foundation in Cybersecurity. Focused on building performant, accessible, and attack-resistant UIs,  advocates for security-first development practices without compromising user experience.",
    github: "https://github.com/dceetechbro",
    twitter: "https://x.com/dcee_techbro?s=21",
    facebook: "https://www.facebook.com/share/199auTVkwR/?mibextid=wwXIfr",
    image: "./assets/Daniel_Upkpai.jpeg"
  },
  {
    name: "Daniel Iwu",
    role: "Full-stack developer/Graphic designer",
    bio: "Bridging the gap between code and creativity, I'm a fullstack developer with a passion for crafting seamless user experiences. My background in UX/UI, graphic design, and motion graphics fuels my ability to build intuitive, visually stunning applications that resonate with users. I thrive on solving complex problems and transforming ideas into interactive realities.",
    github: "https://www.linkedin.com/in/daniel-iwu-186854152/",
    twitter: "https://x.com/dcee_techbro?s=21",
    facebook: "https://www.linkedin.com/in/daniel-iwu-186854152/",
    image: "./assets/image1.png",
  },
  {
    name: "Ayomide Olaomoju",
    role: "Mernstack Developer",
    bio: "A proficient MERN Stack Developer with expertise in building full-stack web applications using MongoDB, Express, React, and Node.js. Skilled in developing responsive front-end interfaces, designing RESTful APIs, and managing databases. Strong problem-solving abilities and a passion for delivering efficient, scalable solutions. Experienced in working in agile teams and collaborating across the development lifecycle.",
    github: "https://github.com/Thebetapikin",
    twitter: "https://www.tiktok.com/@thebetapikin0?_t=ZM-8v21jWAvQbF&_r=1",
    facebook: "https://www.tiktok.com/@thebetapikin0?_t=ZM-8v21jWAvQbF&_r=1",
    image: "./assets/ayomide.jpg"
  },
];

const wrapper = document.querySelector('.profiles-wrapper');
const detailsPanel = document.querySelector('.profile-details');
const backgroundLayer = document.querySelector('.background-layer');
const backgroundName = document.querySelector('.background-name');
const backgroundRole = document.querySelector('.background-role');
let currentIndex = 0;

// Generate profile cards
profiles.forEach((profile, index) => {
  const profileHTML = `
    <div class="profile-card ${index === 0 ? 'active' : ''}" data-index="${index}">
      <div class="profile-image">
        <img src="${profile.image}" alt="${profile.name}">
      </div>
      <div class="profile-info">
        <h3 class="profile-name">${profile.name}</h3>
      </div>
    </div>
  `;
  wrapper.innerHTML += profileHTML;
});

// Initial background layer setup
updateBackgroundLayer();

// Profile click handler
document.querySelectorAll('.profile-card').forEach(card => {
  card.addEventListener('click', () => {
    const profileDetails = document.querySelector('.profile-details');
    profileDetails.style.display = 'block'
    const index = card.dataset.index;
    currentIndex = parseInt(index); // Update currentIndex when clicked
    updateCarousel();
    updateBackgroundLayer();
    showProfileDetails(index, card); // Pass the clicked card
  });
});

function updateCarousel() {
  document.querySelectorAll('.profile-card').forEach((card, index) => {
    card.classList.toggle('active', index === currentIndex);
  });
}

function updateBackgroundLayer() {
  const profile = profiles[currentIndex];
  backgroundLayer.style.backgroundImage = `
    linear-gradient(to bottom, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 1) 100%),
    url(${profile.image})
  `;
  backgroundName.textContent = profile.name;
  backgroundRole.textContent = profile.role;
}


function showProfileDetails(index, card) {
  const profile = profiles[index];
  detailsPanel.innerHTML = `
    <div class="profile-image-details">
        
      <img src="${profile.image}" alt="${profile.name}">
      <div class="name-socials">
         <h2>${profile.name}</h2>
        <p> ${profile.role}</p>
         <div class="social-links">
      <a href="${profile.github}" target="_blank" class="social-icon">
        <iconify-icon icon="mdi:github" width="20"></iconify-icon>
      </a>
      <a href="${profile.twitter}" target="_blank" class="social-icon">
        <iconify-icon icon="mdi:twitter" width="20"></iconify-icon>
      </a>
      <a href="${profile.facebook}" target="_blank" class="social-icon">
        <iconify-icon icon="mdi:facebook" width="20"></iconify-icon>
      </a>
    </div>
    </div>
    </div>
          <p class="bio">${profile.bio}</p>
    <div class="navigation-buttons">
    <button class="scroll-btn prev-btn">
      <span class="iconify" data-icon="mdi:arrow-left" data-inline="false"></span>
    </button>
    <button class="scroll-btn next-btn">
      <span class="iconify" data-icon="mdi:arrow-right" data-inline="false"></span>
    </button>
  </div>
  
  `;

  // Position the details panel below the clicked card
  const cardRect = card.getBoundingClientRect();
  const panelWidth = detailsPanel.offsetWidth || 400; // Default width if not yet rendered
  detailsPanel.style.position = 'absolute';
 // Check if the screen width is 1200px or less
if (window.innerWidth <= 1200 && window.innerWidth >= 1024  ) {
  // Set custom positions when the screen width is 1200px or less
  detailsPanel.style.top = '40%'; // Set top position to 430px
  detailsPanel.style.left = '27%'; // Set left position to 92px
} else if(window.innerWidth <= 860 && window.innerWidth > 601) {
  // Set custom positions when the screen width is 1200px or less
  detailsPanel.style.top = '40%'; // Set top position to 430px
  detailsPanel.style.left = '18%'; // Set left position to 92px
}else if(window.innerWidth <= 498) {
  // Set custom positions when the screen width is 1200px or less
  detailsPanel.style.top = '35%'; // Set top position to 430px
  detailsPanel.style.left = '20px'; // Set left position to 92px
}else if(window.innerWidth >= 499 && window.innerWidth < 601) {
  // Set custom positions when the screen width is 1200px or less
  detailsPanel.style.top = '40%'; // Set top position to 430px
  detailsPanel.style.left = '4%'; // Set left position to 92px
}else if(window.innerWidth <= 1400 && window.innerWidth >= 1200) {
  // Set custom positions when the screen width is 1200px or less
  detailsPanel.style.top = '60%'; // Set top position to 430px
  detailsPanel.style.left = '32%'; // Set left position to 92px
}else {
  // Default behavior for larger screens
  detailsPanel.style.top = `430px`; // 10px below the card
  detailsPanel.style.left = `${cardRect.left + (cardRect.width / 2) - (panelWidth / 2) + window.scrollX}px`; // Centered under the card
}
  detailsPanel.classList.add('active');

  // Add event listeners to the navigation buttons inside the panel
  detailsPanel.querySelector('.prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
    updateCarousel();
    updateBackgroundLayer();
    showProfileDetails(currentIndex, document.querySelector(`.profile-card[data-index="${currentIndex}"]`));
  });

  detailsPanel.querySelector('.next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % profiles.length;
    updateCarousel();
    updateBackgroundLayer();
    showProfileDetails(currentIndex, document.querySelector(`.profile-card[data-index="${currentIndex}"]`));
  });
}

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  if (
  !e.target.closest('.profile-card') && 
  !e.target.closest('.profile-details') &&
  !e.target.closest('.prev-btn') &&
  !e.target.closest('.next-btn')) {
    const profileDetails = document.querySelector('.profile-details');
    detailsPanel.classList.remove('active');
    profileDetails.style.display = 'none'
  }
});