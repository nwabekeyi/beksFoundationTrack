import { getSessionData } from "../utils/getSessionData.js";
import { lessons } from "../utils/lessons.js";
import { createModal } from "../utils/modal.js";
import { endpoints } from "../secrets.js";
import { apiRequest } from "../../utils/apiCalls.js";

let currentLessonIndex = 0;
let currentSubitem = "";

const userDetails = getSessionData("userDetails");
const accessToken = localStorage.getItem("accessToken");

// Ensure home page loads after login by checking accessToken
if (accessToken && userDetails) {
    loadWelcomePage(); // Force home page load if user is logged in
}

function saveCurrentTopicId(id) {
    localStorage.setItem("currentTopicId", id);
}

// Update course progress
function updateCourseProgressBar() {
    const progress = userDetails.currentTopicId / lessons.length * 100;
    const progressBar = document.getElementById("course-progress-bar");
    const progressText = document.getElementById("course-progress-text");
    if (progressBar && progressText) {
        progressText.innerText = `${parseInt(progress)}%`;
        progressBar.value = progress;
    }
}

// Load welcome page
function loadWelcomePage() {
    const topicList = document.getElementById("topic-list");
    const mainContent = document.getElementById("main-content");

    if (topicList) {
        topicList.innerHTML = `
            <li id="home-item" class="home-items"><iconify-icon icon="mdi:home" class="sidebar-icon"></iconify-icon> Home</li>
            <li id="stats-item" class="home-items"><iconify-icon icon="mdi:chart-bar" class="sidebar-icon"></iconify-icon> Stats</li>
            <li id="logout-item" class="home-items"><iconify-icon icon="mdi:logout" class="sidebar-icon"></iconify-icon> Logout</li>
        `;
    }

    if (mainContent) {
        const welcomeText = userDetails.status === "active" 
            ? "Welcome back, we hope to see you grow as you learn with us" 
            : "We're excited to have you on board. Ready to dive into your learning journey?";
        
        const buttonText = userDetails.status === "active" ? "Continue Learning" : "Start Learning";

        mainContent.innerHTML = `
            <div class="welcome-container">
                <h2>Welcome, ${userDetails.firstName}!</h2>
                <p>${welcomeText}</p>
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

    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener("click", loadWelcomePage);
    }

    if (homeItem) homeItem.addEventListener("click", loadWelcomePage);
    if (statsItem) statsItem.addEventListener("click", loadStatsPage);
    if (logoutItem) logoutItem.addEventListener("click", () => createModal({ title: "Confirm Logout", message: "Are you sure you want to logout?", onConfirm: handleLogout }));
    if (startLearningBtn) {
        startLearningBtn.addEventListener("click", () => {
            if (userDetails.status === "active") {
                const currentLessonIndex = lessons.findIndex(lesson => lesson.id === userDetails.currentTopicId);
                loadLessonsPage();
                loadSubitem(currentLessonIndex !== -1 ? currentLessonIndex : 0, "content-0");
            } else if (userDetails.status === "not_started") {
                showVSCodeIntroVideo(); // Show video for new users
            }
        });
    }
}

// Show VS Code intro video for new users
function showVSCodeIntroVideo() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="welcome-container">
            <h2>Getting Started with Visual Studio Code</h2>
            <p>You'll need Visual Studio Code installed to get started with your lessons. <a href="https://code.visualstudio.com/download" target="_blank">Download it here</a> if you haven't already!</p>
            <p>Watch this short video to learn the basics of VS Code:</p>
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
                <iframe src="https://www.youtube.com/embed/VqCgcpAypFQ" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
            </div>
            <button id="begin-lessons-btn" class="next-btn">Begin Lessons</button>
        </div>
    `;

    const beginLessonsBtn = document.getElementById("begin-lessons-btn");
    if (beginLessonsBtn) {
        beginLessonsBtn.addEventListener("click", () => {
            updateStartDate(); // Update status and proceed to lessons
        });
    }
}

// Load all lessons 
function loadLessonsPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="lesson-header">
            <h2 id="lesson-title"></h2>
        </div>
        <div id="lesson-content"></div>
        <div class="actions">
            <button class="prev-btn">Previous</button>
            <button class="next-btn">Next</button>
        </div>
    `;

    loadTopics(lessons);
}

// Load all topics
function loadTopics(lessonsArray) {
    const topicList = document.getElementById("topic-list");
    if (!topicList) return;
    topicList.innerHTML = "";

    const currentTopicId = userDetails.currentTopicId;

    lessonsArray.forEach((lesson, index) => {
        const li = document.createElement("li");
        const padlockIcon = lesson.id <= currentTopicId
            ? '<iconify-icon icon="mdi:lock-open-outline" data-current="current" class="padlock-icon"></iconify-icon>'
            : '<iconify-icon icon="mdi:lock-outline" class="padlock-icon"></iconify-icon>';
        const dropdownIcon = lesson.id <= currentTopicId ? '<iconify-icon icon="mdi:chevron-down" class="dropdown-arrow"></iconify-icon>' : '';
        let subitems = '<ul class="dropdown">';

        lesson.content.forEach((_, subIndex) => {
            subitems += `<li data-lesson-id="${index}" data-subitem="content-${subIndex}" class="${currentLessonIndex === index && currentSubitem === `content-${subIndex}` ? 'active-subitem' : ''}">Lesson ${subIndex + 1}</li>`;
        });

        subitems += `<li data-lesson-id="${index}" data-subitem="video" class="${currentLessonIndex === index && currentSubitem === 'video' ? 'active-subitem' : ''}">Video</li>`;
        subitems += `<li data-lesson-id="${index}" data-subitem="task" class="${currentLessonIndex === index && currentSubitem === 'task' ? 'active-subitem' : ''}">Task</li>`;
        subitems += '</ul>';

        li.innerHTML = `
            <div class="topic-container">
                <div class="topic-dropdown">
                    <div class="topic">${padlockIcon}
                        <p>${lesson.title}</p>
                    </div>
                    <div class="topic-header">${dropdownIcon}</div>
                </div>
                ${subitems}
            </div>
        `;

        if (lesson.id > currentTopicId) li.classList.add("blocked");

        const topicHeader = li.querySelector(".topic-header");
        if (lesson.id <= currentTopicId && topicHeader) {
            topicHeader.addEventListener("click", (e) => {
                e.preventDefault();
                const dropdown = li.querySelector(".dropdown");
                const arrow = li.querySelector(".dropdown-arrow");
                if (dropdown && arrow) {
                    if (dropdown.classList.contains("open")) {
                        dropdown.classList.remove("open");
                        arrow.setAttribute("icon", "mdi:chevron-down");
                    } else {
                        dropdown.classList.add("open");
                        arrow.setAttribute("icon", "mdi:chevron-up");
                    }
                }
            });
        }

        topicList.appendChild(li);
    });

    document.querySelectorAll(".dropdown li").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            const lessonIndex = parseInt(item.getAttribute("data-lesson-id"));
            const subitem = item.getAttribute("data-subitem");
            loadSubitem(lessonIndex, subitem);
        });
    });

    updateCourseProgressBar();
}

// Load subitems 
function loadSubitem(lessonIndex, subitem) {
    currentLessonIndex = lessonIndex;
    currentSubitem = subitem;
    const lesson = lessons[lessonIndex];
    const lessonTitle = document.getElementById("lesson-title");
    const lessonContent = document.getElementById("lesson-content");
    const currentTopicId = userDetails.currentTopicId;

    if (lessonTitle) {
        lessonTitle.textContent = subitem.startsWith("content-") 
            ? `${lesson.title} - Lesson ${parseInt(subitem.split('-')[1]) + 1}`
            : subitem === "video" 
                ? `${lesson.title} - Video`
                : `${lesson.title} - Task`;
    }

    if (subitem.startsWith("content-")) {
        if (lesson.id <= currentTopicId) {
            const slideIndex = parseInt(subitem.split('-')[1]);
            updateContentSlide(lesson, slideIndex);
        } else {
            lessonContent.innerHTML = `<p>This content is locked. Please complete the previous lessons to unlock this Lesson.</p>`;
        }
    } else if (subitem === "video") {
        displayVideo(lesson);
    } else if (subitem === "task") {
        displayTaskSubmission(lesson);
    }

    updateNavigationButtons(lessonIndex, subitem);
    highlightCurrentSubitem(lessonIndex, subitem);
}

function updateContentSlide(lesson, slideIndex) {
    const lessonContent = document.getElementById("lesson-content");
    if (!lessonContent) return;

    lessonContent.innerHTML = "";

    const contentWrapper = document.createElement("div");
    contentWrapper.style.position = "relative";
    contentWrapper.style.display = "flex";
    contentWrapper.style.alignItems = "center";
    contentWrapper.style.justifyContent = "center";

    if (slideIndex > 0) {
        const prevArrow = document.createElement("iconify-icon");
        prevArrow.setAttribute("icon", "mdi:chevron-left");
        prevArrow.classList.add("nav-arrow");
        prevArrow.style.position = "absolute";
        prevArrow.style.left = "10px";
        prevArrow.style.fontSize = "30px";
        prevArrow.style.cursor = "pointer";
        prevArrow.style.color = "#f0f0f0";
        prevArrow.addEventListener("click", () => loadSubitem(currentLessonIndex, `content-${slideIndex - 1}`));
        contentWrapper.appendChild(prevArrow);
    }

    const img = document.createElement("img");
    img.src = lesson.content[slideIndex];
    img.alt = `${lesson.title} Lesson ${slideIndex + 1}`;
    img.style.maxWidth = "100%";
    contentWrapper.appendChild(img);

    if (slideIndex < lesson.content.length - 1) {
        const nextArrow = document.createElement("iconify-icon");
        nextArrow.setAttribute("icon", "mdi:chevron-right");
        nextArrow.classList.add("nav-arrow");
        nextArrow.style.position = "absolute";
        nextArrow.style.right = "10px";
        nextArrow.style.fontSize = "30px";
        nextArrow.style.cursor = "pointer";
        nextArrow.style.color = "#f0f0f0";
        nextArrow.addEventListener("click", () => loadSubitem(currentLessonIndex, `content-${slideIndex + 1}`));
        contentWrapper.appendChild(nextArrow);
    }

    lessonContent.appendChild(contentWrapper);
}

// Load video
function displayVideo(lesson) {
    const lessonContent = document.getElementById("lesson-content");
    if (!lessonContent) return;

    lessonContent.innerHTML = `
        <h3>Video Resource</h3>
        <p>Watch this video to reinforce your understanding:</p>
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
            <iframe src="${lesson.videoLink.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
        </div>
    `;
}

// Check if 12 hours have passed since last submission
function canSubmitTask() {
    const lastSubmissionTime = localStorage.getItem("lastTaskSubmissionTime");
    if (!lastSubmissionTime) return true; // First submission

    const lastTime = new Date(lastSubmissionTime);
    const now = new Date();
    const hoursDifference = (now - lastTime) / (1000 * 60 * 60); // Convert ms to hours
    return hoursDifference >= 12;
}

// Display tasks with submission cooldown
function displayTaskSubmission(lesson) {
    const lessonContent = document.getElementById("lesson-content");
    if (!lessonContent) return;

    const canSubmit = canSubmitTask();
    const cooldownMessage = !canSubmit ? `
        <p style="color: #b22222; text-align: center;">You can submit a task again in 12 hours from your last submission.</p>
    ` : '';

    lessonContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 80%; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h3 style="text-align: center; color: #333; margin-bottom: 20px;">Task Submission</h3>
            <p>${lesson.task}</p>
            ${cooldownMessage}
            <form id="task-submission-form" style="display: flex; flex-direction: column; gap: 15px;" ${!canSubmit ? 'disabled' : ''}>
                <div style="display: flex; justify-content: space-between; gap: 20px;">
                    <label style="flex: 1; display: flex; align-items: center; font-size: 14px; color: #555;">
                        <input type="radio" name="submission-type" value="file" checked style="margin-right: 8px;"> Upload Files (HTML required, CSS optional)
                    </label>
                    <label style="flex: 1; display: flex; align-items: center; font-size: 14px; color: #555;">
                        <input type="radio" name="submission-type" value="text" style="margin-right: 8px;"> Enter Text
                    </label>
                </div>
                <div id="submission-input">
                    <div id="dropzone-upload" class="dropzone" style="border: 2px dashed #007bff; border-radius: 8px; padding: 20px; background-color: #fff; text-align: center; color: #666;"></div>
                </div>
                <button type="submit" class="next-btn" style="background-color: #007bff; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: ${canSubmit ? 'pointer' : 'not-allowed'}; font-size: 16px; transition: background-color 0.3s;" ${!canSubmit ? 'disabled' : ''}>Submit</button>
            </form>
        </div>
    `;

    const form = document.getElementById("task-submission-form");
    const submissionInput = document.getElementById("submission-input");
    const radioButtons = document.querySelectorAll('input[name="submission-type"]');

    const dropzoneElement = document.getElementById("dropzone-upload");
    const myDropzone = new Dropzone(dropzoneElement, {
        url: "#",
        acceptedFiles: ".html,.css",
        maxFiles: 2,
        dictDefaultMessage: "Drag and drop your HTML and CSS files here or click to upload<br>(HTML required, CSS optional)",
        autoProcessQueue: false,
    });

    radioButtons.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "file") {
                submissionInput.innerHTML = `
                    <div id="dropzone-upload" class="dropzone" style="border: 2px dashed #007bff; border-radius: 8px; padding: 20px; background-color: #fff; text-align: center; color: #666;"></div>
                `;
                const newDropzoneElement = document.getElementById("dropzone-upload");
                new Dropzone(newDropzoneElement, {
                    url: "#",
                    acceptedFiles: ".html,.css",
                    maxFiles: 2,
                    dictDefaultMessage: "Drag and drop your HTML and CSS files here or click to upload<br>(HTML required, CSS optional)",
                    autoProcessQueue: false,
                });
            } else {
                submissionInput.innerHTML = `
                    <textarea id="text-submission" rows="6" style="width: 100%; padding: 15px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; color: #333; resize: vertical; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);"></textarea>
                `;
            }
        });
    });

    if (form && canSubmit) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submissionType = document.querySelector('input[name="submission-type"]:checked').value;
        
            let payload = {
                query: null,
                files: [],
                criteria: lesson.criteria || "Evaluate the code based on correctness, structure, and best practices.",
                userId: userDetails.id,
                currentTopicId: lesson.id,
                lastTaskId: userDetails.lastTaskId || 0,
            };
        
            if (submissionType === "file") {
                if (myDropzone.files.length === 0) {
                    alert("Please upload at least one HTML file.");
                    return;
                }
                payload.files = myDropzone.files.map((file) => ({
                    originalname: file.name,
                    buffer: file,
                }));
            } else {
                const textSubmission = document.getElementById("text-submission")?.value;
                if (!textSubmission) {
                    alert("Please enter some text to submit.");
                    return;
                }
                payload.query = textSubmission;
            }
        
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            };
        
            try {
                const response = await apiRequest(endpoints.submitTask, "POST", payload, headers, "Submit Task");
        
                const now = new Date().toISOString();
                localStorage.setItem("lastTaskSubmissionTime", now);
        
                if (response.updatedUser) {
                    sessionStorage.setItem("userDetails", JSON.stringify(response.updatedUser));
                    console.log('User updated in session storage');
        
                    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
                    if (currentIndex < lessons.length - 1) {
                        const nextLessonId = lessons[currentIndex + 1].id;
                        saveCurrentTopicId(nextLessonId);
                    }
        
                    createModal({
                        title: "Submission Successful",
                        message: `Passed!!!\n\nScore: ${response.score}\n\nGreat job! Let's move to the next topic.`,
                        noConfirm: true,
                    });

                    if (response.score >= 50) {
                        const nextBtn = document.querySelector('.actions .next-btn');
                        if (nextBtn) {
                            nextBtn.disabled = false;
                            nextBtn.style.cursor = "pointer";
                            nextBtn.style.backgroundColor = "#007bff";
                            nextBtn.textContent = "Next Topic";
                            nextBtn.onclick = () => {
                                if (currentIndex + 1 < lessons.length) {
                                    loadSubitem(currentIndex + 1, "content-0");
                                }
                            };
                        }
                    }
        
                    loadSubitem(currentIndex, "task");
        
                } else {
                    createModal({
                        title: "Submission Failed",
                        message: `Scored below average.\n\nScore: ${response.score}\n\nHint: ${response.hints}\n\nPlease try again.`,
                        noConfirm: true,
                    });
                }
            } catch (error) {
                console.error("Task submission failed:", error);
            }
        });
    }
}

