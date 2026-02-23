// CAMBIA EL PUERTO SEGÚN CORRESPONDA (3000 o 3001)
const API_URL = 'http://localhost:3001/tasks';

const Storage = {
    async loadTasks() {
        try {
            console.log('Cargando tareas desde:', API_URL);
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error cargando tareas');
            const tasks = await response.json();
            console.log('Tareas cargadas:', tasks);
            
            return tasks.map(task => ({
                ...task,
                createdAt: new Date(task.createdAt)
            }));
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    },
    
    async addTask(task) {
        try {
            console.log('Agregando tarea:', task);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            
            if (!response.ok) throw new Error('Error agregando tarea');
            const result = await response.json();
            console.log('Tarea agregada:', result);
            return result;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    },
    
    async updateTask(id, updates) {
        try {
            console.log('Actualizando tarea:', id, updates);
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) throw new Error('Error actualizando tarea');
            const result = await response.json();
            console.log('Tarea actualizada:', result);
            return result;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },
    
    async deleteTask(id) {
        try {
            console.log('Eliminando tarea:', id);
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error eliminando tarea');
            console.log('Tarea eliminada:', id);
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },
    
    async clearTasks() {
        try {
            const tasks = await this.loadTasks();
            for (const task of tasks) {
                await this.deleteTask(task.id);
            }
            return true;
        } catch (error) {
            console.error('Error clearing tasks:', error);
            return false;
        }
    }
};