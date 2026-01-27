import adminApi from './adminApi';

export const reportService = {
    // Download score sheet for a session
    async downloadScoreSheet(sessionId) {
        const response = await adminApi.get(`/reports/sessions/${sessionId}/score-sheet`, {
            responseType: 'blob'
        });

        // Try to get filename from header
        let filename = `score-sheet-${sessionId}.xlsx`;
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('filename="') !== -1) {
            const matches = /filename="([^"]*)"/.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1];
            }
        }

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    // Download audit log for a session
    async downloadAuditLog(sessionId) {
        const response = await adminApi.get(`/reports/sessions/${sessionId}/audit-log`, {
            responseType: 'blob'
        });

        // Try to get filename from header
        let filename = `audit-log-${sessionId}.xlsx`;
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('filename="') !== -1) {
            const matches = /filename="([^"]*)"/.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1];
            }
        }

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    // Get individual student exam detail
    async getStudentExamDetail(studentExamId) {
        const response = await adminApi.get(`/reports/student-exams/${studentExamId}/detail`);
        return response.data;
    },

    // Download individual student exam detail
    async downloadStudentExamDetail(studentExamId) {
        const response = await adminApi.get(`/reports/student-exams/${studentExamId}/download`, {
            responseType: 'blob'
        });

        let filename = `student-exam-${studentExamId}.xlsx`;
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('filename="') !== -1) {
            const matches = /filename="([^"]*)"/.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1];
            }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
