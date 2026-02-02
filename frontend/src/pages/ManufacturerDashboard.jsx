import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import ProductCard from '../components/ProductCard'
import ProductDetails from './ProductDetails'
import productService from '../services/product.service'
import toast from 'react-hot-toast'
import {
    CubeIcon,
    QrCodeIcon,
    PlusIcon,
    ShieldCheckIcon,
    CheckBadgeIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

import { NoisyBackground, GradientBlur } from '../components/Decorations'

// Layout
const ManufacturerLayout = () => {
    return (
        <div className="min-h-screen bg-primary-dark relative overflow-hidden font-sans">
            <NoisyBackground />
            <GradientBlur color="indigo-500" position="top-left" />
            <GradientBlur color="accent-pink" position="bottom-right" />
            <Sidebar role="manufacturer" />
            <main className="ml-64 p-10 lg:p-16 relative z-10">
                <Outlet />
            </main>
        </div>
    )
}

import { useAuth } from '../context/AuthContext'

// Dashboard Overview
const ManufacturerOverview = () => {
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getMyProducts(1, 4)
                setProducts(response.data.items)
                setTotalProducts(response.data.total)
            } catch (error) {
                console.error('Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight leading-none">Production <span className="text-accent-pink font-black">Control</span></h1>
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user?.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            {user?.status || 'Pending Verification'}
                        </span>
                    </div>
                    <p className="text-gray-500 font-medium italic">Register and monitor product batches on the ledger.</p>
                </div>
                <button
                    onClick={() => navigate('/manufacturer/register')}
                    className="btn-primary flex items-center gap-3"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Batch
                </button>
            </div>

            {user?.status !== 'approved' && (
                <div className="mb-12 p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <ShieldCheckIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Account Verification <span className="text-amber-500">Pending</span></h3>
                            <p className="text-gray-500 text-sm font-medium">Your node is currently in the audit queue. Production features are in read-only mode until authorized.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <StatsCard
                    title="Active SKUs"
                    value={totalProducts}
                    icon={CubeIcon}
                />
                <StatsCard
                    title="Ledger Entries"
                    value={totalProducts}
                    icon={QrCodeIcon}
                />
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                    <div className="text-accent-pink font-bold text-xs flex items-center gap-2 mb-2 uppercase tracking-widest">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${user?.status === 'approved' ? 'bg-accent-pink' : 'bg-gray-700'}`}></span>
                        Status: {user?.status === 'approved' ? 'SYNCED' : 'RESTRICTED'}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{user?.status === 'approved' ? 'Blockchain synchronization active' : 'Awaiting network authorization'}</p>
                </div>
            </div>

            {/* Recent Products */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Recent Batch Registrations</h2>
                    <button
                        onClick={() => navigate('/manufacturer/products')}
                        className="text-accent-pink hover:text-white font-bold text-sm transition-colors"
                    >
                        Batch History →
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="p-20 rounded-[3rem] bg-white/[0.03] border border-white/5 text-center">
                        <CubeIcon className="w-16 h-16 mx-auto text-gray-700 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">No Batch Data</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Initialize your first secure product entry to begin.</p>
                        <button
                            onClick={() => navigate('/manufacturer/register')}
                            className="btn-primary"
                        >
                            Start Registration
                        </button>
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
        batch_number: '',
        expiry_date: '',
        description: '',
        image: null
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('product_name', formData.product_name);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('batch_number', formData.batch_number);
            formDataToSend.append('expiry_date', formData.expiry_date);
            formDataToSend.append('description', formData.description || '');

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await productService.registerProduct(formDataToSend)
            setResult(response.data)
            toast.success('Registration Written to Blockchain')
            setFormData({ product_name: '', brand: '', batch_number: '', expiry_date: '', description: '', image: null })

            // Reset file input
            const fileInput = document.getElementById('product-image-upload');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error(error)
            let errorMessage = 'Ledger write failed';

            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    // Handle Pydantic validation errors (array of objects)
                    errorMessage = detail.map(err => `${err.loc[1]}: ${err.msg}`).join(', ');
                } else if (typeof detail === 'string') {
                    errorMessage = detail;
                } else if (typeof detail === 'object') {
                    errorMessage = JSON.stringify(detail);
                }
            }

            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Add <span className="text-accent-pink">New Product</span></h1>

            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Product Name</label>
                                <input
                                    type="text"
                                    name="product_name"
                                    value={formData.product_name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all font-medium text-sm"
                                    placeholder="Unique Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Brand / Category</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all font-medium text-sm"
                                    placeholder="Category"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Batch Number</label>
                                <input
                                    type="text"
                                    name="batch_number"
                                    value={formData.batch_number}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all font-medium text-sm"
                                    placeholder="e.g. BN-2023-001"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiry_date"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all font-medium text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Product Image</label>
                            <input
                                id="product-image-upload"
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full px-5 py-4 rounded-2xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all font-medium text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent-pink file:text-white hover:file:bg-pink-600"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Product Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all font-medium text-sm min-h-[140px]"
                                placeholder="Enter product details..."
                                rows={4}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-5"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Register Product'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[2.5rem] bg-white text-primary-dark text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                                <QrCodeIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black mb-1">Product Registered</h3>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">QR Code & Blockchain ID Ready</p>

                            <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-8 border border-gray-100 flex items-center justify-center relative group">
                                <img
                                    src={`http://localhost:8000${result.product.qr_code_path}`}
                                    alt="QR Code"
                                    className="w-44 h-44 mix-blend-multiply"
                                    onError={(e) => {
                                        e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + result.product.product_hash
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const imageUrl = `http://localhost:8000${result.product.qr_code_path}`
                                        fetch(imageUrl)
                                            .then(response => response.blob())
                                            .then(blob => {
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.style.display = 'none';
                                                a.href = url;
                                                // Name the file nicely
                                                a.download = `qr-${result.product.product_name || 'code'}.png`;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                            })
                                            .catch(() => toast.error('Download failed'));
                                    }}
                                    className="absolute bottom-4 right-4 p-3 bg-white border border-gray-200 rounded-xl shadow-lg hover:bg-slate-50 text-gray-600 hover:text-accent-pink transition-all opacity-0 group-hover:opacity-100"
                                    title="Download QR"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    const imageUrl = `http://localhost:8000${result.product.qr_code_path}`
                                    fetch(imageUrl)
                                        .then(response => response.blob())
                                        .then(blob => {
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.style.display = 'none';
                                            a.href = url;
                                            a.download = `qr-${result.product.product_name || 'code'}.png`;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        })
                                        .catch(() => toast.error('Download failed'));
                                }}
                                className="w-full btn-outline py-3 mb-6 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Download This QR
                            </button>

                            <div className="text-left p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Tx ID</span>
                                <code className="block text-[10px] break-all font-mono text-gray-500 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">{result.product.blockchain_tx_hash || 'PENDING'}</code>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-10 text-center">
                            <PlusIcon className="w-10 h-10 text-gray-800 mb-6" />
                            <h3 className="text-lg font-bold text-gray-600">Enter Details</h3>
                            <p className="text-gray-700 text-xs mt-2">Fill the form to generate <br /> a unique QR code.</p>
                        </div>
                    )}
                </div>
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
                console.error('Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Batch <span className="text-accent-pink">Inventory</span></h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="p-20 rounded-[3rem] bg-white/[0.03] border border-white/5 text-center">
                    <PlusIcon className="w-12 h-12 mx-auto text-gray-700 mb-6" />
                    <p className="text-gray-500 font-bold">No active batches detected</p>
                </div>
            )}
        </motion.div>
    )
}

const ManufacturerDashboard = () => {
    return (
        <Routes>
            <Route element={<ManufacturerLayout />}>
                <Route index element={<ManufacturerOverview />} />
                <Route path="register" element={<RegisterProductPage />} />
                <Route path="products" element={<MyProductsPage />} />
                <Route path="products/:id" element={<ProductDetails />} />
            </Route>
        </Routes>
    )
}

export default ManufacturerDashboard
