import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ChevronLeftIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    CubeIcon,
    CalendarIcon,
    BuildingOfficeIcon,
    DocumentDuplicateIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import productService from '../services/product.service'
import toast from 'react-hot-toast'

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await productService.getProduct(id)
                setProduct(response.data)
            } catch (error) {
                toast.error('Failed to load asset details')
                navigate(-1)
            } finally {
                setLoading(false)
            }
        }
        fetchProductDetails()
    }, [id, navigate])

    const copyToClipboard = (text, message) => {
        navigator.clipboard.writeText(text)
        toast.success(message)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm uppercase tracking-widest">Back to Inventory</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                        Status: Immutable
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                        Network: Live
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Visual Side */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="p-8 rounded-[3rem] bg-white text-primary-dark aspect-square flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                            src={`http://localhost:8000${product.qr_code_path}`}
                            alt="QR Identity"
                            className="w-full h-full relative z-10 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + product.product_hash
                            }}
                        />
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-6">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security Details</h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-primary-dark border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-bold text-gray-600 uppercase">Product Hash</span>
                                    <button
                                        onClick={() => copyToClipboard(product.product_hash, 'Hash Copied')}
                                        className="text-accent-pink hover:text-white"
                                    >
                                        <DocumentDuplicateIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <code className="text-[10px] text-gray-400 break-all font-mono leading-relaxed">{product.product_hash}</code>
                            </div>

                            <div className="p-4 rounded-xl bg-primary-dark border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest text-[8px]">Blockchain Tx</span>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${product.blockchain_tx_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-pink hover:text-white"
                                    >
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </a>
                                </div>
                                <code className="text-[10px] text-gray-400 break-all font-mono leading-relaxed">{product.blockchain_tx_hash || 'PENDING_WRITE'}</code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Side */}
                <div className="lg:col-span-2 space-y-10">
                    <div>
                        <div className="flex items-center gap-3 text-accent-pink mb-4">
                            <ShieldCheckIcon className="w-6 h-6" />
                            <span className="font-black text-xs uppercase tracking-widest italic">Authenticity Guaranteed</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
                            {product.product_name}
                        </h1>
                        <p className="text-2xl text-white/40 font-bold italic tracking-tight uppercase">
                            {product.brand}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-primary-dark border border-white/5 flex items-center justify-center text-accent-pink mb-6 group-hover:scale-110 transition-transform">
                                <BuildingOfficeIcon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Manufacturer</span>
                            <p className="text-lg font-bold text-white tracking-tight">{product.manufacturer_name}</p>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-primary-dark border border-white/5 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Registration Date</span>
                            <p className="text-lg font-bold text-white tracking-tight">
                                {new Date(product.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <CubeIcon className="w-20 h-20 text-white/[0.02]" />
                        </div>
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Product Details</h3>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                            {product.description || 'No additional cryptographic metadata provided for this asset. The product is registered and verified on the decentralized ledger.'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => copyToClipboard(`http://localhost:5173/verify/${product.product_hash}`, 'Verification Link Copied')}
                            className="flex-1 btn-outline py-5 flex items-center justify-center gap-3 group"
                        >
                            <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            Share Certificate
                        </button>
                        <button className="flex-1 btn-primary py-5 flex items-center justify-center gap-3">
                            <GlobeAltIcon className="w-5 h-5 animate-pulse" />
                            View History
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductDetails
