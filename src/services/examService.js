import api from './api';

// API service for exam-related operations
const examService = {
    /**
     * Login with access code
     * @param {string} accessCode - Student's access code
     * @returns {Promise} Student exam data
     */
    async login(accessCode) {
        const response = await api.post('/student-exams/login', { accessCode });
        return response;
    },

    /**
     * Start exam and get exam snapshot
     * @param {string} studentExamId - Student exam ID
     * @returns {Promise} Exam snapshot with questions
     */
    async startExam(studentExamId) {
        const response = await api.post(`/student-exams/${studentExamId}/start`);
        return response;
    },

    /**
     * Submit exam with answers
     * @param {string} studentExamId - Student exam ID
     * @param {object} answers - Student answers
     * @returns {Promise} Submit result with score
     */
    async submitExam(studentExamId, answers) {
        const response = await api.post(`/student-exams/${studentExamId}/submit`, answers);
        return response;
    }
};

export default examService;
