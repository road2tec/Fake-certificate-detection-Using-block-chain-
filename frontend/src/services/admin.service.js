import api from './api'

export const adminService = {
    // Dashboard stats
    getStats: () => api.get('/admin/stats'),

    // Manufacturers
    getManufacturers: (status = null, page = 1, perPage = 10) => {
        const params = { page, per_page: perPage }
        if (status) params.status = status
        return api.get('/admin/manufacturers', { params })
    },

    approveManufacturer: (id) => api.put(`/admin/approve/${id}`),

    rejectManufacturer: (id, reason = null) => {
        const params = reason ? { reason } : {}
        return api.put(`/admin/reject/${id}`, null, { params })
    },

    // Products
    getProducts: (page = 1, perPage = 10) =>
        api.get('/admin/products', { params: { page, per_page: perPage } }),

    // Verifications
    getVerifications: (result = null, page = 1, perPage = 10) => {
        const params = { page, per_page: perPage }
        if (result) params.result = result
        return api.get('/admin/verifications', { params })
    },

    // Notifications
    getNotifications: (page = 1, perPage = 20) =>
        api.get('/admin/notifications', { params: { page, per_page: perPage } }),

    // Activity logs
    getActivityLogs: (page = 1, perPage = 20) =>
        api.get('/admin/activity-logs', { params: { page, per_page: perPage } }),
}

export default adminService
