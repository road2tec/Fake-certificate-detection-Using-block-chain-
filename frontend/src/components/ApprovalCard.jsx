import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon, BuildingOfficeIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

const ApprovalCard = ({ manufacturer, onApprove, onReject, loading }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-accent-pink/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between group shadow-xl"
        >
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary-dark border border-white/10 flex items-center justify-center text-accent-pink text-2xl font-black shadow-inner group-hover:scale-105 transition-transform">
                        {manufacturer.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-white tracking-tight">{manufacturer.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-accent-pink font-bold uppercase tracking-widest mt-1">
                            <BuildingOfficeIcon className="w-4 h-4" />
                            {manufacturer.company_name}
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pl-1">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <EnvelopeIcon className="w-4 h-4" />
                        </div>
                        {manufacturer.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <MapPinIcon className="w-4 h-4" />
                        </div>
                        {manufacturer.company_address}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReject(manufacturer.id)}
                    disabled={loading}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold bg-gray-900 border border-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all disabled:opacity-50"
                >
                    <XMarkIcon className="w-5 h-5" />
                    Reject
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onApprove(manufacturer.id)}
                    disabled={loading}
                    className="flex-1 lg:flex-none btn-primary py-4 px-8 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <CheckIcon className="w-5 h-5" />
                    Approve Access
                </motion.button>
            </div>
        </motion.div>
    )
}

export default ApprovalCard
