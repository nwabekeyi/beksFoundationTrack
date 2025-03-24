import { getSessionData } from "../utils/getSessionData.js";
import { lessons } from "../utils/lessons.js";
import { createModal } from "../utils/modal.js";
import { endpoints } from "../secrets.js"; // Assuming endpoints are in a separate file
import { apiRequest } from "../../utils/apiCalls.js";

const userDetails = getSessionData("userDetails");
console.log(userDetails);

const accessToken = localStorage.getItem("accessToken"); // Assuming token is stored here

function saveCurrentTopicId(id) {
    localStorage.setItem("currentTopicId", id);
}

function updateCourseProgressBar() {
    const progressBar = document.getElementById("course-progress-bar");
    const progressText = document.getElementById("course-progress-text");
    if (progressBar && progressText) {
        progressText.innerText = `${userDetails.progress}%`;
        progressBar.value = userDetails.progress;
    }
}

function loadLessons(lessonsArray) {
    const topicList = document.getElementById("topic-list");
    if (!topicList) return;
    topicList.innerHTML = "";

    const currentTopicId = userDetails.currentTopicId;

    lessonsArray.forEach((lesson, index) => {
        const li = document.createElement("li");
        const padlockIcon = lesson.id <= currentTopicId
            ? '<iconify-icon icon="mdi:lock-open-outline" data-current="current" class="padlock-icon"></iconify-icon>'
            : '<iconify-icon icon="mdi:lock-outline" class="padlock-icon"></iconify-icon>';

        if (lesson.id > currentTopicId) {
            li.classList.add("blocked");
            li.innerHTML = `${padlockIcon} ${lesson.title}`;
        } else {
            li.innerHTML = `${padlockIcon} ${lesson.title}`;
            li.addEventListener("click", () => loadLesson(index));
        }

        topicList.appendChild(li);
    });

    const currentTopicIcon = document.querySelector('[data-current="current"]');
    if (currentTopicIcon) {
        currentTopicIcon.style.color = "#4caf50";
    }

    updateCourseProgressBar();
}

let currentImageIndex = 0;

function loadLesson(index) {
    const lesson = lessons[index];
    const lessonTitle = document.getElementById("lesson-title");
    const lessonContent = document.getElementById("lesson-content");
    if (lessonTitle && lessonContent) {
        lessonTitle.textContent = lesson.title;
        currentImageIndex = 0;
        updateLessonContent(lesson, currentImageIndex);
    }

    const sidebarItems = document.querySelectorAll(".sidebar li");
    sidebarItems.forEach((item) => {
        item.classList.remove("active-topic");
        item.classList.remove("active");
    });

    if (sidebarItems[index]) {
        sidebarItems[index].classList.add("active-topic");
        sidebarItems[index].classList.add("active");
    }

    updateNavigationButtons(index, lesson);
}

