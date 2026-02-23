// DOM Elements - Verificar que existan antes de usarlos
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const totalCount = document.getElementById('total-count');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');

// Modal Elements - Verificar que existan
const editModal = document.getElementById('edit-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveEdit = document.getElementById('save-edit');
const editForm = document.getElementById('edit-form');
const editId = document.getElementById('edit-task-id');
const editTitle = document.getElementById('edit-title');
const editDesc = document.getElementById('edit-desc');
const editCategory = document.getElementById('edit-category');
const editStatus = document.getElementById('edit-status');

// State
let currentFilter = 'all';
let currentSort = 'newest';
let currentSearch = '';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando...');
    
    // Verificar que los elementos existen
    if (!taskForm) console.error('❌ taskForm no encontrado');
    if (!taskList) console.error('❌ taskList no encontrado');
    if (!searchInput) console.error('❌ searchInput no encontrado');
    if (!sortSelect) console.error('❌ sortSelect no encontrado');
    if (!editModal) console.error('❌ editModal no encontrado');
    
    await loadInitialData();
    setupEventListeners();
});

async function loadInitialData() {
    try {
        console.log('Cargando datos iniciales...');
        const tasks = await Storage.loadTasks();
        console.log('Tareas cargadas:', tasks);
        TaskManager.init(tasks);
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error loading initial data:', error);
        alert('Error cargando tareas. Asegúrate de que json-server esté corriendo en el puerto correcto.');
    }
}

function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Form submit - Verificar que existe
    if (taskForm) {
        taskForm.addEventListener('submit', handleAddTask);
        console.log('✓ Event listener agregado a taskForm');
    } else {
        console.error('❌ No se pudo agregar event listener a taskForm');
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        console.log('✓ Event listener agregado a searchInput');
    }
    
    // Filter buttons
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                console.log('Filtro cambiado a:', currentFilter);
                renderTasks();
            });
        });
        console.log('✓ Event listeners agregados a filterButtons');
    } else {
        console.error('❌ No se encontraron filterButtons');
    }
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            console.log('Orden cambiado a:', currentSort);
            renderTasks();
        });
        console.log('✓ Event listener agregado a sortSelect');
    }
    
    // Modal events - Verificar que existen
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFn);
        console.log('✓ Event listener agregado a closeModal');
    }
    
    if (cancelModal) {
        cancelModal.addEventListener('click', closeModalFn);
        console.log('✓ Event listener agregado a cancelModal');
    }
    
    if (saveEdit) {
        saveEdit.addEventListener('click', handleEditTask);
        console.log('✓ Event listener agregado a saveEdit');
    }
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModalFn();
        }
    });
}

async function handleAddTask(e) {
    e.preventDefault();
    console.log('handleAddTask llamado');
    
    const title = taskTitle.value.trim();
    if (!title) {
        alert('Por favor ingresa un título');
        return;
    }
    
    const description = taskDesc.value.trim();
    const category = taskCategory.value;
    
    try {
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            addBtn.disabled = true;
            addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        }
        
        console.log('Agregando tarea:', { title, description, category });
        await TaskManager.addTask(title, description, category);
        
        taskForm.reset();
        taskTitle.focus();
        
        renderTasks();
        updateStats();
        console.log('Tarea agregada correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar la tarea. Verifica que json-server esté corriendo.');
    } finally {
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            addBtn.disabled = false;
            addBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Tarea';
        }
    }
}

async function handleEditTask() {
    console.log('handleEditTask llamado');
    
    const id = editId.value;
    const title = editTitle.value.trim();
    
    if (!title) {
        alert('Por favor ingresa un título');
        return;
    }
    
    try {
        if (saveEdit) {
            saveEdit.disabled = true;
            saveEdit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        }
        
        console.log('Actualizando tarea:', id);
        await TaskManager.updateTask(id, {
            title: title,
            description: editDesc.value.trim(),
            category: editCategory.value,
            completed: editStatus.value === 'completed'
        });
        
        closeModalFn();
        renderTasks();
        updateStats();
        console.log('Tarea actualizada correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar la tarea');
    } finally {
        if (saveEdit) {
            saveEdit.disabled = false;
            saveEdit.innerHTML = 'Guardar Cambios';
        }
    }
}

function handleSearch() {
    currentSearch = searchInput.value;
    console.log('Búsqueda:', currentSearch);
    renderTasks();
}

