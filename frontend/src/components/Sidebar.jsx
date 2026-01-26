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
    CpuChipIcon,
} from '@heroicons/react/24/outline'

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
        { name: 'Pending Approvals', path: '/admin/approvals', icon: ClockIcon },
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
        admin: 'Global Admin',
        manufacturer: 'Verified Producer',
        consumer: 'Trusted User'
    }

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-primary-dark border-r border-white/5 p-6 z-50 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-accent-pink flex items-center justify-center text-white shadow-lg shadow-accent-pink/20">
                    <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Authenti<span className="text-accent-pink font-black">Check</span></span>
            </div>

            {/* User Profile */}
            <div className="mb-8 p-4 rounded-3xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-dark flex items-center justify-center text-accent-pink font-bold border border-white/5">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-white truncate text-xs">{user?.name}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-0.5">{roleLabels[role]}</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1.5 pt-4">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin' || link.path === '/manufacturer' || link.path === '/consumer'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all relative group ${isActive
                                ? 'bg-white/[0.05] text-white shadow-sm'
                                : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
                            }`
                        }
                    >
                        <link.icon className={`w-5 h-5 transition-colors group-[.active]:text-accent-pink`} />
                        <span className="tracking-tight">{link.name}</span>
                        {/* Indicator */}
                        <div className="absolute left-0 w-1 h-4 bg-accent-pink rounded-r-full scale-y-0 group-[.active]:scale-y-100 transition-transform origin-center"></div>
                    </NavLink>
                ))}
            </nav>

            {/* System Info */}
            <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                        <CpuChipIcon className="w-3.5 h-3.5" />
                        Network
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-500 font-bold text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300"
                >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