function updateLessonContent(lesson, imageIndex) {
    const lessonContent = document.getElementById("lesson-content");
    if (!lessonContent) return;

    lessonContent.innerHTML = "";

    const contentWrapper = document.createElement("div");
    contentWrapper.style.position = "relative";
    contentWrapper.style.display = "flex";
    contentWrapper.style.alignItems = "center";
    contentWrapper.style.justifyContent = "center";

    if (imageIndex > 0) {
        const prevArrow = document.createElement("iconify-icon");
        prevArrow.setAttribute("icon", "mdi:chevron-left");
        prevArrow.classList.add("nav-arrow");
        prevArrow.style.position = "absolute";
        prevArrow.style.left = "10px";
        prevArrow.style.fontSize = "30px";
        prevArrow.style.cursor = "pointer";
        prevArrow.style.color = "#f0f0f0";
        prevArrow.addEventListener("click", () => {
            currentImageIndex--;
            updateLessonContent(lesson, currentImageIndex);
        });
        contentWrapper.appendChild(prevArrow);
    }

    const img = document.createElement("img");
    img.src = lesson.content[imageIndex];
    img.alt = `${lesson.title} Slide ${imageIndex + 1}`;
    img.style.maxWidth = "100%";
    contentWrapper.appendChild(img);

    if (imageIndex < lesson.content.length - 1) {
        const nextArrow = document.createElement("iconify-icon");
        nextArrow.setAttribute("icon", "mdi:chevron-right");
        nextArrow.classList.add("nav-arrow");
        nextArrow.style.position = "absolute";
        nextArrow.style.right = "10px";
        nextArrow.style.fontSize = "30px";
        nextArrow.style.cursor = "pointer";
        nextArrow.style.color = "#f0f0f0";
        nextArrow.addEventListener("click", () => {
            currentImageIndex++;
            updateLessonContent(lesson, currentImageIndex);
        });
        contentWrapper.appendChild(nextArrow);
    }

    lessonContent.appendChild(contentWrapper);

    if (imageIndex === lesson.content.length - 1) {
        const doTaskBtn = document.createElement("button");
        doTaskBtn.textContent = "Do Task";
        doTaskBtn.classList.add("next-btn");
        doTaskBtn.style.marginTop = "20px";
        doTaskBtn.style.display = "block";
        doTaskBtn.style.float = "right";
        doTaskBtn.addEventListener("click", () => displayTask(lesson));
        lessonContent.appendChild(doTaskBtn);
    }
}

function updateNavigationButtons(lessonIndex, lesson) {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const currentTopicId = userDetails.currentTopicId;

    if (prevBtn && nextBtn) {
        prevBtn.style.display = lessonIndex === 0 ? "none" : "block";
        nextBtn.style.display = (lesson.id < currentTopicId && lessonIndex !== lessons.length - 1) ? "block" : "none";

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
    const lessonContent = document.getElementById("lesson-content");
    if (!lessonContent) return;

    lessonContent.innerHTML = `
        <h3>Task</h3>
        <p>${lesson.task}</p>
        <button id="submit-task-btn" class="next-btn">Submit Task</button>
    `;

    const submitTaskBtn = document.getElementById("submit-task-btn");
    if (submitTaskBtn) {
        submitTaskBtn.style.marginTop = "20px";
        submitTaskBtn.style.display = "block";
        submitTaskBtn.addEventListener("click", () => displaySubmissionForm(lesson));
    }
}

function displaySubmissionForm(lesson) {
    const lessonContent = document.getElementById("lesson-content");
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

    const form = document.getElementById("task-submission-form");
    const submissionInput = document.getElementById("submission-input");
    const radioButtons = document.querySelectorAll('input[name="submission-type"]');

    radioButtons.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "file") {
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

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
        if (currentIndex < lessons.length - 1) {
            const nextLessonId = lessons[currentIndex + 1].id;
            saveCurrentTopicId(nextLessonId);
        }
        console.log("Submission logic to be implemented");
        loadLessons(lessons);
        loadLesson(currentIndex);
    });
}

function handleNextLesson() {
    const currentIndex = Array.from(document.querySelectorAll(".sidebar li")).findIndex((item) =>
        item.classList.contains("active")
    );
    if (currentIndex < lessons.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextTopicId = lessons[nextIndex].id;

        saveCurrentTopicId(nextTopicId);
        loadLessons(lessons);
        loadLesson(nextIndex);
    }
}

function handleLogout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
}

async function updateStartDate() {
    const currentDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
    const payload = {
        userId: userDetails.id,
        startDate: currentDate,
    };

    const url = `${endpoints.startDate}/${userDetails.id}`;
    const body = JSON.stringify(payload);
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        const response = await apiRequest(url, "PATCH", body, headers, "Start Lessons");
        Object.assign(userDetails, response);
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        loadLearningPlatform(); // Show VSCode training after successful update
    } catch (error) {
        console.error("Error updating start date:", error);
        createModal({
            title: "Error",
            message: "Failed to start your learning journey. Please try again.",
            noConfirm: true,
        });
    }
}

