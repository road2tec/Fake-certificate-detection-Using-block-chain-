import { Link } from 'react-router-dom'
import {
    ShieldCheckIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const sections = [
        {
            title: 'Platform',
            links: [
                { label: 'Core Features', href: '#features' },
                { label: 'How it Works', href: '#how-it-works' },
                { label: 'About Us', href: '#about' },
                { label: 'Dashboard', href: '/login' },
            ]
        },
        {
            title: 'Solutions',
            links: [
                { label: 'Luxury Goods', href: '/' },
                { label: 'Electronics', href: '/' },
                { label: 'Medical Supplies', href: '/' },
                { label: 'Verification', href: '#how-it-works' },
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/' },
                { label: 'Terms of Service', href: '/' },
                { label: 'Cookie Policy', href: '/' },
                { label: 'Security Audit', href: '/' },
            ]
        }
    ]

    return (
        <footer className="bg-slate-900 pt-32 pb-16 relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-pink/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Info - Spans 4 columns */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center gap-3 group mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-accent-pink text-white flex items-center justify-center shadow-2xl shadow-accent-pink/20 transition-all duration-500 group-hover:scale-110">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">
                                Authenti<span className="text-accent-pink italic">Check</span>
                            </span>
                        </Link>
                        <p className="text-white/40 text-base leading-relaxed mb-10 max-w-sm italic">
                            The simple way to verify products. We use secure technology to protect brands and shoppers from fakes.
                        </p>
                        <div className="flex gap-4">
                            {['Twitter', 'LinkedIn'].map((social) => (
                                <div key={social} className="px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.02] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer font-bold text-[9px] uppercase tracking-widest">
                                    {social}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation - Each spans 2 columns */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10 opacity-20">Platform</h4>
                        <ul className="space-y-5">
                            <li><a href="#features" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Core Features</a></li>
                            <li><a href="#how-it-works" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">How it Works</a></li>
                            <li><a href="#about" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">About Us</a></li>
                            <li><Link to="/login" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10 opacity-20">Solutions</h4>
                        <ul className="space-y-5">
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Luxury Goods</a></li>
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Electronics</a></li>
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Medical Supplies</a></li>
                            <li><a href="#how-it-works" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Verification</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10 opacity-20">Legal</h4>
                        <ul className="space-y-5">
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Privacy Policy</a></li>
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Terms of Service</a></li>
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Cookie Policy</a></li>
                            <li><a href="/" className="text-white/40 hover:text-accent-pink text-sm font-medium transition-colors">Security Audit</a></li>
                        </ul>
                    </div>

                    {/* Newsletter - Spans 2 columns */}
                    <div className="lg:col-span-2 flex flex-col items-start">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10 opacity-20">Newsletter</h4>
                        <div className="relative w-full group">
                            <input
                                type="text"
                                placeholder="Email address"
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-6 pr-14 py-4 text-sm text-white focus:outline-none focus:border-accent-pink/30 transition-all"
                            />
                            <button className="absolute right-1.5 top-1.5 w-10 h-10 rounded-xl bg-accent-pink text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-pink/20">
                                <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                        © {currentYear} AuthentiCheck Identity. Simplified Security.
                    </p>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3 text-white/20 text-[9px] font-black uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            System Live
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
