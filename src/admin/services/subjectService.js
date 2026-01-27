import adminApi from './adminApi';

export const subjectService = {
    // Get all subjects
    async getAll() {
        const response = await adminApi.get('/subjects');
        return response.data;
    },

    // Get one subject
    async getOne(id) {
        const response = await adminApi.get(`/subjects/${id}`);
        return response.data;
    },

    // Create subject
    async create(data) {
        const response = await adminApi.post('/subjects', data);
        return response.data;
    },

    // Update subject
    async update(id, data) {
        const response = await adminApi.patch(`/subjects/${id}`, data);
        return response.data;
    },

    // Delete subject
    async delete(id) {
        await adminApi.delete(`/subjects/${id}`);
    }
};