function loadWelcomePage() {
    const topicList = document.getElementById("topic-list");
    const mainContent = document.getElementById("main-content");

    if (topicList) {
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
    }

    if (mainContent) {
        const buttonText = userDetails.status === "active" ? "Continue Learning" : "Start Learning";
        mainContent.innerHTML = `
            <div class="welcome-container">
                <h2>Welcome, ${userDetails.firstName}!</h2>
                <p>We're excited to have you on board. Ready to dive into your learning journey?</p>
                <img src="../assets/welcomeBg.png" />
                <button id="start-learning-btn" class="next-btn">${buttonText}</button>
            </div>
        `;
    }

    const homeItem = document.getElementById("home-item");
    const statsItem = document.getElementById("stats-item");
    const logoutItem = document.getElementById("logout-item");
    const startLearningBtn = document.getElementById("start-learning-btn");
    const logo = document.querySelector('.header-left');

    // Go to home on click of logo
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener("click", loadWelcomePage);
    }

    if (homeItem) homeItem.addEventListener("click", loadWelcomePage);
    if (statsItem) {
        statsItem.addEventListener("click", () => {
            if (mainContent) {
                mainContent.innerHTML = "<h2>Stats</h2><p>Your learning statistics will be displayed here soon!</p>";
            }
        });
    }
    if (logoutItem) {
        logoutItem.addEventListener("click", () => {
            createModal({
                title: "Confirm Logout",
                message: "Are you sure you want to logout?",
                onConfirm: handleLogout,
            });
        });
    }
    if (startLearningBtn) {
        startLearningBtn.addEventListener("click", () => {
            if (userDetails.status === "active") {
                // Navigate to the lesson matching currentTopicId
                const currentLessonIndex = lessons.findIndex(lesson => lesson.id === userDetails.currentTopicId);
                if (currentLessonIndex !== -1) {
                    loadLessonsPage();
                    loadLesson(currentLessonIndex);
                } else {
                    console.error("No lesson found matching currentTopicId:", userDetails.currentTopicId);
                    loadLessonsPage(); // Fallback to Lesson 1 if no match
                }
            } else if (userDetails.startDate === null && userDetails.status === "not_started") {
                updateStartDate(); // Update start date, then show VSCode training
            } else {
                loadLearningPlatform(); // Show VSCode training directly
            }
        });
    }
}

