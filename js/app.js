
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');
const pendingCountEl = document.getElementById('pending-count');


function formatDate(date) {
    const d = new Date(date);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (d.toDateString() === hoy.toDateString()) {
        return 'Hoy ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (d.toDateString() === ayer.toDateString()) {
        return 'Ayer ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}


function renderTasks() {
    const tasks = TaskManager.getAllTasks();
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <li class="task-item" style="justify-content: center; text-align: center; color: var(--text-muted);">
                No hay tareas pendientes. ¡Agrega una nueva!
            </li>
        `;
    } else {
        taskList.innerHTML = tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-info">
                    <h3>${escapeHTML(task.title)}</h3>
                    ${task.description ? `<p>${escapeHTML(task.description)}</p>` : ''}
                    <small>${task.completed ? '✓ Completada' : '⏳ Pendiente'}</small>
                </div>
                <div class="task-date">
                    <span>📅 ${formatDate(task.createdAt)}</span>
                </div>
                <div class="actions">
                    ${task.completed ? 
                        `<button class="reopen-btn" onclick="window.app.reopenTask('${task.id}')">Reabrir</button>` : 
                        `<button class="status-btn" onclick="window.app.completeTask('${task.id}')">Hecho</button>`
                    }
                    <button class="delete-btn" onclick="window.app.deleteTask('${task.id}')">Borrar</button>
                </div>
            </li>
        `).join('');
    }
    
    updatePendingCount();
}


function updatePendingCount() {
    const count = TaskManager.getPendingCount();
    pendingCountEl.textContent = count === 1 
        ? '📌 1 tarea pendiente' 
        : `📌 ${count} tareas pendientes`;
}


function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"]/g, function(match) {
        if (match === '&') return '&amp;';
        if (match === '<') return '&lt;';
        if (match === '>') return '&gt;';
        if (match === '"') return '&quot;';
        return match;
    });
}


function initApp() {
    
    const storedTasks = Storage.loadTasks();
    TaskManager.init(storedTasks);
    

    renderTasks();
    
    
    const saveAndRender = () => {
        Storage.saveTasks(TaskManager.tasks);
        renderTasks();
    };


    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = taskInput.value.trim();
        if (!title) return;
        
        const description = taskDesc.value.trim();
        
        TaskManager.addTask(title, description);
        saveAndRender();
        
        
        taskForm.reset();
        taskInput.focus();
    });

    
    window.app = {
        deleteTask: (id) => {
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                TaskManager.deleteTask(id);
                saveAndRender();
            }
        },
        completeTask: (id) => {
            TaskManager.toggleTaskStatus(id);
            saveAndRender();
        },
        reopenTask: (id) => {
            TaskManager.reopenTask(id);
            saveAndRender();
        }
    };
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);