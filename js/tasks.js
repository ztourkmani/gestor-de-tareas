class Task {
    constructor(id, title, description, category = 'personal', completed = false, createdAt = new Date()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.completed = completed;
        this.createdAt = createdAt;
    }
    
    toggleStatus() {
        this.completed = !this.completed;
    }
}

const TaskManager = {
    tasks: [],
    
    init(initialTasks) {
        this.tasks = initialTasks.map(t => 
            new Task(t.id, t.title, t.description, t.category, t.completed, new Date(t.createdAt))
        );
    },
    
    async addTask(title, description, category) {
        const newTask = {
            title,
            description,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        try {
            const savedTask = await Storage.addTask(newTask);
            
            const task = new Task(
                savedTask.id,
                savedTask.title,
                savedTask.description,
                savedTask.category,
                savedTask.completed,
                new Date(savedTask.createdAt)
            );
            
            this.tasks.push(task);
            return task;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    },
    
    async updateTask(id, updates) {
        try {
            // Obtener la tarea actual
            const currentTask = this.tasks.find(t => t.id === id);
            if (!currentTask) throw new Error('Tarea no encontrada');
            
            // Preparar los datos actualizados
            const updatedTaskData = {
                id: currentTask.id,
                title: updates.title || currentTask.title,
                description: updates.description !== undefined ? updates.description : currentTask.description,
                category: updates.category || currentTask.category,
                completed: updates.completed !== undefined ? updates.completed : currentTask.completed,
                createdAt: currentTask.createdAt.toISOString()
            };
            
            // Guardar en json-server
            const savedTask = await Storage.updateTask(id, updatedTaskData);
            
            // Actualizar en el array local
            const index = this.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                this.tasks[index] = new Task(
                    savedTask.id,
                    savedTask.title,
                    savedTask.description,
                    savedTask.category,
                    savedTask.completed,
                    new Date(savedTask.createdAt)
                );
            }
            
            return true;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },
    
    async deleteTask(id) {
        try {
            await Storage.deleteTask(id);
            this.tasks = this.tasks.filter(t => t.id !== id);
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },
    
    async toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return false;
        
        const newStatus = !task.completed;
        
        try {
            const updatedTaskData = {
                id: task.id,
                title: task.title,
                description: task.description,
                category: task.category,
                completed: newStatus,
                createdAt: task.createdAt.toISOString()
            };
            
            await Storage.updateTask(id, updatedTaskData);
            task.completed = newStatus;
            return true;
        } catch (error) {
            console.error('Error toggling task status:', error);
            throw error;
        }
    },
    
    getTask(id) {
        return this.tasks.find(t => t.id === id);
    },
    
    getStats() {
        return {
            total: this.tasks.length,
            pending: this.tasks.filter(t => !t.completed).length,
            completed: this.tasks.filter(t => t.completed).length
        };
    },
    
    getTasks(filter = 'all', sort = 'newest') {
        let filtered = [...this.tasks];
        
        if (filter === 'pending') {
            filtered = filtered.filter(t => !t.completed);
        } else if (filter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }
        
        switch(sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'az':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        
        return filtered;
    },
    
    searchTasks(query) {
        if (!query) return this.tasks;
        
        const lowercaseQuery = query.toLowerCase();
        return this.tasks.filter(t => 
            t.title.toLowerCase().includes(lowercaseQuery) ||
            (t.description && t.description.toLowerCase().includes(lowercaseQuery))
        );
    }
};