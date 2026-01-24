import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline'
import { ShieldCheckIcon as ShieldSolid } from '@heroicons/react/24/solid'

const Signup = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const initialRole = searchParams.get('role') || 'consumer'

    const [role, setRole] = useState(initialRole)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company_name: '',
        company_address: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role,
            }

            if (role === 'manufacturer') {
                payload.company_name = formData.company_name
                payload.company_address = formData.company_address
            }

            await authService.register(payload)
            toast.success(
                role === 'manufacturer'
                    ? 'Registration successful! Please wait for admin approval.'
                    : 'Registration successful! Please login.'
            )
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        {
            id: 'consumer',
            label: 'Consumer',
            description: 'Verify & track products',
            emoji: '🔍',
        },
        {
            id: 'manufacturer',
            label: 'Manufacturer',
            description: 'Register & protect products',
            emoji: '🏭',
        },
    ]

    const benefits = [
        { icon: '🛡️', text: 'Blockchain Security' },
        { icon: '⚡', text: 'Instant Verification' },
        { icon: '🌍', text: 'Global Coverage' },
        { icon: '✅', text: '500+ Trusted Brands' },
    ]

    return (
        <div className="min-h-screen flex relative">
            {/* Fixed Background Image */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url(/auth-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Dark Overlay - Reversed for Signup */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#061e16]/95 via-[#061e16]/80 to-[#061e16]/60"></div>
            </div>

            {/* Left Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md py-4"
                >
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors mb-6 group"
                    >
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    {/* Form Card */}
                    <div className="bg-[#0a2a1f]/90 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/20 shadow-2xl shadow-black/50">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                                <ShieldSolid className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">
                                    Authenti<span className="text-emerald-400">Check</span>
                                </span>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Fake Product Identification</div>
                            </div>
                        </div>

                        {/* Form Header */}
                        <div className="mb-5">
                            <h2 className="text-2xl font-bold text-white mb-1">Create Account 🎉</h2>
                            <p className="text-gray-400 text-sm">
                                Join the anti-counterfeit revolution
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {roles.map((r) => (
                                <motion.button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setRole(r.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative p-3 rounded-xl border-2 transition-all text-left ${role === r.id
                                            ? 'border-emerald-500 bg-emerald-500/20'
                                            : 'border-emerald-500/20 bg-[#061e16] hover:border-emerald-500/40'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{r.emoji}</span>
                                        <span className={`font-bold text-sm ${role === r.id ? 'text-emerald-400' : 'text-gray-300'}`}>
                                            {r.label}
                                        </span>
                                    </div>
                                    <div className={`text-xs ${role === r.id ? 'text-emerald-400/80' : 'text-gray-500'}`}>
                                        {r.description}
                                    </div>
                                    {role === r.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2"
                                        >
                                            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Manufacturer Fields */}
                            <AnimatePresence>
                                {role === 'manufacturer' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Name 🏢</label>
                                            <div className="relative">
                                                <BuildingOfficeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="company_name"
                                                    value={formData.company_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                                    placeholder="Your Company Ltd."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Address 📍</label>
                                            <div className="relative">
                                                <MapPinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="company_address"
                                                    value={formData.company_address}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                                    placeholder="123 Business Street, City"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password 🔐</label>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full pl-11 pr-11 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Manufacturer Note */}
                            <AnimatePresence>
                                {role === 'manufacturer' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
                                    >
                                        <p className="text-amber-400 text-xs flex items-start gap-2">
                                            <span className="text-base">⚠️</span>
                                            <span>
                                                <strong>Note:</strong> Manufacturer accounts require admin approval
                                                before you can register products.
                                            </span>
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Join AuthentiCheck
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="mt-5 pt-5 border-t border-emerald-500/20 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-center"
                    >
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Protected by blockchain encryption
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Side - Content Over Background */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-lg"
                >
                    {/* Main Heading */}
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Fight Against
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            Counterfeits
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Join thousands of brands and consumers in the global fight against fake products.
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {benefits.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 p-4 bg-[#0a2a1f]/60 backdrop-blur rounded-xl border border-emerald-500/20"
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-white font-medium">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Product Categories */}
                    <div>
                        <p className="text-sm text-gray-400 mb-3">Products we help protect:</p>
                        <div className="flex gap-3 flex-wrap">
                            {['💊 Pharma', '👟 Footwear', '⌚ Watches', '👜 Bags', '📱 Electronics'].map((item, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-gray-300"
                                >
                                    {item}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Signup
