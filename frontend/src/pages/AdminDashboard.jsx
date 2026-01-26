import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import ApprovalCard from '../components/ApprovalCard'
import ProductCard from '../components/ProductCard'
import ProductDetails from './ProductDetails'
import adminService from '../services/admin.service'
import toast from 'react-hot-toast'
import {
    UsersIcon,
    CubeIcon,
    ShieldCheckIcon,
    PlusIcon,
    ChartPieIcon,
    BellIcon,
    ClockIcon,
} from '@heroicons/react/24/outline'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

import { NoisyBackground, GradientBlur } from '../components/Decorations'

// Dashboard Layout
const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-primary-dark relative overflow-hidden font-sans">
            <NoisyBackground />
            <GradientBlur color="accent-pink" position="top-right" />
            <GradientBlur color="accent-indigo" position="bottom-left" />
            <Sidebar role="admin" />
            <main className="ml-64 p-10 lg:p-16 relative z-10">
                <Outlet />
            </main>
        </div>
    )
}

// Dashboard Home
const AdminOverview = () => {
    const [stats, setStats] = useState({
        total_manufacturers: 0,
        pending_manufacturers: 0,
        total_products: 0,
        total_verifications: 0
    })
    const [pendingRequests, setPendingRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true)
            try {
                const [statsRes, pendingRes] = await Promise.all([
                    adminService.getStats(),
                    adminService.getManufacturers('pending')
                ])
                setStats(statsRes.data)
                setPendingRequests(pendingRes.data.items.slice(0, 3)) // Show latest 3
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadDashboardData()
    }, [])

    const handleApprove = async (id) => {
        setActionLoading(true)
        try {
            await adminService.approveManufacturer(id)
            toast.success('Manufacturer Access Granted')
            // Refresh counts and list
            const [statsRes, pendingRes] = await Promise.all([
                adminService.getStats(),
                adminService.getManufacturers('pending')
            ])
            setStats(statsRes.data)
            setPendingRequests(pendingRes.data.items.slice(0, 3))
        } catch (error) {
            toast.error('Approval failed')
        } finally {
            setActionLoading(false)
        }
    }

    const handleReject = async (id) => {
        setActionLoading(true)
        try {
            await adminService.rejectManufacturer(id)
            toast.error('Access Denied')
            const [statsRes, pendingRes] = await Promise.all([
                adminService.getStats(),
                adminService.getManufacturers('pending')
            ])
            setStats(statsRes.data)
            setPendingRequests(pendingRes.data.items.slice(0, 3))
        } catch (error) {
            toast.error('Rejection failed')
        } finally {
            setActionLoading(false)
        }
    }

    const chartData = [
        { name: 'Mon', active: 40, verified: 24, issues: 2 },
        { name: 'Tue', active: 30, verified: 13, issues: 1 },
        { name: 'Wed', active: 20, verified: 98, issues: 5 },
        { name: 'Thu', active: 27, verified: 39, issues: 3 },
        { name: 'Fri', active: 18, verified: 48, issues: 2 },
        { name: 'Sat', active: 23, verified: 38, issues: 1 },
        { name: 'Sun', active: 34, verified: 43, issues: 4 },
    ]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Network <span className="text-accent-pink font-black text-5xl">Pulse</span></h1>
                <p className="text-gray-500 font-medium">Global ecosystem monitoring and administrative control.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <StatsCard title="Nodes Joined" value={stats.total_manufacturers} icon={UsersIcon} />
                <StatsCard title="Queued Audits" value={stats.pending_manufacturers} icon={PlusIcon} />
                <StatsCard title="Active Assets" value={stats.total_products} icon={CubeIcon} />
                <StatsCard title="Trusted Verifications" value={stats.total_verifications} icon={ShieldCheckIcon} />
            </div>

            {/* Critical Actions - Focused Approval Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-2">Verification <span className="text-accent-pink">Queue</span></h3>
                        <p className="text-gray-500 text-sm font-medium italic">High-priority node authorization requests.</p>
                    </div>
                    {pendingRequests.length > 0 && (
                        <button
                            onClick={() => navigate('/admin/approvals')}
                            className="px-6 py-2 rounded-xl bg-accent-pink/10 border border-accent-pink/20 text-[10px] font-black uppercase tracking-widest text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-lg shadow-accent-pink/10"
                        >
                            Complete Audit
                        </button>
                    )}
                </div>

                {pendingRequests.length > 0 ? (
                    <div className="grid gap-6">
                        {pendingRequests.map((m) => (
                            <ApprovalCard
                                key={m.id}
                                manufacturer={m}
                                onApprove={() => handleApprove(m.id)}
                                onReject={() => handleReject(m.id)}
                                loading={actionLoading}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center gap-4 text-gray-600 group hover:border-emerald-500/20 transition-all">
                        <ShieldCheckIcon className="w-8 h-8 text-gray-800 group-hover:text-emerald-500/40 transition-colors" />
                        <p className="text-xs font-black uppercase tracking-widest">Network Integrity Stabilized: No Pending Actions</p>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-10 mb-12">
                <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-white">Security Velocity</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-accent-pink"></span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-white/10"></span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Idle</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVerify" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d53369" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d53369" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#030712', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="verified" stroke="#d53369" strokeWidth={3} fillOpacity={1} fill="url(#colorVerify)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center">
                    <ChartPieIcon className="w-16 h-16 text-accent-pink mb-6 opacity-40" />
                    <h3 className="text-xl font-bold text-white mb-4">Integrity Score</h3>
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                            <circle cx="96" cy="96" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 * 0.05} className="text-accent-pink stroke-current" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-white">99%</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Optimal</span>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    )
}

// Verified Manufacturers Page
const ManufacturersPage = () => {
    const [manufacturers, setManufacturers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchManufacturers()
    }, [])

    const fetchManufacturers = async () => {
        setLoading(true)
        try {
            const response = await adminService.getManufacturers('approved')
            setManufacturers(response.data.items)
        } catch (error) {
            toast.error('Failed to load manufacturers')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Verified <span className="text-accent-pink">Entities</span></h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : (
                <div className="rounded-[2.5rem] bg-white/[0.03] border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Entity Name</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Ledger ID</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {manufacturers.map((m) => (
                                <tr key={m.id} className="hover:bg-white/[0.01]">
                                    <td className="px-10 py-6 font-bold text-white">{m.name}</td>
                                    <td className="px-10 py-6 text-gray-500 font-mono text-xs">{m.id.substring(0, 12)}...</td>
                                    <td className="px-10 py-6">
                                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Revoke Access</button>
                                    </td>
                                </tr>
                            ))}
                            {manufacturers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center text-gray-600 font-bold uppercase tracking-widest">No verified entities found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    )
}

// Pending Approvals Page
const PendingApprovalsPage = () => {
    const [manufacturers, setManufacturers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = async () => {
        setLoading(true)
        try {
            const response = await adminService.getManufacturers('pending')
            setManufacturers(response.data.items)
        } catch (error) {
            toast.error('Failed to load queue')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (id) => {
        setActionLoading(true)
        try {
            await adminService.approveManufacturer(id)
            toast.success('Manufacturer Access Granted')
            await fetchPending()
        } catch (error) {
            toast.error('Approval failed')
        } finally {
            setActionLoading(false)
        }
    }

    const handleReject = async (id) => {
        setActionLoading(true)
        try {
            await adminService.rejectManufacturer(id)
            toast.error('Access Denied')
            await fetchPending()
        } catch (error) {
            toast.error('Rejection failed')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Verification <span className="text-accent-pink">Queue</span></h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : manufacturers.length > 0 ? (
                <div className="grid gap-6">
                    {manufacturers.map((m) => (
                        <ApprovalCard
                            key={m.id}
                            manufacturer={m}
                            onApprove={() => handleApprove(m.id)}
                            onReject={() => handleReject(m.id)}
                            loading={actionLoading}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center bg-white/[0.03] rounded-[3rem] border border-white/5">
                    <ClockIcon className="w-16 h-16 mx-auto text-gray-700 mb-6 opacity-30" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Queue is empty</p>
                </div>
            )}
        </motion.div>
    )
}

// Products Global Inventory
const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await adminService.getProducts()
                setProducts(response.data.items)
            } catch (error) {
                toast.error('Failed to load asset inventory')
            } finally {
                setLoading(false)
            }
        }
        fetchAllProducts()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Asset <span className="text-accent-pink">Inventory</span></h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center bg-white/[0.03] rounded-[3rem] border border-white/5">
                    <CubeIcon className="w-16 h-16 mx-auto text-gray-800 mb-6" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">No assets registered on ledger</p>
                </div>
            )}
        </motion.div>
    )
}

// Verifications History Global
const VerificationsPage = () => {
    const [verifications, setVerifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await adminService.getVerifications()
                setVerifications(response.data.items)
            } catch (error) {
                toast.error('Failed to load audit logs')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Global <span className="text-accent-pink">Audit Logs</span></h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : verifications.length > 0 ? (
                <div className="rounded-[2.5rem] bg-white/[0.03] border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Asset Name</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Consumer</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Result</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Execution Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {verifications.map((v) => (
                                <tr key={v.id} className="hover:bg-white/[0.01]">
                                    <td className="px-10 py-6 text-white font-bold">{v.product_name}</td>
                                    <td className="px-10 py-6 text-gray-400 font-medium">{v.consumer_name || 'Anonymous Scan'}</td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${v.result === 'authentic'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {v.result}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-gray-500 font-mono text-xs">{new Date(v.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-20 text-center bg-white/[0.03] rounded-[3rem] border border-white/5">
                    <ShieldCheckIcon className="w-16 h-16 mx-auto text-gray-800 mb-6" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">No verification logs available</p>
                </div>
            )}
        </motion.div>
    )
}

// Notifications Page
const NotificationsPage = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Network <span className="text-accent-pink">Alerts</span></h1>
            <div className="p-20 text-center bg-white/[0.03] rounded-[3rem] border border-white/5">
                <BellIcon className="w-16 h-16 mx-auto text-gray-700 mb-6 opacity-30" />
                <p className="text-gray-500 font-bold uppercase tracking-widest">No active system alerts</p>
            </div>
        </motion.div>
    )
}

const AdminDashboard = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="manufacturers" element={<ManufacturersPage />} />
                <Route path="approvals" element={<PendingApprovalsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="verifications" element={<VerificationsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="*" element={<AdminOverview />} />
            </Route>
        </Routes>
    )
}

export default AdminDashboard
