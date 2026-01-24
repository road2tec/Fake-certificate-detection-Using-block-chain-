import { useState, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import ApprovalCard from '../components/ApprovalCard'
import ProductCard from '../components/ProductCard'
import adminService from '../services/admin.service'
import toast from 'react-hot-toast'
import {
    UsersIcon,
    CubeIcon,
    ShieldCheckIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    BellIcon,
} from '@heroicons/react/24/outline'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'

// Dashboard Layout
const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-[#061e16]">
            <Sidebar role="admin" />
            <main className="ml-64 p-8">
                <Outlet />
            </main>
        </div>
    )
}

// Dashboard Overview
const AdminOverview = () => {
    const [stats, setStats] = useState(null)
    const [recentVerifications, setRecentVerifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, verificationsRes] = await Promise.all([
                    adminService.getStats(),
                    adminService.getVerifications(null, 1, 5)
                ])
                setStats(statsRes.data)
                setRecentVerifications(verificationsRes.data.items)
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const pieData = stats ? [
        { name: 'Authentic', value: stats.authentic_verifications, color: '#10B981' },
        { name: 'Fake', value: stats.fake_verifications, color: '#F97316' },
    ] : []

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value={stats?.total_users || 0}
                    icon={UsersIcon}
                    color="emerald"
                />
                <StatsCard
                    title="Pending Approvals"
                    value={stats?.pending_manufacturers || 0}
                    icon={ClockIcon}
                    color="gold"
                />
                <StatsCard
                    title="Total Products"
                    value={stats?.total_products || 0}
                    icon={CubeIcon}
                    color="violet"
                />
                <StatsCard
                    title="Verifications"
                    value={stats?.total_verifications || 0}
                    icon={ShieldCheckIcon}
                    color="coral"
                />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Verification Results Pie Chart */}
                <div className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Verification Results</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-sm text-gray-400">Authentic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-sm text-gray-400">Fake</span>
                        </div>
                    </div>
                </div>

                {/* Recent Verifications */}
                <div className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Verifications</h3>
                    <div className="space-y-3">
                        {recentVerifications.length > 0 ? (
                            recentVerifications.map((v) => (
                                <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-[#061e16] border border-emerald-500/10">
                                    <div>
                                        <p className="text-sm font-medium text-white">{v.product_name}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(v.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${v.result === 'authentic'
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                        {v.result === 'authentic' ? (
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4 mr-1" />
                                        )}
                                        {v.result}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">No verifications yet</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Manufacturers Page
const ManufacturersPage = () => {
    const [manufacturers, setManufacturers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [filter, setFilter] = useState('')

    const fetchManufacturers = async () => {
        try {
            const response = await adminService.getManufacturers(filter || null)
            setManufacturers(response.data.items)
        } catch (error) {
            toast.error('Failed to load manufacturers')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchManufacturers()
    }, [filter])

    const handleApprove = async (id) => {
        setActionLoading(true)
        try {
            await adminService.approveManufacturer(id)
            toast.success('Manufacturer approved!')
            fetchManufacturers()
        } catch (error) {
            toast.error('Failed to approve manufacturer')
        } finally {
            setActionLoading(false)
        }
    }

    const handleReject = async (id) => {
        setActionLoading(true)
        try {
            await adminService.rejectManufacturer(id)
            toast.success('Manufacturer rejected')
            fetchManufacturers()
        } catch (error) {
            toast.error('Failed to reject manufacturer')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-emerald-800">Manufacturers</h1>
                <div className="flex gap-2">
                    {['', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                ? 'bg-emerald-500 text-white'
                                : 'bg-cream-200 text-emerald-700 hover:bg-cream-300'
                                }`}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : manufacturers.length > 0 ? (
                <div className="grid gap-4">
                    {manufacturers.map((m) => (
                        <ApprovalCard
                            key={m.id}
                            manufacturer={m}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            loading={actionLoading}
                        />
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <UsersIcon className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
                    <p className="text-emerald-600">No manufacturers found</p>
                </div>
            )}
        </motion.div>
    )
}

// Products Page
const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await adminService.getProducts()
                setProducts(response.data.items)
            } catch (error) {
                toast.error('Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-emerald-800 mb-8">All Products</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : products.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <CubeIcon className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
                    <p className="text-emerald-600">No products registered yet</p>
                </div>
            )}
        </motion.div>
    )
}

// Verifications Page
const VerificationsPage = () => {
    const [verifications, setVerifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')

    useEffect(() => {
        const fetchVerifications = async () => {
            try {
                const response = await adminService.getVerifications(filter || null)
                setVerifications(response.data.items)
            } catch (error) {
                toast.error('Failed to load verifications')
            } finally {
                setLoading(false)
            }
        }
        fetchVerifications()
    }, [filter])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-emerald-800">Verification History</h1>
                <div className="flex gap-2">
                    {['', 'authentic', 'fake'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                ? 'bg-emerald-500 text-white'
                                : 'bg-cream-200 text-emerald-700 hover:bg-cream-300'
                                }`}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : verifications.length > 0 ? (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-cream-300">
                                <th className="text-left py-3 px-4 text-emerald-700">Product</th>
                                <th className="text-left py-3 px-4 text-emerald-700">Consumer</th>
                                <th className="text-left py-3 px-4 text-emerald-700">Result</th>
                                <th className="text-left py-3 px-4 text-emerald-700">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifications.map((v) => (
                                <tr key={v.id} className="border-b border-cream-200 hover:bg-cream-50">
                                    <td className="py-3 px-4 text-emerald-800">{v.product_name}</td>
                                    <td className="py-3 px-4 text-emerald-600">{v.consumer_name || 'Anonymous'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`badge ${v.result === 'authentic' ? 'badge-success' : 'badge-danger'}`}>
                                            {v.result}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-emerald-600">
                                        {new Date(v.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card text-center py-12">
                    <ShieldCheckIcon className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
                    <p className="text-emerald-600">No verifications yet</p>
                </div>
            )}
        </motion.div>
    )
}

// Notifications Page
const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await adminService.getNotifications()
                setNotifications(response.data.items)
            } catch (error) {
                toast.error('Failed to load notifications')
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-emerald-800 mb-8">Notifications</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`card flex items-start gap-4 ${!n.is_read ? 'border-l-4 border-emerald-500' : ''}`}
                        >
                            <div className={`p-2 rounded-lg ${n.type === 'approval' ? 'bg-emerald-100 text-emerald-600' :
                                n.type === 'rejection' ? 'bg-coral-100 text-coral-600' :
                                    n.type === 'alert' ? 'bg-gold-100 text-gold-600' :
                                        'bg-violet-100 text-violet-600'
                                }`}>
                                <BellIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-emerald-800">{n.message}</p>
                                <p className="text-sm text-emerald-500 mt-1">
                                    {new Date(n.created_at).toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <BellIcon className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
                    <p className="text-emerald-600">No notifications yet</p>
                </div>
            )}
        </motion.div>
    )
}

// Main Admin Dashboard Export with Routes
const AdminDashboard = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="manufacturers" element={<ManufacturersPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="verifications" element={<VerificationsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
            </Route>
        </Routes>
    )
}

export default AdminDashboard
