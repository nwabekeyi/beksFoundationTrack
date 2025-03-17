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

// Calculate all the course progress
function calculateCourseProgress() {
    const totalProgress = mockLessons.reduce((sum, lesson) => sum + calculateProgress(lesson.tasks), 0);
    return totalProgress / mockLessons.length;
}

// Update the course progress bar
function updateCourseProgressBar() {
    const progress = calculateCourseProgress();
    const progressBar = document.getElementById('course-progress-bar');
    if (progressBar) {
        progressBar.value = progress; // Set the progress value
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
        const progress = calculateProgress(lesson.tasks);

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
                <div class="progress-circle blocked" style="--progress: ${progress * 3.6}deg;">
                    <span class="progress-text">${Math.round(progress)}%</span>
                </div>
                ${padlockIcon}
                ${lesson.id}. ${lesson.title}
            `;
        } else {
            li.innerHTML = `
                <div class="progress-circle" style="--progress: ${progress * 3.6}deg;">
                    <span class="progress-text">${Math.round(progress)}%</span>
                </div>
                ${padlockIcon}
                ${lesson.id}. ${lesson.title}
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
        lessonTitle.textContent = `${lesson.id}: ${lesson.title}`;
        lessonContent.innerHTML = lesson.content;
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

// Update progress when a task is completed
function updateProgress(lessonIndex) {
    const checkboxes = document.querySelectorAll(`input[data-task^="${lessonIndex + 1}-"]`);
    checkboxes.forEach((checkbox) => {
        const taskId = checkbox.getAttribute('data-task');
        const task = mockLessons[lessonIndex].tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = checkbox.checked;
        }
    });
    loadLessons(mockLessons);
    loadLesson(lessonIndex);
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