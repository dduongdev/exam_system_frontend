import adminApi from './adminApi';

export const questionPoolService = {
    // Get all question pools
    async getAll(subjectId = null) {
        const params = subjectId ? { subjectId } : {};
        const response = await adminApi.get('/question-pools', { params });
        return response.data;
    },

    // Get one question pool
    async getOne(id) {
        const response = await adminApi.get(`/question-pools/${id}`);
        return response.data;
    },

    // Create question pool
    async create(data) {
        const response = await adminApi.post('/question-pools', data);
        return response.data;
    },

    // Update question pool
    async update(id, data) {
        const response = await adminApi.patch(`/question-pools/${id}`, data);
        return response.data;
    },

    // Delete question pool
    async delete(id) {
        await adminApi.delete(`/question-pools/${id}`);
    },

    // Import questions from excel
    async importQuestions(id, file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await adminApi.post(`/question-pools/${id}/import-questions`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
