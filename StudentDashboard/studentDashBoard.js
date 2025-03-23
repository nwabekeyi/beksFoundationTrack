import { getSessionData } from "../utils/getSessionData.js";
import { lessons } from "../utils/lessons.js";
import { createModal } from "../utils/modal.js";

const userDetails = getSessionData('userDetails');
console.log(userDetails);

function saveCurrentTopicId(id) {
    localStorage.setItem('currentTopicId', id);
}

function updateCourseProgressBar() {
    const progressBar = document.getElementById('course-progress-bar');
    const progressText = document.getElementById("course-progress-text");
    if (progressBar && progressText) {
        progressText.innerText = `${userDetails.progress}%`;
        progressBar.value = userDetails.progress;
    }
}

function loadLessons(lessonsArray) {
    const topicList = document.getElementById('topic-list');
    if (!topicList) return;
    topicList.innerHTML = '';

    const currentTopicId = userDetails.currentTopicId;

    lessonsArray.forEach((lesson, index) => {
        const li = document.createElement('li');
        const padlockIcon = lesson.id <= currentTopicId
            ? '<iconify-icon icon="mdi:lock-open-outline" data-current="current" class="padlock-icon"></iconify-icon>'
            : '<iconify-icon icon="mdi:lock-outline" class="padlock-icon"></iconify-icon>';

        if (lesson.id > currentTopicId) {
            li.classList.add('blocked');
            li.innerHTML = `${padlockIcon} ${lesson.title}`;
        } else {
            li.innerHTML = `${padlockIcon} ${lesson.title}`;
            li.addEventListener('click', () => loadLesson(index));
        }

        topicList.appendChild(li);
    });

    const currentTopicIcon = document.querySelector('[data-current="current"]');
    if (currentTopicIcon) {
        currentTopicIcon.style.color = '#4caf50';
    }

    updateCourseProgressBar();
}

let currentImageIndex = 0;

function loadLesson(index) {
    const lesson = lessons[index];
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');
    if (lessonTitle && lessonContent) {
        lessonTitle.textContent = lesson.title;
        currentImageIndex = 0;
        updateLessonContent(lesson, currentImageIndex);
    }

    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach((item) => {
        item.classList.remove('active-topic');
        item.classList.remove('active');
    });

    if (sidebarItems[index]) {
        sidebarItems[index].classList.add('active-topic');
        sidebarItems[index].classList.add('active');
    }

    updateNavigationButtons(index, lesson);
}

function updateLessonContent(lesson, imageIndex) {
    const lessonContent = document.getElementById('lesson-content');
    if (!lessonContent) return;

    lessonContent.innerHTML = '';

    const contentWrapper = document.createElement('div');
    contentWrapper.style.position = 'relative';
    contentWrapper.style.display = 'flex';
    contentWrapper.style.alignItems = 'center';
    contentWrapper.style.justifyContent = 'center';

    if (imageIndex > 0) {
        const prevArrow = document.createElement('iconify-icon');
        prevArrow.setAttribute('icon', 'mdi:chevron-left');
        prevArrow.classList.add('nav-arrow');
        prevArrow.style.position = 'absolute';
        prevArrow.style.left = '10px';
        prevArrow.style.fontSize = '30px';
        prevArrow.style.cursor = 'pointer';
        prevArrow.style.color = '#333';
        prevArrow.addEventListener('click', () => {
            currentImageIndex--;
            updateLessonContent(lesson, currentImageIndex);
        });
        contentWrapper.appendChild(prevArrow);
    }

    const img = document.createElement('img');
    img.src = lesson.content[imageIndex];
    img.alt = `${lesson.title} Slide ${imageIndex + 1}`;
    img.style.maxWidth = '100%';
    contentWrapper.appendChild(img);

    if (imageIndex < lesson.content.length - 1) {
        const nextArrow = document.createElement('iconify-icon');
        nextArrow.setAttribute('icon', 'mdi:chevron-right');
        nextArrow.classList.add('nav-arrow');
        nextArrow.style.position = 'absolute';
        nextArrow.style.right = '10px';
        nextArrow.style.fontSize = '30px';
        nextArrow.style.cursor = 'pointer';
        nextArrow.style.color = '#333';
        nextArrow.addEventListener('click', () => {
            currentImageIndex++;
            updateLessonContent(lesson, currentImageIndex);
        });
        contentWrapper.appendChild(nextArrow);
    }

    lessonContent.appendChild(contentWrapper);

    if (imageIndex === lesson.content.length - 1) {
        const doTaskBtn = document.createElement('button');
        doTaskBtn.textContent = 'Do Task';
        doTaskBtn.classList.add('next-btn');
        doTaskBtn.style.marginTop = '20px';
        doTaskBtn.style.display = 'block';
        doTaskBtn.addEventListener('click', () => displayTask(lesson));
        lessonContent.appendChild(doTaskBtn);
    }
}

