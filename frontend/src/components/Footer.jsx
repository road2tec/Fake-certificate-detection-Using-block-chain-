import { Link } from 'react-router-dom'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'About', href: '#about' },
    ]

    const securityLinks = [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Compliance', href: '#' },
    ]

    const contactInfo = [
        { label: 'support@authenticheck.com', href: 'mailto:support@authenticheck.com' },
        { label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
        { label: 'San Francisco, CA', href: '#' },
    ]

    return (
        <footer className="bg-[#041510] border-t border-emerald-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Authenti<span className="text-emerald-400">Check</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Fighting counterfeit products globally with blockchain-powered
                            verification. Ensuring authenticity, building trust.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {['X', 'in', 'Gh'].map((social, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all text-sm font-bold"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-emerald-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Security</h4>
                        <ul className="space-y-3">
                            {securityLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-emerald-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-3">
                            {contactInfo.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 hover:text-emerald-400 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-emerald-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} AuthentiCheck. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