function renderTasks() {
    console.log('renderTasks llamado');
    
    let tasks;
    
    if (currentSearch) {
        tasks = TaskManager.searchTasks(currentSearch);
        if (currentFilter !== 'all') {
            tasks = tasks.filter(t => 
                currentFilter === 'completed' ? t.completed : !t.completed
            );
        }
        tasks = sortTasks(tasks, currentSort);
    } else {
        tasks = TaskManager.getTasks(currentFilter, currentSort);
    }
    
    console.log('Tareas a renderizar:', tasks.length);
    
    if (!taskList) {
        console.error('❌ taskList no encontrado en renderTasks');
        return;
    }
    
    if (tasks.length === 0) {
        taskList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    taskList.innerHTML = tasks.map(task => `
        <tr>
            <td>
                <span class="status-badge ${task.completed ? 'status-completed' : 'status-pending'}">
                    ${task.completed ? 'Completada' : 'Pendiente'}
                </span>
            </td>
            <td>
                <strong>${escapeHTML(task.title)}</strong>
            </td>
            <td>
                <span class="category-badge">
                    ${getCategoryIcon(task.category)} ${getCategoryName(task.category)}
                </span>
            </td>
            <td>
                ${task.description ? escapeHTML(truncateText(task.description, 40)) : '-'}
            </td>
            <td>
                <small>${formatDate(task.createdAt)}</small>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editTask('${task.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    
                    ${task.completed ? 
                        `<button class="action-btn reopen" onclick="reopenTask('${task.id}')" title="Reabrir">
                            <i class="fas fa-redo-alt"></i>
                        </button>` :
                        `<button class="action-btn complete" onclick="completeTask('${task.id}')" title="Completar">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                    
                    <button class="action-btn delete" onclick="deleteTask('${task.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function sortTasks(tasks, sortBy) {
    const sorted = [...tasks];
    
    switch(sortBy) {
        case 'newest':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'az':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'za':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
    
    return sorted;
}

function updateStats() {
    console.log('updateStats llamado');
    
    if (!pendingCount || !completedCount || !totalCount) {
        console.error('❌ Elementos de estadísticas no encontrados');
        return;
    }
    
    const stats = TaskManager.getStats();
    pendingCount.textContent = stats.pending;
    completedCount.textContent = stats.completed;
    totalCount.textContent = stats.total;
}

function closeModalFn() {
    console.log('Cerrando modal');
    if (editModal) {
        editModal.classList.remove('show');
    }
    if (editForm) {
        editForm.reset();
    }
}

// Global functions for onclick handlers
window.editTask = (id) => {
    console.log('editTask llamado con id:', id);
    
    if (!editModal || !editId || !editTitle || !editDesc || !editCategory || !editStatus) {
        console.error('❌ Elementos del modal no encontrados');
        return;
    }
    
    const task = TaskManager.getTask(id);
    if (!task) {
        console.error('❌ Tarea no encontrada:', id);
        return;
    }
    
    console.log('Editando tarea:', task);
    
    editId.value = task.id;
    editTitle.value = task.title;
    editDesc.value = task.description || '';
    editCategory.value = task.category || 'personal';
    editStatus.value = task.completed ? 'completed' : 'pending';
    
    editModal.classList.add('show');
};

window.completeTask = async (id) => {
    console.log('completeTask llamado con id:', id);
    
    try {
        await TaskManager.toggleTaskStatus(id);
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al completar la tarea');
    }
};

window.reopenTask = async (id) => {
    console.log('reopenTask llamado con id:', id);
    
    try {
        const task = TaskManager.tasks.find(t => t.id === id);
        if (task && task.completed) {
            await TaskManager.toggleTaskStatus(id);
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al reabrir la tarea');
    }
};

window.deleteTask = async (id) => {
    console.log('deleteTask llamado con id:', id);
    
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
        await TaskManager.deleteTask(id);
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la tarea');
    }
};

// Helper functions
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

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 86400000 && d.getDate() === now.getDate()) {
        return 'Hoy ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    else if (diff < 172800000 && d.getDate() === now.getDate() - 1) {
        return 'Ayer ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    else if (diff < 604800000) {
        return d.toLocaleDateString('es-ES', { weekday: 'long' });
    }
    else {
        return d.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

function getCategoryIcon(category) {
    const icons = {
        trabajo: '💼',
        personal: '🏠',
        estudio: '📚',
        salud: '❤️'
    };
    return icons[category] || '📌';
}

function getCategoryName(category) {
    const names = {
        trabajo: 'Trabajo',
        personal: 'Personal',
        estudio: 'Estudio',
        salud: 'Salud'
    };
    return names[category] || 'General';
}