function updateNavigationButtons(lessonIndex, lesson) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentTopicId = userDetails.currentTopicId;

    if (prevBtn && nextBtn) {
        prevBtn.style.display = lessonIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = (lesson.id < currentTopicId && lessonIndex !== lessons.length - 1) ? 'block' : 'none';

        prevBtn.onclick = () => {
            if (lessonIndex > 0) {
                loadLesson(lessonIndex - 1);
            }
        };

        nextBtn.onclick = () => {
            if (lessonIndex < lessons.length - 1 && lesson.id < currentTopicId) {
                handleNextLesson();
            }
        };
    }
}

function displayTask(lesson) {
    const lessonContent = document.getElementById('lesson-content');
    if (!lessonContent) return;

    lessonContent.innerHTML = `
        <h3>Task</h3>
        <p>${lesson.task}</p>
        <button id="submit-task-btn" class="next-btn">Submit Task</button>
    `;

    const submitTaskBtn = document.getElementById('submit-task-btn');
    submitTaskBtn.style.marginTop = '20px';
    submitTaskBtn.style.display = 'block';
    submitTaskBtn.addEventListener('click', () => displaySubmissionForm(lesson));
}

function displaySubmissionForm(lesson) {
    const lessonContent = document.getElementById('lesson-content');
    if (!lessonContent) return;

    lessonContent.innerHTML = `
        <h3>Submit Your Task</h3>
        <form id="task-submission-form">
            <label>
                <input type="radio" name="submission-type" value="file" checked> Upload Files (HTML required, CSS optional)
            </label>
            <label>
                <input type="radio" name="submission-type" value="text"> Enter Text
            </label>
            <div id="submission-input">
                <input type="file" id="html-upload" accept=".html" required style="margin-top: 10px; display: block;">
                <input type="file" id="css-upload" accept=".css" style="margin-top: 10px; display: block;">
            </div>
            <button type="submit" class="next-btn">Submit</button>
        </form>
    `;

    const form = document.getElementById('task-submission-form');
    const submissionInput = document.getElementById('submission-input');
    const radioButtons = document.querySelectorAll('input[name="submission-type"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'file') {
                submissionInput.innerHTML = `
                    <input type="file" id="html-upload" accept=".html" required style="margin-top: 10px; display: block;">
                    <input type="file" id="css-upload" accept=".css" style="margin-top: 10px; display: block;">
                `;
            } else {
                submissionInput.innerHTML = `
                    <textarea id="text-submission" rows="10" cols="50" style="margin-top: 10px; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                `;
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentIndex = lessons.findIndex(l => l.id === lesson.id);
        if (currentIndex < lessons.length - 1) {
            const nextLessonId = lessons[currentIndex + 1].id;
            saveCurrentTopicId(nextLessonId);
        }
        console.log('Submission logic to be implemented');
        loadLessons(lessons);
        loadLesson(currentIndex);
    });
}

