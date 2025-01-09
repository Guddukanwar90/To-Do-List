// Reference elements
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const categoryInput = document.getElementById('categoryInput');
const addBtn = document.getElementById('addBtn');
const sortBtn = document.getElementById('sortBtn');
const taskList = document.getElementById('taskList');

// Tasks array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Current filter
let currentFilter = 'all';

// Save tasks to local storage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add a new task
const addTask = () => {
    const taskText = taskInput.value.trim();
    const dueDate = dateInput.value;
    const category = categoryInput.value;

    if (taskText && dueDate && category) {
        tasks.push({
            text: taskText,
            dueDate: dueDate,
            category: category,
            completed: false
        });
        taskInput.value = '';
        dateInput.value = '';
        saveTasks();
        renderTasks();
    } else {
        alert('Please fill in all fields.');
    }
};

// Delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

// Toggle task completion
const toggleCompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

// Edit a task
const editTask = (index) => {
    const newTaskText = prompt('Edit your task:', tasks[index].text);
    const newDueDate = prompt('Edit due date (YYYY-MM-DD):', tasks[index].dueDate);
    const newCategory = prompt('Edit category (Work, Personal, Urgent):', tasks[index].category);

    if (
        newTaskText !== null &&
        newDueDate !== null &&
        newCategory !== null &&
        newTaskText.trim() !== ''
    ) {
        tasks[index].text = newTaskText.trim();
        tasks[index].dueDate = newDueDate;
        tasks[index].category = newCategory;
        saveTasks();
        renderTasks();
    }
};

// Filter tasks
const filterTasks = (filter) => {
    currentFilter = filter;
    renderTasks();
};

// Sort tasks by due date
const sortTasks = () => {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
};

// Render tasks to the UI
const renderTasks = () => {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    taskList.innerHTML = filteredTasks
        .map(
            (task, index) => `
            <li>
                <span class="${task.completed ? 'completed' : ''}" onclick="toggleCompletion(${index})">
                    ${task.text}
                </span>
                <div class="details">
                    <span>Due: ${task.dueDate}</span>
                    <span>Category: ${task.category}</span>
                </div>
                <div>
                    <button class="action-btn edit-btn" onclick="editTask(${index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteTask(${index})">Delete</button>
                </div>
            </li>
        `
        )
        .join('');
};

// Event listeners
addBtn.addEventListener('click', addTask);
sortBtn.addEventListener('click', sortTasks);

// Initial render
renderTasks();
