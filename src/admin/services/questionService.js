import adminApi from './adminApi';

export const questionService = {
    // Get questions by pool
    async getByPool(poolId, { questionType = null, cognitiveLevel = null, page = 1, limit = 10 } = {}) {
        const params = { poolId, page, limit };
        if (questionType) params.questionType = questionType;
        if (cognitiveLevel) params.cognitiveLevel = cognitiveLevel;

        const response = await adminApi.get('/questions', { params });
        return response.data;
    },

    // Get one question
    async getOne(id) {
        const response = await adminApi.get(`/questions/${id}`);
        return response.data;
    },

    // Create question
    async create(data) {
        const response = await adminApi.post('/questions', data);
        return response.data;
    },

    // Update question
    async update(id, data) {
        const response = await adminApi.patch(`/questions/${id}`, data);
        return response.data;
    },

    // Delete question
    async delete(id) {
        await adminApi.delete(`/questions/${id}`);
    }
};