function loadLearningPlatform() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="lesson-header">
            <h2 id="lesson-title">Getting Started: What is an IDE?</h2>
        </div>
        <div id="lesson-content">
            <p>Hey there! Before we jump into coding, let’s talk about something called an <strong>IDE</strong>, or Integrated Development Environment. Think of it like a super helpful toolbox we use to write code—the instructions that tell computers what to do. Just like how a kitchen has everything you need to cook (stove, knives, and all), an IDE gives us tools to write, check, and fix our code easily, all in one place!</p>
            <h3>Types of IDEs</h3>
            <p>There are lots of IDEs out there, each with its own style. Here are a few you might hear about:</p>
            <ul>
                <li><strong>Eclipse</strong>: Great for writing Java code, often used by people making big apps.</li>
                <li><strong>IntelliJ IDEA</strong>: Another favorite for Java, super smart at helping you code faster.</li>
                <li><strong>PyCharm</strong>: Perfect if you’re coding in Python, like for making games or websites.</li>
                <li><strong>Visual Studio Code (VSCode)</strong>: The one we’ll use—it works for almost any coding language and is easy to customize!</li>
            </ul>
            <p>In this course, we’re going with <strong>Visual Studio Code (VSCode)</strong>. It’s made by Microsoft, and it’s awesome because it’s simple to use, doesn’t slow down your computer, and lets you tweak it to fit what you like. Whether you’re a beginner or a pro, VSCode has your back!
            <strong>All of your code in the course should be written on VSCode</strong>
            </p>
            <h3>Installing VSCode on Windows</h3>
            <p>Let’s get VSCode onto your computer. It’s like downloading a game or app—super easy! Here’s how:</p>
            <ol>
                <li>Go to the VSCode website: <a href="https://code.visualstudio.com/download" target="_blank">https://code.visualstudio.com/download</a></li>
                <li>Click the “Windows” button to download the installer—it’s a file that sets everything up.</li>
                <li>Find the file you downloaded (it’ll look something like <code>VSCodeSetup-x64-1.x.x.exe</code>) and double-click it.</li>
                <li>A setup wizard will pop up. Just:
                    <ul>
                        <li>Say “yes” to the agreement (it’s like agreeing to the rules).</li>
                        <li>Pick where to save it (the default spot is fine).</li>
                        <li>Check any extra boxes you want (like adding a shortcut to your desktop).</li>
                        <li>Hit “Install” and wait a bit.</li>
                        <li>Click “Finish” to open VSCode!</li>
                    </ul>
                </li>
                <li>Once it’s open, you’ll see a welcome screen. That’s your new coding home—ready for action!</li>
            </ol>
            <h3>How VSCode Works</h3>
            <p>VSCode is like your coding playground. When you open it, you’ll see:
                <ul>
                    <li>A <strong>file explorer</strong> on the left—like a folder list to find your projects.</li>
                    <li>A <strong>code editor</strong> in the middle—where you’ll type your code.</li>
                    <li>A <strong>terminal</strong> you can pop up (press Ctrl + \` )—think of it as a command center to talk to your computer.</li>
                </ul>
            </p>
            <p>You can also add <strong>extensions</strong>—little add-ons that make VSCode even cooler, like tools for writing HTML, CSS, or JavaScript. It’s like adding toppings to your favorite pizza!</p>
            <p>Check out this quick video to see VSCode in action:</p>
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
                <iframe 
                    src="https://www.youtube.com/embed/1I6NKNUg4Oc" 
                    frameborder="0" 
                    allowfullscreen 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                </iframe>
            </div>
            <button id="start-lessons-btn" class="next-btn" style="margin-top: 20px; float: right;">Start Lessons</button>
        </div>
    `;

    const startLessonsBtn = document.getElementById("start-lessons-btn");
    if (startLessonsBtn) {
        startLessonsBtn.addEventListener("click", () => loadLessonsPage());
    }
}

function loadLessonsPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

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
}

function setupSettingsDropdown() {
    const settingsIcon = document.getElementById("settings-icon");
    const settingsDropdown = document.getElementById("settings-dropdown");
    const userInfo = document.getElementById("user-info");
    const resetPasswordBtn = document.getElementById("reset-password-btn");

    if (userInfo) {
        userInfo.innerHTML = `
            <p><strong>Name:</strong> ${userDetails.firstName} ${userDetails.lastName || ""}</p>
            <p><strong>Email:</strong> ${userDetails.email}</p>
            <p><strong>Role:</strong> ${userDetails.role || "Student"}</p>
            <p><strong>Average Score:</strong> ${userDetails.averageScore || "N/A"}</p>
        `;
    }

    if (settingsIcon) {
        settingsIcon.addEventListener("click", () => {
            if (settingsDropdown) {
                settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (settingsIcon && settingsDropdown && !settingsIcon.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.style.display = "none";
        }
    });

    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener("click", () => {
            createModal({
                title: "Reset Password",
                message: `
                    <form id="reset-password-form">
                        <label for="new-password">New Password:</label>
                        <input type="password" id="new-password" required style="width: 100%; padding: 8px; margin-top: 5px; margin-bottom: 10px;">
                        <label for="confirm-password">Confirm Password:</label>
                        <input type="password" id="confirm-password" required style="width: 100%; padding: 8px; margin-top: 5px;">
                    </form>
                `,
                onConfirm: () => {
                    const newPassword = document.getElementById("new-password").value;
                    const confirmPassword = document.getElementById("confirm-password").value;
                    if (newPassword === confirmPassword) {
                        console.log("Password reset logic to be implemented", { newPassword });
                    } else {
                        alert("Passwords do not match!");
                    }
                },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const heading = document.getElementById("heading");
    if (heading) {
        heading.innerText = `Welcome to your learning dashboard, ${userDetails.firstName}`;
    }
    loadWelcomePage();
    setupSettingsDropdown();
});