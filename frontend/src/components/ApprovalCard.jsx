import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon, BuildingOfficeIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

const ApprovalCard = ({ manufacturer, onApprove, onReject }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
        >
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-xl flex items-center justify-center">
                        {manufacturer.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-white">{manufacturer.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                            <BuildingOfficeIcon className="w-4 h-4" />
                            {manufacturer.company_name}
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 ml-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        {manufacturer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        {manufacturer.company_address}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReject(manufacturer.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                    <XMarkIcon className="w-5 h-5" />
                    Reject
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onApprove(manufacturer.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                >
                    <CheckIcon className="w-5 h-5" />
                    Approve
                </motion.button>
            </div>
        </motion.div>
    )
}

export default ApprovalCard
