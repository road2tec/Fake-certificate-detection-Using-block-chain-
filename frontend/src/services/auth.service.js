import api from './api'

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),

    register: (userData) => api.post('/auth/signup', userData),

    signup: (userData) => api.post('/auth/signup', userData),

    getProfile: () => api.get('/auth/me'),
}

export default authService
