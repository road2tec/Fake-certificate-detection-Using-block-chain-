import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import InstitutionDashboard from './pages/InstitutionDashboard'
import VerifierDashboard from './pages/VerifierDashboard'

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
                return <Navigate to="/institution" replace />
            case 'consumer':
                return <Navigate to="/verifier" replace />
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

            {/* Institution Routes (was Manufacturer) */}
            <Route
                path="/institution/*"
                element={
                    <ProtectedRoute allowedRoles={['manufacturer']}>
                        <InstitutionDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Verifier Routes (was Consumer) */}
            <Route
                path="/verifier/*"
                element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                        <VerifierDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
