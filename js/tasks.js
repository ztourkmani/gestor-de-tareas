const TaskManager = {
    async fetchAll() {
        return await StorageManager.getAll();
    },

    async add(title, description) {
        const newTask = {
            title,
            description,
            date: new Date().toLocaleString(),
            completed: false
        };
        return await StorageManager.create(newTask);
    },

    async remove(id) {
        await StorageManager.delete(id);
    },

    async toggle(id, currentStatus) {
        await StorageManager.update(id, { completed: !currentStatus });
    }
};