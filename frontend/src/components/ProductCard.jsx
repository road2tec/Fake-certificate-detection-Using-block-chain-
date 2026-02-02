import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { QrCodeIcon, ShieldCheckIcon, CalendarIcon, BuildingOfficeIcon, BoltIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const ProductCard = ({ product, showStatus = true }) => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleAudit = () => {
        const role = user?.role || 'consumer'
        navigate(`/${role}/products/${product.id || product._id}`)
    }

    const handleDownloadQr = (e) => {
        e.stopPropagation()
        const imageUrl = `http://localhost:8000${product.qr_code_path}`
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `QR_${product.product_name?.replace(/\s+/g, '_')}_${product.hash || product.id}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => console.error('Download failed')); // Silent fail or log
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-accent-pink/20 transition-all duration-500 shadow-2xl relative group overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-pink/[0.02] blur-2xl rounded-full translate-x-12 -translate-y-12"></div>

            {product.image_url && (
                <div className="absolute top-0 right-0 bottom-0 w-1/3 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={`http://localhost:8000${product.image_url}`} alt="Product" className="w-full h-full object-cover mask-image-linear" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
                </div>
            )}

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-dark border border-white/5 flex items-center justify-center text-accent-pink shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-tight leading-none mb-1.5">{product.name || product.product_name}</h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-accent-pink"></span>
                            {product.brand || 'Authenticated Asset'}
                        </p>
                    </div>
                </div>
                {showStatus && (
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${product.is_verified || product.blockchain_registered || product.blockchain_tx_hash
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        {product.is_verified || product.blockchain_registered || product.blockchain_tx_hash ? 'Verified' : 'Pending'}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2">Origin</span>
                    <div className="flex items-center gap-2 text-gray-400">
                        <BuildingOfficeIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold truncate">{product.manufacturer_name || product.brand || 'Global HQ'}</span>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">Registered</span>
                    <div className="flex items-center gap-2 text-gray-400">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Active'}</span>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">Batch No</span>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="w-3.5 h-3.5 flex items-center justify-center font-serif text-[10px] border border-gray-600 rounded-sm">#</span>
                        <span className="text-xs font-bold truncate">{product.batch_number || 'N/A'}</span>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[8px] font-black text-amber-500/80 uppercase tracking-widest block mb-2">Expiry</span>
                    <div className="flex items-center gap-2 text-gray-400">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-500/60" />
                        <span className="text-xs font-bold">{product.expiry_date || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 relative z-10">
                <button
                    onClick={handleAudit}
                    className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2"
                >
                    <BoltIcon className="w-4 h-4" />
                    Audit
                </button>
                <button
                    onClick={handleDownloadQr}
                    className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all group/qr"
                    title="Download QR Code"
                >
                    <ArrowDownTrayIcon className="w-6 h-6 group-hover/qr:scale-110 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}

export default ProductCard
