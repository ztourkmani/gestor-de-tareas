
const Storage = {
    
    STORAGE_KEY: 'task_manager_tasks',

    
    saveTasks(tasks) {
        try {
            const tasksToSave = tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                createdAt: task.createdAt
            }));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasksToSave));
            return true;
        } catch (error) {
            console.error('Error guardando tareas:', error);
            return false;
        }
    },

    
    loadTasks() {
        try {
            const storedTasks = localStorage.getItem(this.STORAGE_KEY);
            if (!storedTasks) {
                
                return [];
            }
            
            const parsedTasks = JSON.parse(storedTasks);
            
            
            return parsedTasks.map(task => ({
                ...task,
                createdAt: new Date(task.createdAt)
            }));
        } catch (error) {
            console.error('Error cargando tareas:', error);
            return [];
        }
    },

    
    clearTasks() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    
    hasTasks() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
};