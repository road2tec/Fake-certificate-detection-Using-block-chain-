import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
    ShieldCheckIcon,
    QrCodeIcon,
    CubeTransparentIcon,
    UserGroupIcon,
    CheckBadgeIcon,
    BoltIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    LockClosedIcon,
    ChartBarIcon,
    ArrowRightIcon,
    StarIcon,
} from '@heroicons/react/24/outline'
import { ShieldCheckIcon as ShieldSolid, CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid'

const LandingPage = () => {
    const features = [
        {
            icon: ShieldCheckIcon,
            title: 'Counterfeit Detection',
            description: 'Advanced blockchain verification instantly identifies fake products with 99.9% accuracy.',
        },
        {
            icon: QrCodeIcon,
            title: 'QR Code Verification',
            description: 'Scan unique QR codes to access complete product history and authenticity reports.',
        },
        {
            icon: CubeTransparentIcon,
            title: 'Blockchain Security',
            description: 'Immutable records on blockchain ensure product data cannot be tampered with.',
        },
        {
            icon: DevicePhoneMobileIcon,
            title: 'Mobile Ready',
            description: 'Verify products on-the-go with our mobile-optimized scanning technology.',
        },
        {
            icon: GlobeAltIcon,
            title: 'Global Network',
            description: 'Connected to worldwide brand databases for international product verification.',
        },
        {
            icon: ChartBarIcon,
            title: 'Analytics Dashboard',
            description: 'Track verification statistics and gain insights into product authenticity trends.',
        },
    ]

    const steps = [
        {
            number: '01',
            title: 'Manufacturer Registers',
            description: 'Brands register their products on the blockchain with unique identifiers.',
            icon: '🏭',
        },
        {
            number: '02',
            title: 'QR Code Generated',
            description: 'Each product receives a unique, tamper-proof QR code linked to blockchain.',
            icon: '📱',
        },
        {
            number: '03',
            title: 'Consumer Scans',
            description: 'Customers scan the QR code using our app or website.',
            icon: '🔍',
        },
        {
            number: '04',
            title: 'Instant Verification',
            description: 'Get real-time authenticity confirmation with complete product history.',
            icon: '✅',
        },
    ]

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Pharmaceutical Executive',
            company: 'MediCare Plus',
            content: 'AuthentiCheck has reduced counterfeit incidents by 95%. Our customers trust our products like never before.',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Brand Protection Manager',
            company: 'LuxeStyle Fashion',
            content: 'The blockchain verification gives our customers confidence. Fake products are instantly identified.',
            rating: 5,
        },
        {
            name: 'Emily Rodriguez',
            role: 'Quality Assurance Director',
            company: 'TechGiant Electronics',
            content: 'Implementation was seamless. We now have complete visibility into our supply chain authenticity.',
            rating: 5,
        },
    ]

    const stats = [
        { value: '10M+', label: 'Products Verified' },
        { value: '500+', label: 'Trusted Brands' },
        { value: '50+', label: 'Countries' },
        { value: '99.9%', label: 'Accuracy Rate' },
    ]

    const trustedBy = ['Pharmaceutical', 'Electronics', 'Fashion', 'Cosmetics', 'Automotive', 'Food & Beverage']

    return (
        <div className="min-h-screen bg-[#061e16]">
            <Navbar />

            {/* Hero Section with Background Image */}
            <section className="relative min-h-screen flex items-center">
                {/* Fixed Background Image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(/hero-bg.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#061e16] via-[#061e16]/90 to-[#061e16]/70"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-emerald-400 font-medium text-sm">Blockchain-Powered Security</span>
                            </motion.div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Verify Product
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                    Authenticity
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                                Protect your brand and customers from counterfeit products with our blockchain-powered QR code verification system.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-12">
                                <Link
                                    to="/signup"
                                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center gap-2"
                                >
                                    Get Started Free
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                                >
                                    Sign In
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8">
                                {stats.slice(0, 3).map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Feature Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: '🔍', title: 'Instant Scan', desc: 'Verify in seconds' },
                                    { icon: '🛡️', title: 'Blockchain', desc: 'Secure & immutable' },
                                    { icon: '📱', title: 'Mobile Ready', desc: 'Scan anywhere' },
                                    { icon: '✅', title: '99.9% Accurate', desc: 'Trusted results' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="p-6 bg-[#0a2a1f]/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                                    >
                                        <span className="text-3xl mb-3 block">{item.icon}</span>
                                        <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-3 bg-emerald-400 rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Trusted By */}
            <section className="py-16 bg-[#041510] border-y border-emerald-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-wider">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {trustedBy.map((industry, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-gray-400 font-medium hover:text-emerald-400 transition-colors cursor-default"
                            >
                                {industry}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-[#061e16]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Features</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
                            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Features</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Everything you need to protect your products and customers from counterfeits.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-[#0a2a1f] rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-[#041510]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Process</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Works</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Simple four-step process to verify any product's authenticity.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative p-8 bg-[#0a2a1f] rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all text-center"
                            >
                                {/* Step Number */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold text-sm">
                                    Step {step.number}
                                </div>

                                <span className="text-4xl block mt-4 mb-4">{step.icon}</span>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-gray-400 text-sm">{step.description}</p>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-emerald-500/30"></div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-[#061e16]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
                            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Users Say</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 bg-[#0a2a1f] rounded-2xl border border-emerald-500/10"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array(testimonial.rating).fill(0).map((_, i) => (
                                        <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">{testimonial.name}</div>
                                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                                        <div className="text-emerald-400 text-sm">{testimonial.company}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-[#041510]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">About Us</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-6">
                                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">AuthentiCheck</span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                We're on a mission to eliminate counterfeit products worldwide. Using cutting-edge blockchain technology and QR code verification, we help brands protect their reputation and customers ensure product authenticity.
                            </p>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                Founded by a team of security experts and blockchain enthusiasts, AuthentiCheck provides an unbreakable chain of trust from manufacturer to consumer.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="p-4 bg-[#0a2a1f] rounded-xl border border-emerald-500/10">
                                        <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                                        <div className="text-gray-400 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: ShieldSolid, title: 'Security First', desc: 'Enterprise-grade blockchain security' },
                                { icon: BoltIcon, title: 'Lightning Fast', desc: 'Instant verification results' },
                                { icon: GlobeAltIcon, title: 'Global Reach', desc: '50+ countries worldwide' },
                                { icon: UserGroupIcon, title: '24/7 Support', desc: 'Dedicated customer success' },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="p-6 bg-[#0a2a1f] rounded-2xl border border-emerald-500/10"
                                >
                                    <item.icon className="w-10 h-10 text-emerald-400 mb-4" />
                                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#061e16] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500 rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                            <CheckBadgeSolid className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Join 500+ Businesses</span>
                        </span>

                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Protect Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Products?
                            </span>
                        </h2>

                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Start verifying product authenticity today. Get set up in minutes with our easy integration.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/signup?role=manufacturer"
                                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center gap-2"
                            >
                                Register as Manufacturer
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/signup?role=consumer"
                                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                            >
                                Verify Products
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage
