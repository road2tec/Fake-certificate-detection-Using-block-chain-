import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import ProductCard from '../components/ProductCard'
import productService from '../services/product.service'
import toast from 'react-hot-toast'
import {
    CubeIcon,
    QrCodeIcon,
    PlusIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'

// Layout
const ManufacturerLayout = () => {
    return (
        <div className="min-h-screen bg-[#061e16]">
            <Sidebar role="manufacturer" />
            <main className="ml-64 p-8">
                <Outlet />
            </main>
        </div>
    )
}

// Dashboard Overview
const ManufacturerOverview = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getMyProducts(1, 5)
                setProducts(response.data.items)
            } catch (error) {
                toast.error('Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-8">Manufacturer Dashboard</h1>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Products"
                    value={products.length}
                    icon={CubeIcon}
                    color="emerald"
                />
                <StatsCard
                    title="QR Codes Generated"
                    value={products.length}
                    icon={QrCodeIcon}
                    color="violet"
                />
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/manufacturer/register')}
                    className="p-6 rounded-2xl cursor-pointer flex items-center justify-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                >
                    <PlusIcon className="w-8 h-8" />
                    <span className="text-xl font-semibold">Register New Product</span>
                </motion.div>
            </div>

            {/* Recent Products */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Recent Products</h2>
                    <button
                        onClick={() => navigate('/manufacturer/products')}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                        View All →
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 text-center">
                        <CubeIcon className="w-16 h-16 mx-auto text-emerald-500/30 mb-4" />
                        <p className="text-gray-400 mb-4">No products registered yet</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate('/manufacturer/register')}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30"
                        >
                            Register Your First Product
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Register Product Page
const RegisterProductPage = () => {
    const [formData, setFormData] = useState({
        product_name: '',
        brand: '',
        description: '',
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const response = await productService.registerProduct(formData)
            setResult(response.data)
            toast.success('Product registered successfully!')
            setFormData({ product_name: '', brand: '', description: '' })
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to register product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-8">Register New Product</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className="w-full px-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Brand *
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Enter brand name"
                                className="w-full px-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                className="w-full px-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[120px]"
                                rows={4}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    <CubeIcon className="w-5 h-5" />
                                    Register Product
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Result Preview */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircleIcon className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Product Registered!
                            </h3>
                            <p className="text-emerald-400 mb-6">{result.product.product_name}</p>

                            {/* QR Code */}
                            <div className="bg-white rounded-xl p-4 mb-6 inline-block">
                                <img
                                    src={`http://localhost:8000${result.product.qr_code_path}`}
                                    alt="Product QR Code"
                                    className="w-48 h-48 mx-auto"
                                    onError={(e) => {
                                        e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + result.product.product_hash
                                    }}
                                />
                            </div>

                            {/* Product Hash */}
                            <div className="text-left space-y-3">
                                <div>
                                    <span className="text-sm text-gray-400">Product Hash:</span>
                                    <code className="block text-xs mt-1 p-2 bg-[#061e16] border border-emerald-500/20 rounded-lg break-all text-emerald-400">
                                        {result.product.product_hash}
                                    </code>
                                </div>

                                {result.product.blockchain_tx_hash && (
                                    <div>
                                        <span className="text-sm text-gray-400">Blockchain TX:</span>
                                        <code className="block text-xs mt-1 p-2 bg-[#061e16] border border-violet-500/20 rounded-lg break-all text-violet-400">
                                            {result.product.blockchain_tx_hash}
                                        </code>
                                    </div>
                                )}

                                <div className={`p-3 rounded-lg ${result.product.blockchain_registered
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    }`}>
                                    {result.product.blockchain_registered
                                        ? '✓ Registered on blockchain'
                                        : '⚠ Blockchain registration pending (Ganache may not be running)'
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

// My Products Page
const MyProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getMyProducts()
                setProducts(response.data.items)
            } catch (error) {
                toast.error('Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-8">My Products</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : products.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="p-12 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 text-center">
                    <CubeIcon className="w-16 h-16 mx-auto text-emerald-500/30 mb-4" />
                    <p className="text-gray-400">No products registered yet</p>
                </div>
            )}
        </motion.div>
    )
}

// Main Export
const ManufacturerDashboard = () => {
    return (
        <Routes>
            <Route element={<ManufacturerLayout />}>
                <Route index element={<ManufacturerOverview />} />
                <Route path="register" element={<RegisterProductPage />} />
                <Route path="products" element={<MyProductsPage />} />
            </Route>
        </Routes>
    )
}

export default ManufacturerDashboard
