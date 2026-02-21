/**
 * APP.JS - Controlador de la Interfaz
 * Maneja los eventos del DOM y coordina las acciones entre el usuario y TaskManager.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const pendingCountText = document.getElementById('pending-count');

    /**
     * Función principal para renderizar la lista de tareas
     */
    async function render() {
        try {
            // 1. Obtener tareas desde el servidor (json-server)
            const tasks = await TaskManager.fetchAll();

            // 2. Actualizar el contador de pendientes
            const pendingTasks = tasks.filter(t => !t.completed).length;
            pendingCountText.innerText = pendingTasks === 1 
                ? `Tienes 1 tarea pendiente` 
                : `Tienes ${pendingTasks} tareas pendientes`;

            // 3. Generar el HTML de la lista
            if (tasks.length === 0) {
                taskList.innerHTML = `
                    <div style="text-align:center; padding: 2rem; color: #94a3b8;">
                        <p>No hay tareas pendientes. ¡Disfruta tu día! ☕</p>
                    </div>
                `;
                return;
            }

            taskList.innerHTML = tasks.map(task => `
                <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-info">
                        <h3>${task.title}</h3>
                        <p>${task.description || 'Sin descripción'}</p>
                        <small>📅 ${task.date}</small>
                    </div>
                    <div class="actions">
                        <button class="status-btn" title="Cambiar estado">
                            ${task.completed ? 'Reabrir' : 'Hecho'}
                        </button>
                        <button class="delete-btn" title="Eliminar tarea">Borrar</button>
                    </div>
                </li>
            `).join('');

        } catch (error) {
            console.error("Error en el renderizado:", error);
            taskList.innerHTML = `
                <div style="background: #fee2e2; color: #ef4444; padding: 1rem; border-radius: 8px; text-align: center;">
                    <strong>⚠️ Error de conexión</strong>
                    <p>Asegúrate de que json-server esté corriendo en el puerto 3000.</p>
                </div>
            `;
        }
    }

    /**
     * Evento: Envío del formulario (Crear Tarea)
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const desc = taskDescInput.value.trim();

        if (title) {
            // Desactivar botón temporalmente para evitar doble clic
            const btn = document.getElementById('add-btn');
            btn.disabled = true;
            btn.innerText = 'Guardando...';

            await TaskManager.add(title, desc);
            
            // Limpiar y resetear
            form.reset();
            btn.disabled = false;
            btn.innerHTML = '<span>+</span> Guardar Tarea';
            
            render();
        }
    });

    /**
     * Evento: Clics en la lista (Eliminar y Completar)
     * Usamos delegación de eventos para mayor eficiencia.
     */
    taskList.addEventListener('click', async (e) => {
        const li = e.target.closest('.task-item');
        if (!li) return;
        
        const id = li.dataset.id;

        // Caso 1: Botón de borrar
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                await TaskManager.remove(id);
                render();
            }
        } 
        
        // Caso 2: Botón de estado (completar/reabrir)
        else if (e.target.classList.contains('status-btn')) {
            const isCompleted = li.classList.contains('completed');
            await TaskManager.toggle(id, isCompleted);
            render();
        }
    });

    // Carga inicial al abrir la página
    render();
});