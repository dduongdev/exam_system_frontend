import adminApi from './adminApi';

export const adminAuthService = {
    // Login
    async login(username, password) {
        const response = await adminApi.post('/auth/login', { username, password });
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

    // Change password
    async changePassword(oldPassword, newPassword) {
        const response = await adminApi.post('/auth/change-password', {
            oldPassword,
            newPassword
        });
        return response.data;
    }
};
