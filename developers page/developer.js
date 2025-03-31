const profiles = [
    {
        name: "Chidi",
        role: "Lead Developer",
        bio: "Seasoned full-stack developer with 10+ years experience in building scalable applications.",
        github: "github.com/hossein",
        twitter: "@hossein_dev",
        facebook: "fb.com/hossein.dev",
        image: "profile1.jpg"
    },

    {
        name: "Chidi",
        role: "Lead Developer",
        bio: "Seasoned full-stack developer with 10+ years experience in building scalable applications.",
        github: "github.com/hossein",
        twitter: "@hossein_dev",
        facebook: "fb.com/hossein.dev",
        image: "profile1.jpg"
    },

    {
        name: "Chidi",
        role: "Lead Developer",
        bio: "Seasoned full-stack developer with 10+ years experience in building scalable applications.",
        github: "github.com/hossein",
        twitter: "@hossein_dev",
        facebook: "fb.com/hossein.dev",
        image: "/developers page/image/image1.png",
        overlay: {
            bgImage: "url('image/image1.png')",
            name: "Jane Smith",
            role: "Full Stack Specialist"
        }

    },

    {
        name: "Chidi",
        role: "Lead Developer",
        bio: "Seasoned full-stack developer with 10+ years experience in building scalable applications.",
        github: "github.com/hossein",
        twitter: "@hossein_dev",
        facebook: "fb.com/hossein.dev",
        image: "image1.png"
    },

    {
        name: "Chidi",
        role: "Lead Developer",
        bio: "Seasoned full-stack developer with 10+ years experience in building scalable applications.",
        github: "github.com/hossein",
        twitter: "@hossein_dev",
        facebook: "fb.com/hossein.dev",
        image: "profile1.jpg"
    },

];
console.log(profiles);

    // Add 4 more profile objects here

    //bg function



    //bg function



const wrapper = document.querySelector('.profiles-wrapper');
const detailsPanel = document.querySelector('.profile-details');
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
                <p class="profile-role">${profile.role}</p>
            </div>
        </div>
    `;
    wrapper.innerHTML += profileHTML;
});

// Navigation buttons
document.querySelector('.next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % profiles.length;
    updateCarousel();
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
    updateCarousel();
});

// Profile click handler
document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
        const index = card.dataset.index;
        showProfileDetails(index);
    });
});

function updateCarousel() {
    document.querySelectorAll('.profile-card').forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
    });
}

function showProfileDetails(index) {
    const profile = profiles[index];
    detailsPanel.innerHTML = `
        <span class="close-btn" onclick="detailsPanel.classList.remove('active')">×</span>
        <div class="profile-image">
            <img src="${profile.image}" alt="${profile.name}">
        </div>
        <h2>${profile.name}</h2>
        <p><strong>Specialization:</strong> ${profile.role}</p>
        <p><strong>Bio:</strong> ${profile.bio}</p>
        <div class="social-links">
            <a href="${profile.github}">GitHub</a>
            <a href="${profile.twitter}">Twitter</a>
            <a href="${profile.facebook}">Facebook</a>
        </div>
    `;
    detailsPanel.classList.add('active');
}

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-card') && !e.target.closest('.profile-details')) {
        detailsPanel.classList.remove('active');
    }
});