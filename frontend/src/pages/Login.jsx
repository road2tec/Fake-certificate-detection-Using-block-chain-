import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'
import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline'

import { NoisyBackground, GradientBlur } from '../components/Decorations'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await authService.login(formData)
            login(response.data.user, response.data.access_token)
            toast.success('Access Granted')

            switch (response.data.user.role) {
                case 'admin': navigate('/admin'); break
                case 'manufacturer': navigate('/manufacturer'); break
                case 'consumer': navigate('/consumer'); break
                default: navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-primary-dark flex relative overflow-hidden font-sans text-white">
            <NoisyBackground />
            <GradientBlur color="accent-pink" position="top-right" />
            <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-primary-dark via-primary-dark/60 to-transparent z-10"></div>
                <img src="/hero_scan_real.png" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-20">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white mb-12 uppercase tracking-[0.2em] transition-colors group">
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </Link>

                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-pink shadow-2xl">
                                <ShieldCheckIcon className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight leading-none">Welcome Back</h1>
                                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] mt-2">Sign in to your dashboard</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Email Protocol</label>
                                <div className="relative group">
                                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:border-accent-pink/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 font-medium text-sm"
                                        placeholder="id@secure.io"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Secret Hash</label>
                                <div className="relative group">
                                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:border-accent-pink/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 font-medium text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm tracking-widest"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Unlock Dashboard
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-white/5 text-center">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                New Member?{' '}
                                <Link to="/signup" className="text-accent-pink hover:text-white transition-colors underline underline-offset-4">Create Identity</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Login
