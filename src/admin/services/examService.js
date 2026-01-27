import adminApi from './adminApi';

export const examMatrixService = {
    // Get all exam matrices
    async getAll() {
        const response = await adminApi.get('/exam-matrices');
        return response.data;
    },

    // Get one exam matrix
    async getOne(id) {
        const response = await adminApi.get(`/exam-matrices/${id}`);
        return response.data;
    },

    // Create exam matrix
    async create(data) {
        const response = await adminApi.post('/exam-matrices', data);
        return response.data;
    },

    // Update exam matrix
    async update(id, data) {
        const response = await adminApi.patch(`/exam-matrices/${id}`, data);
        return response.data;
    },

    // Delete exam matrix
    async delete(id) {
        await adminApi.delete(`/exam-matrices/${id}`);
    }
};

export const examSessionService = {
    // Get all exam sessions
    async getAll() {
        const response = await adminApi.get('/exam-sessions');
        return response.data;
    },

    // Get one exam session
    async getOne(id) {
        const response = await adminApi.get(`/exam-sessions/${id}`);
        return response.data;
    },

    // Create exam session
    async create(data) {
        const response = await adminApi.post('/exam-sessions', data);
        return response.data;
    },

    // Update exam session
    async update(id, data) {
        const response = await adminApi.patch(`/exam-sessions/${id}`, data);
        return response.data;
    },

    // Delete exam session
    async delete(id) {
        await adminApi.delete(`/exam-sessions/${id}`);
    },

    // Import students from Excel
    async importStudents(sessionId, file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await adminApi.post(
            `/exam-sessions/${sessionId}/import-students`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Get students in a session
    async getStudents(sessionId) {
        const response = await adminApi.get(`/exam-sessions/${sessionId}/students`);
        return response.data;
    },

    // Export access codes
    async exportAccessCodes(sessionId) {
        const response = await adminApi.get(
            `/exam-sessions/${sessionId}/export-access-codes`,
            { responseType: 'blob' }
        );
        return response.data;
    }
};
