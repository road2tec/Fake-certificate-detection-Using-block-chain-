import { motion } from 'framer-motion'
import { QrCodeIcon, ShieldCheckIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const ProductCard = ({ product, showStatus = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl border border-emerald-500/20 bg-[#0a2a1f] hover:border-emerald-500/40 transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                        <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">{product.name}</h3>
                        <p className="text-sm text-emerald-400 font-medium">UID: {product.uid}</p>
                    </div>
                </div>
                {showStatus && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.is_verified
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                        {product.is_verified ? '✓ Verified' : '⏳ Pending'}
                    </span>
                )}
            </div>

            <div className="space-y-3 border-t border-emerald-500/10 pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-300">Manufacturer:</span> {product.manufacturer_name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-300">Manufactured:</span> {new Date(product.created_at).toLocaleDateString()}
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                >
                    View Details
                </motion.button>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                >
                    <QrCodeIcon className="w-5 h-5" />
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ProductCard
