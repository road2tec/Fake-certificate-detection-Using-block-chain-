import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import ManufacturerDashboard from './pages/ManufacturerDashboard'
import ConsumerDashboard from './pages/ConsumerDashboard'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard
        switch (user?.role) {
            case 'admin':
                return <Navigate to="/admin" replace />
            case 'manufacturer':
                return <Navigate to="/manufacturer" replace />
            case 'consumer':
                return <Navigate to="/consumer" replace />
            default:
                return <Navigate to="/login" replace />
        }
    }

    return children
}

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin Routes */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Manufacturer Routes */}
            <Route
                path="/manufacturer/*"
                element={
                    <ProtectedRoute allowedRoles={['manufacturer']}>
                        <ManufacturerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Consumer Routes */}
            <Route
                path="/consumer/*"
                element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                        <ConsumerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
