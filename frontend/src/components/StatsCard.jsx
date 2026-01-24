import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon, color, description }) => {
    const getColorClasses = () => {
        switch (color) {
            case 'emerald': return 'border-emerald-500/30 bg-emerald-500/10'
            case 'violet': return 'border-violet-500/30 bg-violet-500/10'
            case 'gold': return 'border-amber-500/30 bg-amber-500/10'
            case 'coral': return 'border-rose-500/30 bg-rose-500/10'
            case 'blue': return 'border-blue-500/30 bg-blue-500/10'
            default: return 'border-emerald-500/30 bg-emerald-500/10'
        }
    }

    const getIconColor = () => {
        switch (color) {
            case 'emerald': return 'text-emerald-400'
            case 'violet': return 'text-violet-400'
            case 'gold': return 'text-amber-400'
            case 'coral': return 'text-rose-400'
            case 'blue': return 'text-blue-400'
            default: return 'text-emerald-400'
        }
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`p-6 rounded-2xl border ${getColorClasses()} backdrop-blur-sm transition-all`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses()}`}>
                    <Icon className={`w-6 h-6 ${getIconColor()}`} />
                </div>
                {description && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-gray-400">
                        {description}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
                <h3 className={`text-3xl font-bold mt-1 ${getIconColor()}`}>{value}</h3>
            </div>
        </motion.div>
    )
}

export default StatsCard
