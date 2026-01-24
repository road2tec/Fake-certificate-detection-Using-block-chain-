import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import productService from '../services/product.service'
import toast from 'react-hot-toast'
import {
    ShieldCheckIcon,
    QrCodeIcon,
    CheckCircleIcon,
    XCircleIcon,
    CameraIcon,
    StopIcon,
    ClockIcon,
    ArrowUpTrayIcon,
    PhotoIcon
} from '@heroicons/react/24/outline'

// Helper for safe error message extraction
const getErrorMessage = (error) => {
    const detail = error.response?.data?.detail
    if (!detail) return error.message || 'An error occurred'
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map(err => err.msg).join(', ')
    if (typeof detail === 'object') return JSON.stringify(detail)
    return String(detail)
}

// Layout
const ConsumerLayout = () => {
    return (
        <div className="min-h-screen bg-[#061e16]">
            <Sidebar role="consumer" />
            <main className="ml-64 p-8">
                <Outlet />
            </main>
        </div>
    )
}

// Dashboard Overview
const ConsumerOverview = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await productService.getVerificationHistory(1, 5)
                setHistory(response.data.items)
            } catch (error) {
                console.error('Error fetching history:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const authenticCount = history.filter(h => h.result === 'authentic').length
    const fakeCount = history.filter(h => h.result === 'fake' || h.result === 'not_found').length

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Consumer Dashboard</h1>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Scans"
                    value={history.length}
                    icon={QrCodeIcon}
                    color="violet"
                />
                <StatsCard
                    title="Authentic Products"
                    value={authenticCount}
                    icon={CheckCircleIcon}
                    color="emerald"
                />
                <StatsCard
                    title="Fake Detected"
                    value={fakeCount}
                    icon={XCircleIcon}
                    color="coral"
                />
            </div>

            {/* Quick Verify */}
            <div className="p-6 rounded-2xl mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Verify a Product</h3>
                        <p className="opacity-90">Scan a QR code or enter product hash to verify authenticity</p>
                    </div>
                    <a href="/consumer/verify" className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                        Start Verification
                    </a>
                </div>
            </div>

            {/* Recent Verifications */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Recent Verifications</h2>
                {loading ? (
                    <div className="text-white">Loading...</div>
                ) : history.length > 0 ? (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${item.result === 'authentic'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                        {item.result === 'authentic' ? (
                                            <CheckCircleIcon className="w-6 h-6" />
                                        ) : (
                                            <XCircleIcon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{item.product_name}</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.result === 'authentic'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {item.result}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 text-center">
                        <ShieldCheckIcon className="w-12 h-12 mx-auto text-emerald-500/30 mb-3" />
                        <p className="text-gray-400">No verification history yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Verify Product Page
const VerifyProductPage = () => {
    const [hashInput, setHashInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [showScanner, setShowScanner] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        let scanner = null
        if (showScanner) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            )
            scanner.render(onScanSuccess, onScanFailure)
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error))
            }
        }
    }, [showScanner])

    const onScanSuccess = (decodedText, decodedResult) => {
        setShowScanner(false)
        setHashInput(decodedText)
        handleVerify(decodedText)
    }

    const onScanFailure = (error) => {
        // console.warn(`Code scan error = ${error}`)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        try {
            const html5QrCode = new Html5Qrcode("reader-hidden")
            const decodedText = await html5QrCode.scanFile(file, true)
            setHashInput(decodedText)
            handleVerify(decodedText)
            html5QrCode.clear()
        } catch (err) {
            console.error(err)
            const msg = "Could not find a valid QR code in this image"
            toast.error(msg)
            setError(msg)
        }
    }

    const handleVerify = async (hash = null) => {
        let productHash = hash || hashInput.trim()
        setError(null)
        setResult(null)

        if (!productHash) {
            const msg = 'Please enter a product hash'
            toast.error(msg)
            setError(msg)
            return
        }

        if (productHash.startsWith('VERIFY:')) {
            productHash = productHash.replace('VERIFY:', '')
        }

        if (productHash.startsWith('0x')) {
            productHash = productHash.substring(2)
        }

        if (productHash.length !== 64) {
            const msg = `Invalid hash format. Hash should be 64 characters. (Current: ${productHash.length})`
            toast.error(msg)
            setError(msg)
            return
        }

        setLoading(true)
        setResult(null)

        try {
            const response = await productService.verifyProduct(productHash)
            setResult(response.data)

            if (response.data.is_authentic) {
                toast.success('Product is authentic!')
            } else {
                toast.error('Warning: Product may be fake!')
            }
        } catch (error) {
            const msg = getErrorMessage(error)
            toast.error(msg)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-white mb-8">Verify Product</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    {/* Hash Input */}
                    <div className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Option 1: Enter Product Hash
                        </h3>
                        <div className="space-y-4">
                            <textarea
                                value={hashInput}
                                onChange={(e) => setHashInput(e.target.value)}
                                placeholder="Paste the 64-character product hash here..."
                                className="w-full px-4 py-3 bg-[#061e16] border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[100px] font-mono text-sm"
                            />

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={() => handleVerify()}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheckIcon className="w-5 h-5" />
                                        Verify Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* QR Code Scanner */}
                    <div className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Option 2: Scan QR Code
                        </h3>

                        {/* Hidden div for file scanning */}
                        <div id="reader-hidden" className="hidden"></div>

                        {!showScanner ? (
                            <div className="space-y-4">
                                {/* Drag & Drop Area */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center gap-3 text-center ${dragActive
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                    <div className="w-16 h-16 rounded-full bg-[#061e16] flex items-center justify-center border border-emerald-500/30">
                                        <PhotoIcon className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white mb-1">
                                            Drop QR image here
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            or click to upload
                                        </p>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <ArrowUpTrayIcon className="w-5 h-5 text-emerald-500/50" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-emerald-500/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-[#0a2a1f] text-gray-500">OR</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowScanner(true)}
                                    className="w-full py-4 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/5 transition-all text-emerald-400 font-medium flex items-center justify-center gap-2"
                                >
                                    <CameraIcon className="w-5 h-5" />
                                    <span>Use Camera</span>
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl overflow-hidden p-2">
                                <div id="reader" className="w-full"></div>
                                <button
                                    onClick={() => setShowScanner(false)}
                                    className="mt-2 w-full py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
                                >
                                    <StopIcon className="w-5 h-5" /> Stop Camera
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Result Section */}
                {result && (
                    <div className={`p-6 rounded-2xl border-2 ${result.is_authentic
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="text-center mb-6">
                            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${result.is_authentic ? 'bg-emerald-500' : 'bg-red-500'
                                }`}>
                                {result.is_authentic ? (
                                    <CheckCircleIcon className="w-14 h-14 text-white" />
                                ) : (
                                    <XCircleIcon className="w-14 h-14 text-white" />
                                )}
                            </div>

                            <h2 className={`text-2xl font-bold ${result.is_authentic ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {result.is_authentic ? 'AUTHENTIC PRODUCT' : 'WARNING: POTENTIAL FAKE'}
                            </h2>
                            <p className={`mt-2 ${result.is_authentic ? 'text-emerald-400/80' : 'text-red-400/80'
                                }`}>
                                {result.message}
                            </p>
                        </div>

                        {/* Product Details */}
                        {result.product_details && (
                            <div className="border-t border-emerald-500/20 pt-6 space-y-3">
                                <h3 className="font-semibold text-white">Product Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-400">Product Name</span>
                                        <p className="font-medium text-white">{result.product_details.product_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-400">Brand</span>
                                        <p className="font-medium text-white">{result.product_details.brand}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-400">Manufacturer</span>
                                        <p className="font-medium text-white">{result.product_details.manufacturer_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-400">Registered</span>
                                        <p className="font-medium text-white">
                                            {new Date(result.product_details.registered_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${result.blockchain_verified
                                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                                    : 'bg-amber-500/20 border border-amber-500/30'
                                    }`}>
                                    <div className={`p-2 rounded-lg ${result.blockchain_verified ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`}>
                                        <ShieldCheckIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${result.blockchain_verified ? 'text-emerald-400' : 'text-amber-400'
                                            }`}>
                                            {result.blockchain_verified
                                                ? '✓ Verified on Blockchain'
                                                : '⚠ Blockchain verification unavailable'
                                            }
                                        </p>
                                        {result.blockchain_verified && (
                                            <p className="text-sm text-emerald-400/70">
                                                This product's authenticity is secured by blockchain technology
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// History Page
const HistoryPage = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await productService.getVerificationHistory()
                setHistory(response.data.items)
            } catch (error) {
                toast.error('Failed to load history')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Verification History</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : history.length > 0 ? (
                <div className="p-6 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-emerald-500/20">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Result</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Blockchain</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id} className="border-b border-emerald-500/10 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-white">{item.product_name}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.result === 'authentic'
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                            {item.result}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.blockchain_verified ? (
                                            <span className="text-emerald-400">✓ Verified</span>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-gray-400">
                                        {new Date(item.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 rounded-2xl bg-[#0a2a1f] border border-emerald-500/20 text-center">
                    <ClockIcon className="w-16 h-16 mx-auto text-emerald-500/30 mb-4" />
                    <p className="text-gray-400">No verification history yet</p>
                </div>
            )}
        </div>
    )
}

// Main Export
const ConsumerDashboard = () => {
    return (
        <Routes>
            <Route element={<ConsumerLayout />}>
                <Route index element={<ConsumerOverview />} />
                <Route path="verify" element={<VerifyProductPage />} />
                <Route path="history" element={<HistoryPage />} />
            </Route>
        </Routes>
    )
}

export default ConsumerDashboard
