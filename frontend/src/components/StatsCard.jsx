import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-accent-pink/20 hover:bg-white/[0.05] transition-all duration-500 group shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-pink/5 blur-2xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-accent-pink/10 transition-colors"></div>
            <div className="flex items-center gap-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-primary-dark border border-white/10 flex items-center justify-center text-accent-pink group-hover:scale-110 transition-transform shadow-inner">
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{title}</p>
                    <h3 className="text-4xl font-black text-white tracking-widest leading-none">{value}</h3>
                </div>
            </div>
            {/* Visual accent bar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent-pink/0 group-hover:bg-accent-pink/50 rounded-full transition-all duration-500 group-hover:w-20"></div>
        </motion.div>
    )
}

export default StatsCard
