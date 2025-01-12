// Load tasks from localStorage if they exist
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add Task button event listener
document.getElementById('add-task-btn').addEventListener('click', function() {
  const taskName = document.getElementById('task-name').value;
  const taskTime = document.getElementById('task-time').value;

  if (taskName && taskTime) {
    const task = {
      name: taskName,
      time: taskTime,
      completed: false,
    };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    document.getElementById('task-name').value = '';
    document.getElementById('task-time').value = '';
  }
});

// Display Tasks
function displayTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskCard = `
      <div class="task-card">
        <h2 class="task-title">${task.name}</h2>
        <p>Study time: ${task.time}</p>
        <div class="progress-bar">
          <div class="completed" style="width: ${task.completed ? 100 : 0}%"></div>
        </div>
        <div class="task-actions">
          <button onclick="markCompleted(${index})" class="btn-completed">${task.completed ? 'Completed' : 'Mark as Completed'}</button>
        </div>
      </div>
    `;
    taskList.innerHTML += taskCard;
  });
}

// Mark Task as Completed
function markCompleted(index) {
  tasks[index].completed = true;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasks();
}

// Initial task display
displayTasks();