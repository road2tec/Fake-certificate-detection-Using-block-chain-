import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    Bars3Icon,
    XMarkIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    SparklesIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { ShieldCheckIcon as ShieldSolid } from '@heroicons/react/24/solid'

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin':
                return '/admin'
            case 'manufacturer':
                return '/manufacturer'
            case 'consumer':
                return '/consumer'
            default:
                return '/'
        }
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#about', label: 'About' },
    ]

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                        ? 'glass-navbar py-3'
                        : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.4 }}
                                className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all"
                            >
                                <ShieldSolid className="w-6 h-6 text-emerald-400" />
                                {/* Glow Effect */}
                                <div className="absolute inset-0 rounded-xl bg-emerald-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white leading-tight">
                                    Authenti<span className="text-gradient">Check</span>
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase hidden sm:block">
                                    Blockchain Security
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden lg:flex items-center gap-1">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mr-4"
                            >
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                                    Next-Gen Auth
                                </span>
                            </motion.div>

                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium text-sm group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                                </a>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={getDashboardLink()}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium group"
                                    >
                                        <UserCircleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Dashboard
                                        <ChevronRightIcon className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all font-medium border border-white/10 hover:border-white/20"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-5 py-2.5 rounded-xl text-white hover:bg-white/10 transition-all font-medium border border-white/10 hover:border-white/20"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="relative group px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center gap-2"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        Sign Up
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors border border-white/10"
                        >
                            <motion.div
                                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </motion.div>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-80 md:hidden"
                        >
                            <div className="h-full bg-[#061e16] border-l border-emerald-500/20 p-6 overflow-y-auto">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                            <ShieldSolid className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <span className="text-lg font-bold text-white">
                                            Authenti<span className="text-emerald-400">Check</span>
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Links */}
                                <div className="space-y-2">
                                    {navLinks.map((link, index) => (
                                        <motion.a
                                            key={index}
                                            href={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                        </motion.a>
                                    ))}
                                </div>

                                <hr className="border-white/10 my-6" />

                                {/* Auth Section */}
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <Link
                                            to={getDashboardLink()}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <UserCircleIcon className="w-5 h-5 text-emerald-400" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            to="/login"
                                            className="block text-center px-4 py-3 text-white border border-white/20 rounded-xl hover:bg-white/5 transition-all font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <SparklesIcon className="w-4 h-4" />
                                            Sign Up Free
                                        </Link>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="text-xs text-gray-500 text-center">
                                        Protected by blockchain encryption
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
