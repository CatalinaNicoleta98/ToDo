import './style.css';

interface Task {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  priority: string; // priority: low, medium, high
}

class ToDoApp {
  private tasks: Task[] = [];
  private taskId: number = 0;
  private filter: string = 'all';
  private searchTerm: string = '';
  private darkMode: boolean = false; // toggle for dark mode

  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.loadTasksFromStorage();
      this.bindEvents();
      this.render();
    });
  }

  private bindEvents() {
    const form = document.getElementById('todo-form') as HTMLFormElement | null;
    const filterSelect = document.getElementById('task-filter') as HTMLSelectElement | null;
    const searchInput = document.getElementById('task-search') as HTMLInputElement | null;
    const clearCompletedBtn = document.getElementById('clear-completed') as HTMLButtonElement | null;
    const toggleAllBtn = document.getElementById('toggle-all') as HTMLButtonElement | null;
    const darkModeBtn = document.getElementById('dark-mode-toggle') as HTMLButtonElement | null;

    if (form) form.addEventListener('submit', this.addTask.bind(this));
    if (filterSelect) filterSelect.addEventListener('change', this.applyFilter.bind(this));
    if (searchInput) searchInput.addEventListener('input', this.applySearch.bind(this));
    if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', this.clearCompletedTasks.bind(this));
    if (toggleAllBtn) toggleAllBtn.addEventListener('click', this.toggleAllTasks.bind(this));
    if (darkModeBtn) darkModeBtn.addEventListener('click', this.toggleDarkMode.bind(this));
  }

  private addTask(event: Event) {
    event.preventDefault();

    const taskInput = document.getElementById('task-input') as HTMLInputElement | null;
    const startDateInput = document.getElementById('start-date') as HTMLInputElement | null;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement | null;
    const prioritySelect = document.getElementById('task-priority') as HTMLSelectElement | null;

    if (taskInput && startDateInput && endDateInput && prioritySelect) {
      // Validate date input - end date must be after start date
      if (new Date(startDateInput.value) > new Date(endDateInput.value)) {
        alert('End date must be after start date!');
        return;
      }

      // Create the new task with priority level
      const newTask: Task = {
        id: this.taskId++,
        name: taskInput.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        completed: false,
        priority: prioritySelect.value, // Capture priority selection
      };

      this.tasks.push(newTask);
      this.saveTasksToStorage();
      this.render();

      // Clear inputs after adding
      taskInput.value = '';
      startDateInput.value = '';
      endDateInput.value = '';
      prioritySelect.value = 'low';
    }
  }

  // Remove a task from the list
  private removeTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasksToStorage();
    this.render();
  }

  // Edit a task by reloading the inputs with its info
  private editTask(id: number) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      const taskInput = document.getElementById('task-input') as HTMLInputElement | null;
      const startDateInput = document.getElementById('start-date') as HTMLInputElement | null;
      const endDateInput = document.getElementById('end-date') as HTMLInputElement | null;
      const prioritySelect = document.getElementById('task-priority') as HTMLSelectElement | null;

      if (taskInput && startDateInput && endDateInput && prioritySelect) {
        taskInput.value = task.name;
        startDateInput.value = task.startDate;
        endDateInput.value = task.endDate;
        prioritySelect.value = task.priority;

        this.removeTask(id);
      }
    }
  }

  private toggleCompletion(id: number) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasksToStorage();
      this.render();
    }
  }

  private clearCompletedTasks() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasksToStorage();
    this.render();
  }

  private toggleAllTasks() {
    const allCompleted = this.tasks.every(task => task.completed);
    this.tasks.forEach(task => (task.completed = !allCompleted));
    this.saveTasksToStorage();
    this.render();
  }

  private applyFilter(event: Event) {
    const filterSelect = event.target as HTMLSelectElement;
    this.filter = filterSelect.value;
    this.render();
  }

  private applySearch(event: Event) {
    const searchInput = event.target as HTMLInputElement;
    this.searchTerm = searchInput.value.toLowerCase();
    this.render();
  }

  private toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  // Save tasks to local storage
  private saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Load tasks from local storage
  private loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      this.taskId = this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) + 1 : 0;
    }
  }

  // Render tasks to the DOM
  private render() {
    const todoList = document.getElementById('todo-list') as HTMLUListElement | null;
   

    if (todoList) {
      todoList.innerHTML = '';

      this.tasks
        .filter(task => {
          if (this.filter === 'completed') return task.completed;
          if (this.filter === 'incomplete') return !task.completed;
          return true;
        })
        .filter(task => task.name.toLowerCase().includes(this.searchTerm))
        .forEach(task => {
          const taskElement = document.createElement('li');
          taskElement.classList.add('task');
          if (task.completed) taskElement.classList.add('completed');

          // Highlight overdue tasks
          if (new Date(task.endDate) < new Date() && !task.completed) {
            taskElement.classList.add('overdue');
          }

          taskElement.innerHTML = `
            <span>${task.name} (Start: ${task.startDate}, End: ${task.endDate}, Priority: ${task.priority})</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="toggle-complete">${task.completed ? 'Undo' : 'Complete'}</button>
          `;

          taskElement.querySelector('.edit')?.addEventListener('click', () => this.editTask(task.id));
          taskElement.querySelector('.delete')?.addEventListener('click', () => this.removeTask(task.id));
          taskElement.querySelector('.toggle-complete')?.addEventListener('click', () => this.toggleCompletion(task.id));

          todoList.appendChild(taskElement);
        });

     
    }
  }
}

const app = new ToDoApp();