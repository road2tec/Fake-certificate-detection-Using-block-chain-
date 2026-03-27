import api from './api'

export const certificateService = {
    // Issue a new certificate
    issueCertificate: (certificateData) => api.post('/certificate/issue', certificateData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get institution's certificates
    getMyCertificates: (page = 1, perPage = 10) =>
        api.get('/certificate/my-certificates', { params: { page, per_page: perPage } }),

    // Get certificate details
    getCertificate: (id) => api.get(`/certificate/${id}`),

    // Verify a certificate
    verifyCertificate: (certificateHash) => api.post('/verify/certificate', { certificate_hash: certificateHash }),

    // Verify by hash (GET)
    verifyByHash: (hash) => api.get(`/verify/by-hash/${hash}`),

    // Get verification history
    getVerificationHistory: (page = 1, perPage = 10) =>
        api.get('/verify/history', { params: { page, per_page: perPage } }),
}

export default certificateService
