// Study Planner Enhanced Features

// Data structure for tasks
class Task {
  constructor(name, time, category = 'General', duration = 0) {
    this.id = Date.now(); // Unique identifier
    this.name = name;
    this.time = time;
    this.category = category;
    this.completed = false;
    this.duration = duration; // in minutes
    this.startTime = null;
    this.endTime = null;
  }
}

// Application state
const state = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  categories: JSON.parse(localStorage.getItem('categories')) || ['General', 'Math', 'Science', 'Language', 'Programming']
};

// Save state to localStorage
function saveState() {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
  localStorage.setItem('categories', JSON.stringify(state.categories));
}

// Add new task with enhanced features
function addTask() {
  const taskName = document.getElementById('task-name').value;
  const taskTime = document.getElementById('task-time').value;
  const taskCategory = document.getElementById('task-category')?.value || 'General';
  const taskDuration = document.getElementById('task-duration')?.value || 0;

  if (taskName && taskTime) {
    const newTask = new Task(taskName, taskTime, taskCategory, parseInt(taskDuration));
    state.tasks.push(newTask);
    saveState();
    displayTasks();
    resetTaskInputs();
  }
}

// Edit existing task
function editTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    const newName = prompt('Enter new task name:', task.name);
    const newTime = prompt('Enter new study time:', task.time);
    const newCategory = prompt('Enter new category:', task.category);

    if (newName) task.name = newName;
    if (newTime) task.time = newTime;
    if (newCategory) task.category = newCategory;

    saveState();
    displayTasks();
  }
}

// Delete task
function deleteTask(taskId) {
  state.tasks = state.tasks.filter(task => task.id !== taskId);
  saveState();
  displayTasks();
}

// Start study timer
function startStudyTimer(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.startTime = new Date();
    displayTasks();
  }
}

// Stop study timer
function stopStudyTimer(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task && task.startTime) {
    task.endTime = new Date();
    const studyDuration = Math.round((task.endTime - task.startTime) / 60000); // duration in minutes
    task.duration = studyDuration;
    task.completed = true;
    saveState();
    displayTasks();
  }
}

// Add new category
function addCategory() {
  const newCategory = prompt('Enter new category name:');
  if (newCategory && !state.categories.includes(newCategory)) {
    state.categories.push(newCategory);
    saveState();
    updateCategoryDropdown();
  }
}

// Update category dropdown
function updateCategoryDropdown() {
  const categorySelect = document.getElementById('task-category');
  if (categorySelect) {
    categorySelect.innerHTML = state.categories
      .map(category => `<option value="${category}">${category}</option>`)
      .join('');
  }
}

// Export tasks to JSON
function exportTasks() {
  const dataStr = JSON.stringify(state.tasks, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'study_planner_tasks.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import tasks from JSON
function importTasks() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  
  fileInput.onchange = function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const importedTasks = JSON.parse(e.target.result);
        state.tasks = [...state.tasks, ...importedTasks];
        saveState();
        displayTasks();
      } catch (error) {
        alert('Error importing tasks. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
  };
  
  fileInput.click();
}

// Display Tasks with enhanced UI
function displayTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  
  state.tasks.forEach((task) => {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.innerHTML = `
      <h2 class="task-title">${task.name}</h2>
      <p>Study time: ${task.time}</p>
      <p>Category: ${task.category}</p>
      <div class="progress-bar">
        <div class="completed" style="width: ${task.completed ? 100 : 0}%"></div>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${task.id})" class="btn-edit">Edit</button>
        <button onclick="deleteTask(${task.id})" class="btn-delete">Delete</button>
        <button onclick="${task.startTime ? 'stopStudyTimer' : 'startStudyTimer'}(${task.id})" 
                class="btn-timer">
          ${task.startTime ? 'Stop Timer' : 'Start Timer'}
        </button>
        <button onclick="markCompleted(${task.id})" class="btn-completed">
          ${task.completed ? 'Completed' : 'Mark as Completed'}
        </button>
      </div>
    `;
    taskList.appendChild(taskCard);
  });
}

// Mark Task as Completed
function markCompleted(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = true;
    saveState();
    displayTasks();
  }
}

// Initialize the app
function initApp() {
  // Add event listeners
  document.getElementById('add-task-btn').addEventListener('click', addTask);
  
  // Update category dropdown
  updateCategoryDropdown();
  
  // Initial task display
  displayTasks();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Expose functions for global use
window.editTask = editTask;
window.deleteTask = deleteTask;
window.startStudyTimer = startStudyTimer;
window.stopStudyTimer = stopStudyTimer;
window.markCompleted = markCompleted;
window.addCategory = addCategory;
window.exportTasks = exportTasks;
window.importTasks = importTasks;