function highlightCurrentSubitem(lessonIndex, subitem) {
    document.querySelectorAll(".dropdown li").forEach(item => {
        item.classList.remove("active-subitem");
        if (parseInt(item.getAttribute("data-lesson-id")) === lessonIndex && item.getAttribute("data-subitem") === subitem) {
            item.classList.add("active-subitem");
        }
    });
}

// Update navigation buttons
function updateNavigationButtons(lessonIndex, subitem) {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const lesson = lessons[lessonIndex];
    const currentTopicId = userDetails.currentTopicId;

    if (prevBtn && nextBtn) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";

        if (subitem.startsWith("content-")) {
            const slideIndex = parseInt(subitem.split('-')[1]);
            if (lesson.id <= currentTopicId) {
                if (slideIndex > 0) {
                    prevBtn.style.display = "block";
                    prevBtn.textContent = "Previous Lesson";
                    prevBtn.onclick = () => loadSubitem(lessonIndex, `content-${slideIndex - 1}`);
                } else if (lessonIndex > 0) {
                    prevBtn.style.display = "block";
                    prevBtn.textContent = "Previous Lesson Task";
                    prevBtn.onclick = () => loadSubitem(lessonIndex - 1, "task");
                }

                if (slideIndex < lesson.content.length - 1) {
                    nextBtn.style.display = "block";
                    nextBtn.textContent = "Next Lesson";
                    nextBtn.onclick = () => loadSubitem(lessonIndex, `content-${slideIndex + 1}`);
                } else {
                    nextBtn.style.display = "block";
                    nextBtn.textContent = "Go to Video";
                    nextBtn.onclick = () => loadSubitem(lessonIndex, "video");
                }
            }
        } else if (subitem === "video") {
            prevBtn.style.display = "block";
            prevBtn.textContent = lesson.content.length > 0 ? "Back to Last Lesson" : (lessonIndex > 0 ? "Previous Lesson Task" : "");
            prevBtn.onclick = () => loadSubitem(lessonIndex, lesson.content.length > 0 ? `content-${lesson.content.length - 1}` : (lessonIndex > 0 ? "task" : null));

            nextBtn.style.display = "block";
            nextBtn.textContent = "Go to Task";
            nextBtn.onclick = () => loadSubitem(lessonIndex, "task");
        } else if (subitem === "task") {
            prevBtn.style.display = "block";
            prevBtn.textContent = "Back to Video";
            prevBtn.onclick = () => loadSubitem(lessonIndex, "video");

            if (currentTopicId <= lessonIndex + 1) {
                nextBtn.style.display = "block";
                nextBtn.textContent = "Submit";
                const isDisabled = currentTopicId <= lesson.id;
                nextBtn.style.cursor = isDisabled ? "not-allowed" : "pointer";
                nextBtn.style.backgroundColor = isDisabled ? "#ccc" : "#007bff";
                nextBtn.disabled = isDisabled;
                nextBtn.onclick = isDisabled
                    ? () => createModal({
                        title: "Task Not Completed",
                        message: "You must pass this task to unlock the next topic.",
                        noConfirm: true
                    })
                    : () => loadSubitem(lessonIndex + 1, "content-0");
            }
        }
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
}

