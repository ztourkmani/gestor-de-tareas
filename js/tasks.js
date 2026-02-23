
class Task {
    constructor(id, title, description, completed = false, createdAt = new Date()) {
        this.id = id;
        this.title = title;
        this.description = description;
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
            new Task(t.id, t.title, t.description, t.completed, new Date(t.createdAt))
        );
    },

    addTask(title, description) {
        const newTask = new Task(
            Date.now().toString(),
            title,
            description,
            false,
            new Date()
        );
        this.tasks.push(newTask);
        return newTask;
    },

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    },

    toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.toggleStatus();
        }
    },

    reopenTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task && task.completed) {
            task.completed = false;
        }
    },

    getPendingCount() {
        return this.tasks.filter(t => !t.completed).length;
    },

    getAllTasks() {
        return [...this.tasks].sort((a, b) => {
            if (a.completed === b.completed) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.completed ? 1 : -1;
        });
    }
};