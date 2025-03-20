import { getSessionData } from "../utils/getSessionData.js";

createOpenDialogButton()
const userDetails = getSessionData('userDetails');
console.log(userDetails)

let mockLessons = [
    {
        id: 1,
        title: "Introduction to HTML",
        content: "....",
        tasks: [
            { id: "1-1", completed: false },
            { id: "1-2", completed: false },
            { id: "1-3", completed: false }
        ]
    },
    {
        id: 2,
        title: "Texts",
        content: "...",
        tasks: [
            { id: "2-1", completed: false },
            { id: "2-2", completed: false },
            { id: "2-3", completed: false }
        ]
    },
    {
        id: 3,
        title: "Lists",
        content: "...",
        tasks: [
            { id: "3-1", completed: false },
            { id: "3-2", completed: false },
            { id: "3-3", completed: false }
        ]
    }
];

// Save current topic ID to localStorage
function saveCurrentTopicId(id) {
    localStorage.setItem('currentTopicId', id);
}

// Get current topic ID from localStorage
function getCurrentTopicId() {
    return parseInt(localStorage.getItem('currentTopicId')) || 1; // Default to 1 if not set
}

// Calculate progress before loading lesson
function calculateProgress(tasks) {
    if (tasks.length === 0) return 0; // Avoid division by zero
    const completedTasks = tasks.filter(task => task.completed).length;
    return (completedTasks / tasks.length) * 100;
}

// Update the course progress bar
function updateCourseProgressBar() {
    const progressBar = document.getElementById('course-progress-bar');
    const progressText = document.getElementById("course-progress-text");
    progressText.innerText = `${userDetails.progress}%`
    if (progressBar) {
        progressBar.value = userDetails.progress; // Set the progress value
    }
}

// Load lessons and block topics with IDs greater than currentTopicId
function loadLessons(lessons) {
    const topicList = document.getElementById('topic-list');
    if (!topicList) return;
    topicList.innerHTML = '';

    const currentTopicId = getCurrentTopicId(); // Get current topic ID from localStorage

    lessons.forEach((lesson, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px'
        li.style.boxShadow= '0 4px 8px rgba(0, 0, 0, 0.1)'

        // Add padlock icon based on currentTopicId
        const padlockIcon = lesson.id <= currentTopicId
            ? '<iconify-icon icon="mdi:lock-open-outline" data-current="current" class="padlock-icon"></iconify-icon>'
            : '<iconify-icon icon="mdi:lock-outline" class="padlock-icon"></iconify-icon>';

            //changing the padlock icon for currenttopic to white
            const currentTopicIcon = document.querySelector('[data-current="current"]');
            console.log(currentTopicIcon);
            if(currentTopicIcon){
                currentTopicIcon.style.color = '#fff';

            }

           

        // Block topics with IDs greater than currentTopicId
        if (lesson.id > currentTopicId) {
            li.classList.add('blocked');
            li.innerHTML = `
                ${padlockIcon}
                ${lesson.title}
            `;
        } else {
            li.innerHTML = `
                ${padlockIcon}
                ${lesson.title}
            `;
            li.addEventListener('click', () => loadLesson(index));
        }

        topicList.appendChild(li);
    });

    updateCourseProgressBar(); // Update progress bar after loading lessons
}

// Load a specific lesson
function loadLesson(index) {
    if (!mockLessons || !mockLessons[index]) {
        console.error('Invalid lesson index or mockLessons not initialized', index, mockLessons);
        return;
    }
    const lesson = mockLessons[index];
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');
    if (lessonTitle && lessonContent) {
        lessonTitle.textContent = lesson.title;
        lessonContent.innerHTML = lesson.content;
        lessonTitle.style.color = '#6B6B6B'
    }

    // Save the current topic ID to localStorage
    saveCurrentTopicId(lesson.id);

    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach((item) => {
        item.classList.remove('active-topic'); //remove active-topic class from all items
        item.classList.remove('active'); //remove active class (if any)
    });

    if (sidebarItems[index]) {
        sidebarItems[index].classList.add('active-topic'); //adding active -topic class to the current item
        sidebarItems[index].classList.add('active'); //incase active class is needed for other functionality 
    }
    
    updateNavigationButtons(index);
}



// Update navigation buttons (Previous and Next)
function updateNavigationButtons(index) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (prevBtn && nextBtn) {
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === mockLessons.length - 1 ? 'none' : 'block';
    }
}

// Fetch lessons from the server (mock API)
function fetchLessonsFromServer() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockLessons);
        }, 1000);
    });
}

// Handle "Next Lesson" button click
function handleNextLesson() {
    const currentIndex = Array.from(document.querySelectorAll('.sidebar li')).findIndex(item => item.classList.contains('active'));
    if (currentIndex < mockLessons.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextTopicId = mockLessons[nextIndex].id;

        // Save the next topic ID to localStorage
        saveCurrentTopicId(nextTopicId);

        // Reload lessons to apply the blocking logic
        loadLessons(mockLessons);

        // Load the next lesson
        loadLesson(nextIndex);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {

    //get all element
    const heading =  document.getElementById('heading');



    heading.innerText = `Welcome to your learning dashboard, ${userDetails.firstName}`
    
    fetchLessonsFromServer().then((lessons) => {
        mockLessons = lessons;
        loadLessons(mockLessons);
        loadLesson(0); // Load the first lesson by default
    });

    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentIndex = Array.from(document.querySelectorAll('.sidebar li')).findIndex(item => item.classList.contains('active'));
            if (currentIndex > 0) loadLesson(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextLesson);
    }
});