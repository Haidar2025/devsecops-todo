// API Base URL - use 127.0.0.1 for consistency across environments
const API_URL = 'http://127.0.0.1:5000/api/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const formTitle = document.getElementById('form-title');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tasksList = document.getElementById('tasks-list');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// State
let isEditing = false;
let currentEditId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    
    taskForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }
        
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        showError('Kunde inte ladda uppgifter: ' + error.message);
        tasksList.innerHTML = '<p class="loading">Kunde inte ladda uppgifter</p>';
    }
}

// Display tasks
function displayTasks(tasks) {
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="loading">Inga uppgifter än. Skapa din första uppgift!</p>';
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <div class="task-badges">
                    <span class="badge badge-status ${task.status}">${task.status}</span>
                    <span class="badge badge-priority ${task.priority}">${task.priority}</span>
                </div>
            </div>
            
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            
            <div class="task-footer">
                <span class="task-date">
                    ${task.dueDate ? '📅 ' + formatDate(task.dueDate) : 'Ingen deadline'}
                </span>
                <div class="task-actions">
                    <button class="btn btn-edit" onclick="editTask(${task.id})">Redigera</button>
                    <button class="btn btn-delete" onclick="deleteTask(${task.id})">Ta bort</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle form submit
async function handleSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        status: statusInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value
    };
    
    try {
        let response;
        
        if (isEditing) {
            // Update existing task
            response = await fetch(`${API_URL}/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
        } else {
            // Create new task
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Request failed');
        }
        
        showSuccess(isEditing ? 'Uppgift uppdaterad!' : 'Uppgift skapad!');
        resetForm();
        loadTasks();
    } catch (error) {
        showError('Fel: ' + error.message);
    }
}

// Edit task
async function editTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to load task');
        }
        
        const task = await response.json();
        
        // Populate form
        isEditing = true;
        currentEditId = id;
        formTitle.textContent = 'Redigera uppgift';
        taskIdInput.value = id;
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        statusInput.value = task.status;
        priorityInput.value = task.priority;
        dueDateInput.value = task.dueDate;
        submitBtn.textContent = 'Uppdatera uppgift';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showError('Kunde inte ladda uppgift: ' + error.message);
    }
}

// Delete task
async function deleteTask(id) {
    // Confirmation dialog
    if (!confirm('Är du säker på att du vill ta bort denna uppgift?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        showSuccess('Uppgift borttagen!');
        loadTasks();
    } catch (error) {
        showError('Kunde inte ta bort uppgift: ' + error.message);
    }
}

// Reset form
function resetForm() {
    isEditing = false;
    currentEditId = null;
    formTitle.textContent = 'Skapa ny uppgift';
    taskForm.reset();
    taskIdInput.value = '';
    submitBtn.textContent = 'Skapa uppgift';
    cancelBtn.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');
}
