import adminApi from './adminApi';

export const adminAuthService = {
    // Login với identifier (username/email/phone)
    async login(identifier, password) {
        const response = await adminApi.post('/auth/login', { identifier, password });
        const { access_token, user } = response.data;

        // Store token and user info
        localStorage.setItem('admin_token', access_token);
        localStorage.setItem('admin_user', JSON.stringify(user));

        return { token: access_token, user };
    },

    // Logout
    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('admin_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Update current user in localStorage
    updateCurrentUser(user) {
        localStorage.setItem('admin_user', JSON.stringify(user));
    },

    // Get token
    getToken() {
        return localStorage.getItem('admin_token');
    },

    // Check if authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Get profile from server
    async getProfile() {
        const response = await adminApi.get('/auth/profile');
        return response.data;
    },

    // Change password (requires old password)
    async changePassword(oldPassword, newPassword) {
        const response = await adminApi.post('/auth/change-password', {
            oldPassword,
            newPassword
        });
        return response.data;
    },

    // Force change password (first login, no old password required)
    async forceChangePassword(newPassword) {
        const response = await adminApi.post('/auth/force-change-password', {
            newPassword
        });
        return response.data;
    }
};
