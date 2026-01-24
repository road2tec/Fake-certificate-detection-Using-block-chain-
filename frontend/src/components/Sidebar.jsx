import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import {
    HomeIcon,
    UserGroupIcon,
    CubeIcon,
    ShieldCheckIcon,
    BellIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { ShieldCheckIcon as ShieldSolid } from '@heroicons/react/24/solid'

const Sidebar = ({ role }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: HomeIcon },
        { name: 'Manufacturers', path: '/admin/manufacturers', icon: UserGroupIcon },
        { name: 'Products', path: '/admin/products', icon: CubeIcon },
        { name: 'Verifications', path: '/admin/verifications', icon: ShieldCheckIcon },
        { name: 'Notifications', path: '/admin/notifications', icon: BellIcon },
    ]

    const manufacturerLinks = [
        { name: 'Dashboard', path: '/manufacturer', icon: HomeIcon },
        { name: 'Register Product', path: '/manufacturer/register', icon: CubeIcon },
        { name: 'My Products', path: '/manufacturer/products', icon: ChartBarIcon },
    ]

    const consumerLinks = [
        { name: 'Dashboard', path: '/consumer', icon: HomeIcon },
        { name: 'Verify Product', path: '/consumer/verify', icon: ShieldCheckIcon },
        { name: 'History', path: '/consumer/history', icon: ClockIcon },
    ]

    const links = role === 'admin' ? adminLinks : role === 'manufacturer' ? manufacturerLinks : consumerLinks

    const roleLabels = {
        admin: 'Administrator',
        manufacturer: 'Manufacturer',
        consumer: 'Consumer'
    }

    const roleEmojis = {
        admin: '👨‍💼',
        manufacturer: '🏭',
        consumer: '🔍'
    }

    return (
        <aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-[#061e16] border-r border-emerald-500/20 p-6 z-50"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <ShieldSolid className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                    Authenti<span className="text-emerald-400">Check</span>
                </span>
            </div>

            {/* User Info */}
            <div className="mb-8 p-4 rounded-xl bg-[#0a2a1f] border border-emerald-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-lg">
                        {roleEmojis[role]}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-emerald-400">{roleLabels[role]}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin' || link.path === '/manufacturer' || link.path === '/consumer'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-6 left-6 right-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
