import { motion, useScroll, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { NoisyBackground, GradientBlur } from '../components/Decorations'
import {
    ShieldCheckIcon,
    ArrowPathIcon,
    BoltIcon,
    UserGroupIcon,
    ArrowRightIcon,
    QrCodeIcon,
    MagnifyingGlassIcon,
    DocumentCheckIcon,
    SparklesIcon,
    GlobeAltIcon,
    FingerPrintIcon,
    CloudArrowUpIcon,
    ShieldExclamationIcon,
    CpuChipIcon,
    LockClosedIcon,
    CheckBadgeIcon,
    WalletIcon,
    ArrowsRightLeftIcon,
    KeyIcon,
} from '@heroicons/react/24/outline'

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const categories = [
        { title: 'Luxury Skincare', image: '/cat_cosmetics_real.png', count: '1.2k Secured', tag: 'Beauty' },
        { title: 'Fine Jewelry', image: '/cat_jewelry_real.png', count: '850+ Verified', tag: 'Luxury' },
        { title: 'Medical Grade', image: '/cat_medicine_real.png', count: '10k+ Protected', tag: 'Health' },
        { title: 'Organic Produce', image: '/cat_produce_real.png', count: '5k+ Tracked', tag: 'Agro' },
    ]

    const features = [
        {
            icon: ShieldCheckIcon,
            title: 'Immutable Blockchain Core',
            description: 'Every product unit is anchored to a decentralized Ethereum-based ledger. Once recorded, the data is permanent and tamper-proof.',
            details: ['Decentralized nodes', 'Zero downtime', 'Cryptographic hashing']
        },
        {
            icon: FingerPrintIcon,
            title: 'Unit-Level QR Identification',
            description: 'Mass replication is impossible. Every single physical unit receives a unique digital signature that cannot be cloned.',
            details: ['Non-reproducible codes', 'Anti-cloning technology', 'Scan-limit alerts']
        },
        {
            icon: CpuChipIcon,
            title: 'Smart Execution Protocol',
            description: 'Automated smart contracts manage ownership and status updates without human intervention, ensuring total integrity.',
            details: ['Auto-verification', 'Secure hand-offs', 'Instant resolution']
        },
    ]

    const steps = [
        {
            icon: CloudArrowUpIcon,
            title: 'Manufacturer Upload',
            description: 'Companies register their original products onto our secure blockchain system to create a permanent record.',
        },
        {
            icon: ArrowsRightLeftIcon,
            title: 'Inventory Tracking',
            description: 'The system tracks the product movement through the supply chain to ensure nothing is swapped or cloned.',
        },
        {
            icon: QrCodeIcon,
            title: 'Instant Verification',
            description: 'Customers scan the QR code using their phone to instantly see if the product is authentic or fake.',
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden font-sans selection:bg-accent-pink/20 selection:text-slate-900">
            <NoisyBackground />
            <Navbar />

            {/* Scroll Progress Indicator */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-pink z-[60] origin-left" style={{ scaleX }} />

            {/* --- SECTION 1: HERO --- */}
            <section className="relative min-h-[110vh] flex flex-col items-center justify-between overflow-hidden bg-slate-900">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40 blur-[1px] grayscale-[0.2]"
                    style={{ backgroundImage: 'url(/hero_scan_real.png)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 w-full pt-44 pb-20 flex-grow flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md"
                        >
                            <SparklesIcon className="w-4 h-4 text-accent-pink" />
                            <span className="text-white/40 font-bold text-[10px] uppercase tracking-[0.4em]">Integrated Trust Systems v2.1</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl lg:text-[8.5rem] font-black text-white mb-10 leading-[0.85] tracking-tighter"
                        >
                            Authentic. <br />
                            <span className="hero-text-gradient italic">Without Doubt.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl text-white/40 mb-16 leading-relaxed max-w-2xl font-medium"
                        >
                            We provide the digital bridge between physical assets and consumer trust. Deploying military-grade blockchain verification to the global marketplace with absolute transparency.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap gap-8"
                        >
                            <Link to="/signup?role=consumer" className="btn-primary flex items-center gap-4 px-12 py-6 rounded-[2rem] shadow-none hover:shadow-2xl hover:shadow-accent-pink/20 transition-all font-black tracking-widest text-[11px]">
                                START VERIFYING
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                            <Link to="/signup?role=manufacturer" className="btn-outline border border-white/10 hover:bg-white/5 transition-all px-12 py-6 rounded-[2rem] font-black tracking-widest text-[11px]">
                                PRODUCER PORTAL
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Sub-Hero Trust Bar */}
                <div className="relative w-full border-t border-white/5 bg-slate-900/40 backdrop-blur-xl py-12 z-10">
                    <div className="max-w-7xl mx-auto px-12 flex flex-wrap items-center justify-between gap-12">
                        <div className="flex gap-16 lg:gap-32">
                            {[
                                { label: 'Audit Trail', value: '100% Immutable' },
                                { label: 'Active Scans', value: '12k+ Units' },
                                { label: 'Uptime', value: '99.99%' },
                            ].map((stat, i) => (
                                <div key={i} className="min-w-[120px]">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-3">{stat.label}</p>
                                    <p className="text-xl font-black text-white/80 tracking-tight whitespace-nowrap">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="hidden xl:flex items-center gap-10 border-l border-white/5 pl-12">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Ecosystem Trust:</span>
                            <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
                                <LockClosedIcon className="w-6 h-6 text-white" />
                                <GlobeAltIcon className="w-6 h-6 text-white" />
                                <CpuChipIcon className="w-6 h-6 text-white" />
                                <CheckBadgeIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: INDUSTRIES (Moved) --- */}
            <section className="py-48 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-12 text-center mb-32">
                    <p className="text-[11px] font-black text-accent-pink uppercase tracking-[0.5em] mb-6">MARKET VERTICALS</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">High-Value Networks.</h2>
                </div>
                <div className="max-w-7xl mx-auto px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -15 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[10/14] overflow-hidden rounded-[4.5rem] mb-10 shadow-2xl shadow-slate-200 group-hover:shadow-accent-pink/10 transition-all duration-700">
                                    <img src={cat.image} className="w-full h-full object-cover grayscale-[0.4] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-90 lg:opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                    <div className="absolute bottom-12 left-12 text-white translate-y-8 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-pink mb-4">{cat.tag}</p>
                                        <p className="text-3xl font-black tracking-tighter leading-none mb-2">{cat.title}</p>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{cat.count}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: FEATURES --- */}
            <section id="features" className="py-48 bg-white relative">
                <div className="max-w-7xl mx-auto px-12">
                    <div className="flex flex-col lg:flex-row gap-20 items-end justify-between mb-32">
                        <div className="max-w-3xl">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-[11px] font-black text-accent-pink uppercase tracking-[0.5em] mb-8"
                            >
                                THE PROTOCOL
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl lg:text-[7.5rem] font-black text-slate-900 tracking-tighter mb-10 leading-[0.9]"
                            >
                                Security <br /> <span className="text-slate-200 uppercase">Core.</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl"
                            >
                                Our multi-layered defense system combines decentralization with high-speed optical scanning to protect every single asset in your supply chain.
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            className="hidden lg:block pb-10 text-slate-100"
                        >
                            <CheckBadgeIcon className="w-40 h-40" />
                        </motion.div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-3 gap-10"
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="group p-12 rounded-[4rem] bg-slate-50 border border-slate-100 hover:border-accent-pink/30 hover:bg-white transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-900 mb-12 group-hover:bg-accent-pink group-hover:text-white group-hover:scale-110 transition-all duration-700">
                                    <f.icon className="w-9 h-9" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-none">{f.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed mb-12 text-lg">{f.description}</p>
                                <ul className="space-y-4 pt-10 border-t border-slate-100">
                                    {f.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-[11px] font-black text-slate-400 tracking-widest uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-pink shadow-[0_0_10px_rgba(219,39,119,0.5)]"></div>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 3: HOW IT WORKS --- */}
            {/* --- SECTION 3: HOW IT WORKS --- */}
            <section id="how-it-works" className="py-48 bg-slate-900 relative">
                <NoisyBackground />
                <GradientBlur color="indigo-500" position="top-left" />

                <div className="max-w-7xl mx-auto px-12 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-40">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[11px] font-black text-accent-pink uppercase tracking-[0.6em] mb-10"
                        >
                            THE PROCESS
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-6xl lg:text-[8.5rem] font-black text-white tracking-tighter mb-10 leading-[0.85]"
                        >
                            How It <br /> <span className="hero-text-gradient italic text-white/90">Works.</span>
                        </motion.h2>
                    </div>

                    <div className="relative">
                        <div className="grid lg:grid-cols-3 gap-16 relative z-10">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="group relative"
                                >
                                    <div className="p-14 rounded-[4.5rem] bg-white/[0.02] border border-white/5 hover:border-accent-pink/30 transition-all duration-700 group-hover:bg-white/[0.04]">
                                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-pink mb-14 group-hover:bg-accent-pink group-hover:text-white group-hover:scale-110 transition-all duration-1000 shadow-2xl">
                                            <step.icon className="w-10 h-10" />
                                        </div>

                                        <div className="flex items-center gap-6 mb-8">
                                            <span className="text-4xl font-black text-white/10 italic">0{i + 1}</span>
                                            <h4 className="text-3xl font-black text-white tracking-tight leading-none uppercase">{step.title}</h4>
                                        </div>

                                        <p className="text-white/40 font-medium leading-relaxed text-lg italic">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: ABOUT US --- */}
            <section id="about" className="py-48 bg-white relative overflow-hidden">
                <GradientBlur color="accent-pink" position="bottom-right" />
                <div className="max-w-7xl mx-auto px-12">
                    <div className="grid lg:grid-cols-2 gap-40 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-block px-5 py-2 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.5em] mb-12">AUTHENTICHECK IDENTITY</div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl lg:text-[8rem] font-black text-slate-900 tracking-tighter mb-12 leading-[0.85]"
                            >
                                Restoring <br /> <span className="text-slate-200 uppercase">Trust.</span>
                            </motion.h2>
                            <div className="space-y-10 text-slate-500 font-medium text-xl leading-relaxed">
                                <p>
                                    In an era of sophisticated counterfeiting, AuthentiCheck serves as the definitive barrier. We merge industrial supply chain expertise with decentralized ledger architecture.
                                </p>
                                <p>
                                    Our mission: Eliminate the $4.5T illicit trade economy by empowering every consumer with immediate, cryptographically secured proof of origin.
                                </p>
                            </div>

                            <div className="mt-20 flex flex-wrap gap-16">
                                <div>
                                    <div className="text-5xl font-black text-slate-900 mb-3 tracking-tighter italic">99.8%</div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">DETECTION ACCURACY</p>
                                </div>
                                <div className="hidden sm:block w-px h-16 bg-slate-100"></div>
                                <div>
                                    <div className="text-5xl font-black text-slate-900 mb-3 tracking-tighter italic">INSTANT</div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">GLOBAL RESPONSE</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="relative z-10 p-6 bg-slate-50 rounded-[5rem] border border-slate-100 shadow-sm"
                            >
                                <img src="/hero_scan_real.png" className="rounded-[4rem] shadow-2xl grayscale-[0.8] hover:grayscale-0 transition-all duration-1000" />
                                <div className="absolute -bottom-12 -right-12 bg-white p-14 rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-slate-100 max-w-[360px] group transition-transform hover:-translate-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-accent-pink/10 flex items-center justify-center text-accent-pink mb-8">
                                        <ShieldExclamationIcon className="w-9 h-9" />
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 mb-4 tracking-tight">The Origin Barrier.</p>
                                    <p className="text-base text-slate-400 leading-relaxed font-medium">Cloning a code is simple. Overcoming a decentralized ledger is impossible.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>





            <Footer />
        </div>
    )
}

export default LandingPage
