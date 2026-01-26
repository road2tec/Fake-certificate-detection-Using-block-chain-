import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    Bars3Icon,
    XMarkIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline'

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
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
            case 'admin': return '/admin'
            case 'manufacturer': return '/manufacturer'
            case 'consumer': return '/consumer'
            default: return '/'
        }
    }

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#about', label: 'About' },
    ]

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/70 py-4 backdrop-blur-xl border-b border-gray-100/50 shadow-sm'
                    : 'bg-transparent py-8'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-8 lg:px-12">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 scale-95 group-hover:scale-100 ${isScrolled ? 'bg-accent-pink text-white shadow-lg shadow-accent-pink/20' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'
                                }`}>
                                <ShieldCheckIcon className="w-5 h-5" />
                            </div>
                            <span className={`text-xl font-bold tracking-tight transition-colors duration-500 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                                Authenti<span className="text-accent-pink font-extrabold">Check</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-12">
                            {navLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.href}
                                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative group py-2 ${isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-pink group-hover:w-full transition-all duration-300 rounded-full"></span>
                                </a>
                            ))}
                        </div>

                        {/* Auth Section */}
                        <div className="hidden md:flex items-center gap-8">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={getDashboardLink()}
                                        className={`text-[10px] font-bold flex items-center gap-3 uppercase tracking-[0.2em] group transition-all ${isScrolled ? 'text-slate-900' : 'text-white'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors group-hover:border-accent-pink/50 ${isScrolled ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                                            }`}>
                                            <UserCircleIcon className="w-4 h-4" />
                                        </div>
                                        Hub
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${isScrolled ? 'text-slate-400 hover:text-red-500' : 'text-white/50 hover:text-white'
                                            }`}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                                        }`}>
                                        Login
                                    </Link>
                                    <Link to="/signup" className={`btn-primary py-3 px-8 text-[10px] flex items-center gap-2 group shadow-none hover:shadow-lg transition-all ${isScrolled ? 'bg-slate-900' : ''
                                        }`}>
                                        Get Started
                                        <SparklesIcon className="w-3.5 h-3.5" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className={`lg:hidden p-3 rounded-2xl transition-all border ${isScrolled ? 'text-slate-900 bg-slate-50 border-slate-100' : 'text-white bg-white/5 border-white/10'
                                }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-40 lg:hidden bg-slate-900 p-10 flex flex-col items-center justify-center text-center"
                    >
                        <div className="space-y-12 w-full max-w-xs">
                            <div className="flex flex-col gap-8">
                                {navLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.href}
                                        className="text-4xl font-bold text-white tracking-tight"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 pt-10 border-t border-white/10">
                                <Link
                                    to="/login"
                                    className="w-full py-5 rounded-2xl border border-white/10 text-white font-bold tracking-widest text-[11px] uppercase"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="w-full btn-primary py-5 text-center text-[11px]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