// Update start date
async function updateStartDate() {
    const currentDate = new Date().toISOString().split("T")[0];
    const payload = {
        userId: userDetails.id,
        startDate: currentDate,
    };

    const url = `${endpoints.startDate}/${userDetails.id}`;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        const response = await apiRequest(url, "PATCH", payload, headers, "Start Lessons");
        if (response.userId) {
            const updatedUser = { ...userDetails, status: "active" };
            sessionStorage.setItem("userDetails", JSON.stringify(updatedUser));
            userDetails.status = "active"; // Update local userDetails object
        }
        loadLessonsPage();
        loadSubitem(0, "content-0");
    } catch (error) {
        console.error("Error updating start date:", error);
        createModal({
            title: "Error",
            message: "Failed to start your learning journey. Please try again.",
            noConfirm: true,
        });
    }
}

// Popup settings
function setupSettingsDropdown() {
    const settingsIcon = document.getElementById("settings-icon");
    const settingsDropdown = document.getElementById("settings-dropdown");
    const userInfo = document.getElementById("user-info");

    if (userInfo) {
        userInfo.innerHTML = `
            <p><strong>Name:</strong> ${userDetails.firstName} ${userDetails.lastName || ""}</p>
            <p><strong>Email:</strong> ${userDetails.email}</p>
            <p><strong>Role:</strong> ${userDetails.role || "Student"}</p>
            <p><strong>Average Score:</strong> ${userDetails.averageScore === 0 || userDetails.averageScore ? userDetails.averageScore : 'N/A'}</p>
        `;
    }

    if (settingsDropdown) {
        settingsDropdown.innerHTML = `
            <ul style="list-style: none; padding: 0; margin: 0; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <li class="settings-option" id="view-profile" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; background-color: #f0f8ff; color: #0e3b7a; transition: background-color 0.2s;">
                    <iconify-icon icon="mdi:account" style="margin-right: 10px; font-size: 20px; color: #0e3b7a;"></iconify-icon> View Profile
                </li>
                <li class="settings-option" id="app-settings" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; background-color: #f5f5f5; color: #333; transition: background-color 0.2s;">
                    <iconify-icon icon="mdi:cog" style="margin-right: 10px; font-size: 20px; color: #333;"></iconify-icon> App Settings
                </li>
                <li class="settings-option" idjp="reset-password" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; background-color: #fff0f0; color: #b22222; transition: background-color 0.2s;">
                    <iconify-icon icon="mdi:lock-reset" style="margin-right: 10px; font-size: 20px; color: #b22222;"></iconify-icon> Reset Password
                </li>
            </ul>
        `;

        const options = settingsDropdown.querySelectorAll(".settings-option");
        options.forEach(option => {
            option.addEventListener("mouseover", () => {
                if (option.id === "view-profile") option.style.backgroundColor = "#e0f0ff";
                if (option.id === "app-settings") option.style.backgroundColor = "#e8e8e8";
                if (option.id === "reset-password") option.style.backgroundColor = "#ffe0e0";
            });
            option.addEventListener("mouseout", () => {
                if (option.id === "view-profile") option.style.backgroundColor = "#f0f8ff";
                if (option.id === "app-settings") option.style.backgroundColor = "#f5f5f5";
                if (option.id === "reset-password") option.style.backgroundColor = "#fff0f0";
            });
        });
    }

    if (settingsIcon && settingsDropdown) {
        settingsIcon.addEventListener("click", () => {
            settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!settingsIcon.contains(e.target) && !settingsDropdown.contains(e.target)) {
                settingsDropdown.style.display = "none";
            }
        });
    }

    const viewProfileOption = document.getElementById("view-profile");
    const appSettingsOption = document.getElementById("app-settings");
    const resetPasswordOption = document.getElementById("reset-password");

    if (viewProfileOption) {
        viewProfileOption.addEventListener("click", () => {
            createModal({
                title: "User Profile",
                htmlContent: `
                    <div style="padding: 10px;">
                        <p><strong>Name:</strong> ${userDetails.firstName} ${userDetails.lastName || ""}</p>
                        <p><strong>Email:</strong> ${userDetails.email}</p>
                        <p><strong>Role:</strong> ${userDetails.role || "Student"}</p>
                        <p><strong>Average Score:</strong> ${userDetails.averageScore === 0 || userDetails.averageScore ? userDetails.averageScore : 'N/A'}</p>
                    </div>
                `,
                noConfirm: true
            });
            settingsDropdown.style.display = "none";
        });
    }

    if (appSettingsOption) {
        appSettingsOption.addEventListener("click", () => {
            const modal = createModal({
                title: "App Settings",
                htmlContent: `
                    <form id="app-settings-form" style="display: flex; flex-direction: column; gap: 15px;">
                        <label><input type="checkbox" id="dark-mode" ${localStorage.getItem("darkMode") === "true" ? "checked" : ""}> Enable Dark Mode</label>
                        <label><input type="checkbox" id="notifications" ${localStorage.getItem("notifications") === "true" ? "checked" : ""}> Enable Notifications</label>
                        <button type="submit" style="padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                    </form>
                `,
                css: `
                    label { display: flex; align-items: center; gap: 8px; }
                `
            });

            const form = modal.querySelector("#app-settings-form");
            if (form) {
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const darkMode = form.querySelector("#dark-mode").checked;
                    const notifications = form.querySelector("#notifications").checked;
                    localStorage.setItem("darkMode", darkMode);
                    localStorage.setItem("notifications", notifications);
                    console.log("Settings saved:", { darkMode, notifications });
                    closeModal(modal);
                });
            }
            settingsDropdown.style.display = "none";
        });
    }

    if (resetPasswordOption) {
        resetPasswordOption.addEventListener("click", () => {
            const modal = createModal({
                title: "Reset Password",
                htmlContent: `
                    <form id="reset-password-form" style="display: flex; flex-direction: column; gap: 15px;">
                        <label for="new-password">New Password:</label>
                        <input type="password" id="new-password" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <label for="confirm-password">Confirm Password:</label>
                        <input type="password" id="confirm-password" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <button type="submit" style="padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset</button>
                    </form>
                `
            });

            const form = modal.querySelector("#reset-password-form");
            if (form) {
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const newPassword = form.querySelector("#new-password").value;
                    const confirmPassword = form.querySelector("#confirm-password").value;
                    if (newPassword === confirmPassword) {
                        console.log("Password reset logic to be implemented", { newPassword });
                        closeModal(modal);
                    } else {
                        alert("Passwords do not match!");
                    }
                });
            }
            settingsDropdown.style.display = "none";
        });
    }
}

function loadStatsPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    const completedLessons = userDetails.currentTopicId;
    const totalLessons = lessons.length;
    const progressPercentage = (completedLessons / totalLessons) * 100;
    const totalScore = userDetails.totalScore || 0;
    const averageScore = userDetails.averageScore || 0;

    mainContent.innerHTML = `
        <div class="stats-container" style="padding: 20px; max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; color: #333; margin-bottom: 30px;">Your Learning Stats</h2>
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div class="stat-card" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: #0e3b7a; margin-bottom: 15px; text-align: center;">Lessons Progress</h3>
                    <canvas id="lessonsChart" style="max-height: 200px;"></canvas>
                    <p style="text-align: center; margin-top: 10px; color: #666;">${completedLessons} / ${totalLessons} lessons</p>
                </div>
                <div class="stat-card" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: #0e3b7a; margin-bottom: 15px; text-align: center;">Total Score</h3>
                    <canvas id="totalScoreChart" style="max-height: 200px;"></canvas>
                    <p style="text-align: center; margin-top: 10px; color: #666;">${totalScore} points</p>
                </div>
                <div class="stat-card" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: #0e3b7a; margin-bottom: 15px; text-align: center;">Average Score</h3>
                    <canvas id="averageScoreChart" style="max-height: 200px;"></canvas>
                    <p style="text-align: center; margin-top: 10px; color: #666;">${averageScore} / 100</p>
                </div>
                <div class="stat-card" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: #0e3b7a; margin-bottom: 15px; text-align: center;">Progress</h3>
                    <canvas id="progressChart" style="max-height: 200px;"></canvas>
                    <p style="text-align: center; margin-top: 10px; color: #666;">${parseInt(progressPercentage)}%</p>
                </div>
            </div>
        </div>
    `;

    const lessonsCtx = document.getElementById("lessonsChart").getContext("2d");
    new Chart(lessonsCtx, {
        type: "bar",
        data: {
            labels: ["Completed", "Remaining"],
            datasets: [{
                label: "Lessons",
                data: [completedLessons, totalLessons - completedLessons],
                backgroundColor: ["#007bff", "#e0e0e0"],
                borderColor: ["#0056b3", "#b0b0b0"],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: totalLessons, ticks: { stepSize: 1 }, title: { display: true, text: "Lessons" } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw} lessons` } } }
        }
    });

    const totalScoreCtx = document.getElementById("totalScoreChart").getContext("2d");
    new Chart(totalScoreCtx, {
        type: "bar",
        data: {
            labels: ["Total Score"],
            datasets: [{
                label: "Score",
                data: [totalScore],
                backgroundColor: "#28a745",
                borderColor: "#1e7e34",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Points" } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw} points` } } }
        }
    });

    const averageScoreCtx = document.getElementById("averageScoreChart").getContext("2d");
    new Chart(averageScoreCtx, {
        type: "bar",
        data: {
            labels: ["Average Score", "Max"],
            datasets: [{
                label: "Score",
                data: [averageScore, 100 - averageScore],
                backgroundColor: ["#ffc107", "#e0e0e0"],
                borderColor: ["#e0a800", "#b0b0b0"],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: "Score" } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw} / 100` } } }
        }
    });

    const progressCtx = document.getElementById("progressChart").getContext("2d");
    new Chart(progressCtx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Remaining"],
            datasets: [{
                data: [progressPercentage, 100 - progressPercentage],
                backgroundColor: ["#17a2b8", "#e0e0e0"],
                borderColor: ["#117a8b", "#b0b0b0"],
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${parseInt(context.raw)}%` } } }
        }
    });
}

export {
    loadWelcomePage,
    setupSettingsDropdown,
};