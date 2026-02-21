const API_URL = 'http://localhost:3000/tasks';

const StorageManager = {
    async getAll() {
        const res = await fetch(API_URL);
        return await res.json();
    },

    async create(task) {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        return await res.json();
    },

    async delete(id) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    },

    async update(id, data) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
};