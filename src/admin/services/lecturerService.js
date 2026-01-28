import adminApi from './adminApi';

export const lecturerService = {
    // Get all lecturers
    async getAll() {
        const response = await adminApi.get('/lecturers');
        return response.data;
    },

    // Get lecturer by ID
    async getById(id) {
        const response = await adminApi.get(`/lecturers/${id}`);
        return response.data;
    },

    // Create new lecturer
    async create(data) {
        const response = await adminApi.post('/lecturers', data);
        return response.data;
    },

    // Update lecturer
    async update(id, data) {
        const response = await adminApi.patch(`/lecturers/${id}`, data);
        return response.data;
    },

    // Delete lecturer
    async delete(id) {
        const response = await adminApi.delete(`/lecturers/${id}`);
        return response.data;
    },

    // Reset lecturer password
    async resetPassword(id) {
        const response = await adminApi.post(`/lecturers/${id}/reset-password`);
        return response.data;
    }
};
