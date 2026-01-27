// localStorage helper functions

const STORAGE_KEYS = {
    STUDENT_EXAM: 'exam_student_exam',
    ANSWERS: 'exam_answers',
    TIME_REMAINING: 'exam_time_remaining',
    CURRENT_QUESTION: 'exam_current_question'
};

export const storage = {
    // Save student exam data
    saveStudentExam(data) {
        try {
            localStorage.setItem(STORAGE_KEYS.STUDENT_EXAM, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save student exam:', error);
        }
    },

    // Get student exam data
    getStudentExam() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.STUDENT_EXAM);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to get student exam:', error);
            return null;
        }
    },

    // Save answers
    saveAnswers(answers) {
        try {
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
        } catch (error) {
            console.error('Failed to save answers:', error);
        }
    },

    // Get answers
    getAnswers() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.ANSWERS);
            return data ? JSON.parse(data) : { mcq_answers: [], group_answers: [] };
        } catch (error) {
            console.error('Failed to get answers:', error);
            return { mcq_answers: [], group_answers: [] };
        }
    },

    // Save time remaining
    saveTimeRemaining(seconds) {
        try {
            localStorage.setItem(STORAGE_KEYS.TIME_REMAINING, seconds.toString());
        } catch (error) {
            console.error('Failed to save time:', error);
        }
    },

    // Get time remaining
    getTimeRemaining() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TIME_REMAINING);
            return data ? parseInt(data, 10) : null;
        } catch (error) {
            console.error('Failed to get time:', error);
            return null;
        }
    },

    // Save current question index
    saveCurrentQuestion(index) {
        try {
            localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, index.toString());
        } catch (error) {
            console.error('Failed to save current question:', error);
        }
    },

    // Get current question index
    getCurrentQuestion() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION);
            return data ? parseInt(data, 10) : 0;
        } catch (error) {
            console.error('Failed to get current question:', error);
            return 0;
        }
    },

    // Clear all exam data
    clearExamData() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Failed to clear exam data:', error);
        }
    }
};

export default storage;
