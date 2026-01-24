import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for stored token and user on mount
        const storedUser = localStorage.getItem('user')
        if (storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [token])

    // This function stores authentication data (called after successful API login)
    const login = (userData, accessToken) => {
        setToken(accessToken)
        setUser(userData)
        localStorage.setItem('token', accessToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    // API login function - makes the API call and stores the result
    const loginWithCredentials = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { access_token, user: userData } = response.data

            login(userData, access_token)

            return { success: true, user: userData }
        } catch (error) {
            const detail = error.response?.data?.detail
            const message = typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Login failed'
            return { success: false, error: message }
        }
    }

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData)
            const { access_token, user: newUser } = response.data

            // Manufacturers don't get a token until approved
            if (userData.role === 'manufacturer') {
                return {
                    success: true,
                    user: newUser,
                    message: newUser.message || 'Registration successful. Awaiting approval.'
                }
            }

            login(newUser, access_token)

            return { success: true, user: newUser }
        } catch (error) {
            const detail = error.response?.data?.detail
            const message = typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Signup failed'
            return { success: false, error: message }
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const value = {
        user,
        token,
        loading,
        login,               // Store user data (no API call)
        loginWithCredentials, // Make API call and store data
        signup,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isManufacturer: user?.role === 'manufacturer',
        isConsumer: user?.role === 'consumer',
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