function handleNextLesson() {
    const currentIndex = Array.from(document.querySelectorAll('.sidebar li')).findIndex(item => item.classList.contains('active'));
    if (currentIndex < lessons.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextTopicId = lessons[nextIndex].id;

        saveCurrentTopicId(nextTopicId);
        loadLessons(lessons);
        loadLesson(nextIndex);
    }
}

function handleLogout() {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

// Initial Welcome Page
function loadWelcomePage() {
    const topicList = document.getElementById('topic-list');
    const mainContent = document.getElementById('main-content');

    // Sidebar with Home, Stats, Logout
    topicList.innerHTML = `
        <li id="home-item">
            <iconify-icon icon="mdi:home" class="sidebar-icon"></iconify-icon> Home
        </li>
        <li id="stats-item">
            <iconify-icon icon="mdi:chart-bar" class="sidebar-icon"></iconify-icon> Stats
        </li>
        <li id="logout-item">
            <iconify-icon icon="mdi:logout" class="sidebar-icon"></iconify-icon> Logout
        </li>
    `;

    // Welcome Message and Start Learning Button
    mainContent.innerHTML = `
        <div class="welcome-container">
            <h2>Welcome, ${userDetails.firstName}!</h2>
            <p>We're excited to have you on board. Ready to dive into your learning journey?</p>
            <button id="start-learning-btn" class="next-btn">Start Learning</button>
        </div>
    `;

    // Event Listeners for Sidebar Items
    document.getElementById('home-item').addEventListener('click', loadWelcomePage);
    document.getElementById('stats-item').addEventListener('click', () => {
        mainContent.innerHTML = '<h2>Stats</h2><p>Your learning statistics will be displayed here soon!</p>';
    });
    document.getElementById('logout-item').addEventListener('click', () => {
        createModal({
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            onConfirm: handleLogout
        });
    });

    // Start Learning Button
    document.getElementById('start-learning-btn').addEventListener('click', loadLearningPlatform);
}

// Load Learning Platform
function loadLearningPlatform() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="lesson-header">
            <h2 id="lesson-title">Lesson 1</h2>
        </div>
        <div id="lesson-content"></div>
        <div class="actions">
            <button class="prev-btn">Previous Lesson</button>
            <button class="next-btn">Next Lesson</button>
        </div>
    `;
    loadLessons(lessons);
    loadLesson(0);
}

function setupSettingsDropdown() {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const userInfo = document.getElementById('user-info');
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    const logoutBtn = document.getElementById('logout-btn');

    userInfo.innerHTML = `
        <p><strong>Name:</strong> ${userDetails.firstName} ${userDetails.lastName || ''}</p>
        <p><strong>Email:</strong> ${userDetails.email}</p>
        <p><strong>Role:</strong> ${userDetails.role || 'Student'}</p>
        <p><strong>Average Score:</strong> ${userDetails.averageScore || 'N/A'}</p>
    `;

    settingsIcon.addEventListener('click', () => {
        settingsDropdown.style.display = settingsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!settingsIcon.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.style.display = 'none';
        }
    });

    resetPasswordBtn.addEventListener('click', () => {
        createModal({
            title: 'Reset Password',
            message: `
                <form id="reset-password-form">
                    <label for="new-password">New Password:</label>
                    <input type="password" id="new-password" required style="width: 100%; padding: 8px; margin-top: 5px; margin-bottom: 10px;">
                    <label for="confirm-password">Confirm Password:</label>
                    <input type="password" id="confirm-password" required style="width: 100%; padding: 8px; margin-top: 5px;">
                </form>
            `,
            onConfirm: () => {
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                if (newPassword === confirmPassword) {
                    console.log('Password reset logic to be implemented', { newPassword });
                } else {
                    alert('Passwords do not match!');
                }
            }
        });
    });

    logoutBtn.addEventListener('click', () => {
        createModal({
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            onConfirm: handleLogout
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const heading = document.getElementById('heading');
    heading.innerText = `Welcome to your learning dashboard, ${userDetails.firstName}`;
    loadWelcomePage();
    setupSettingsDropdown();
});