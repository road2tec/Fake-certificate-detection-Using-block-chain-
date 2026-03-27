import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    SparklesIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline'

import { NoisyBackground, GradientBlur } from '../components/Decorations'

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
        institution_name: '',
        institution_address: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passphrases do not match')
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
                payload.company_name = formData.institution_name
                payload.company_address = formData.institution_address
            }
            await authService.register(payload)
            toast.success(role === 'manufacturer' ? 'Application submitted for Institution Review' : 'Verifier Registration Complete')
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-primary-dark flex relative overflow-hidden font-sans text-white">
            <NoisyBackground />
            <GradientBlur color="indigo-500" position="bottom-left" />

            {/* Split Background Visual */}
            <div className="hidden lg:block lg:w-1/2 bg-primary-dark relative border-r border-white/5">
                <div className="absolute inset-0 bg-black/40 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 via-primary-dark/20 to-primary-dark"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-20">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
                        <h2 className="text-5xl font-bold text-white leading-none tracking-tight mb-12 italic">Secure the <br /> <span className="text-accent-pink">Future of Credentials.</span></h2>
                        <div className="space-y-8">
                            {[
                                { icon: ShieldCheckIcon, title: 'Blockchain Provenance', desc: 'Secure the entire history of academic achievements.' },
                                { icon: SparklesIcon, title: 'Instant Verification', desc: 'Prove degree authenticity with cryptographic certainty.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent-pink border border-white/10 shrink-0 backdrop-blur-sm">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg tracking-tight">{item.title}</h4>
                                        <p className="text-gray-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Registration Form Area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10 overflow-y-auto">
                <div className="w-full max-w-lg py-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white mb-10 uppercase tracking-[0.2em] transition-colors group">
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </Link>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl">
                                    <ShieldCheckIcon className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">Register</h1>
                            </div>

                            {/* Role Selection */}
                            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                                {[
                                    { id: 'consumer', label: 'Verifier' },
                                    { id: 'manufacturer', label: 'Institution' }
                                ].map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setRole(r.id)}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === r.id
                                            ? 'bg-accent-pink text-white shadow-lg shadow-accent-pink/20'
                                            : 'text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:border-accent-pink/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 font-medium text-sm" placeholder="e.g. Satya Nadella" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Email ID</label>
                                    <div className="relative group">
                                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:border-accent-pink/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 font-medium text-sm" placeholder="contact@domain.edu" />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {role === 'manufacturer' && (
                                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Educational Entity</label>
                                            <div className="relative group">
                                                <AcademicCapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                                <input type="text" name="institution_name" value={formData.institution_name} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-primary-dark text-white focus:border-accent-pink/50 outline-none transition-all placeholder:text-gray-600 font-medium text-sm" placeholder="University Campus Name" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Campus Address</label>
                                            <div className="relative group">
                                                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                                <input type="text" name="institution_address" value={formData.institution_address} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-primary-dark text-white focus:border-accent-pink/50 outline-none transition-all placeholder:text-gray-600 font-medium text-sm" placeholder="Full Postal Location" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Create Passphrase</label>
                                    <div className="relative group">
                                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:border-accent-pink/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 font-medium text-sm" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Confirm Passphrase</label>
                                    <div className="relative group">
                                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:border-accent-pink/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 font-medium text-sm" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-accent-pink/20">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Initialize Account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-white/5 text-center">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Already have an account?{' '}
                                <Link to="/login" className="text-accent-pink hover:text-white transition-colors underline underline-offset-4">Sign In</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Signup
