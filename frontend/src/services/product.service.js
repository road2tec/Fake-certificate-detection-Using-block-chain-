import api from './api'

export const productService = {
    // Register a new product
    registerProduct: (productData) => api.post('/product/register', productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get manufacturer's products
    getMyProducts: (page = 1, perPage = 10) =>
        api.get('/product/my-products', { params: { page, per_page: perPage } }),

    // Get product details
    getProduct: (id) => api.get(`/product/${id}`),

    // Verify a product
    verifyProduct: (productHash) => api.post('/verify/product', { product_hash: productHash }),

    // Verify by hash (GET)
    verifyByHash: (hash) => api.get(`/verify/by-hash/${hash}`),

    // Get verification history
    getVerificationHistory: (page = 1, perPage = 10) =>
        api.get('/verify/history', { params: { page, per_page: perPage } }),
}

export default productService
