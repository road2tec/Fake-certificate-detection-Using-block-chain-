import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import certificateService from '../services/certificate.service'
import toast from 'react-hot-toast'
import {
    ShieldCheckIcon,
    QrCodeIcon,
    CheckCircleIcon,
    XCircleIcon,
    CameraIcon,
    ClockIcon,
    PhotoIcon,
    MagnifyingGlassIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline'

import { NoisyBackground, GradientBlur } from '../components/Decorations'
import CertificateDocument from '../components/CertificateDocument'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Modal Component for Certificate
const CertificateModal = ({ isOpen, onClose, certificate }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-20 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-6xl"
            >
                <button 
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/5"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <CertificateDocument certificate={certificate} />
            </motion.div>
        </div>
    )
}

// Layout
const VerifierLayout = () => {
    return (
        <div className="min-h-screen bg-primary-dark relative overflow-hidden">
            <NoisyBackground />
            <GradientBlur color="accent-pink" position="top-right" />
            <GradientBlur color="indigo-500" position="bottom-left" />
            <Sidebar role="consumer" />
            <main className="ml-64 p-10 lg:p-16 relative z-10">
                <Outlet />
            </main>
        </div>
    )
}

// Dashboard Overview
const VerifierOverview = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await certificateService.getVerificationHistory(1, 5)
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Verifier <span className="text-accent-pink">Portal</span></h1>
                    <p className="text-gray-500 font-medium">Verify credentials and manage your verification history.</p>
                </div>
                <button
                    onClick={() => navigate('/verifier/verify')}
                    className="btn-primary flex items-center gap-3"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    Verify Certificate
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <StatsCard
                    title="Verifications Run"
                    value={history.length}
                    icon={QrCodeIcon}
                />
                <StatsCard
                    title="Authentic"
                    value={authenticCount}
                    icon={CheckCircleIcon}
                />
                <StatsCard
                    title="Fraudulent"
                    value={fakeCount}
                    icon={XCircleIcon}
                />
            </div>

            {/* Recent History */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
                    <button
                        onClick={() => navigate('/verifier/history')}
                        className="text-accent-pink hover:text-white font-bold text-sm transition-colors"
                    >
                        Full History →
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid gap-4">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.result === 'authentic'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {item.result === 'authentic' ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white tracking-tight">{item.certificate_name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.result === 'authentic'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                    }`}>
                                    {item.result}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 rounded-[3rem] bg-white/[0.03] border border-white/5 text-center">
                        <ShieldCheckIcon className="w-16 h-16 mx-auto text-gray-700 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Verification History Empty</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Verified credentials will appear here after blockchain validation.</p>
                        <button onClick={() => navigate('/verifier/verify')} className="btn-primary">Verify Now</button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Verify Certificate Page
const VerifyCertificatePage = () => {
    const [hashInput, setHashInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [showScanner, setShowScanner] = useState(false)
    const [scannerStatus, setScannerStatus] = useState('Idle')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const fileInputRef = useRef(null)
    const scannerRef = useRef(null)

    useEffect(() => {
        let html5QrCode;
        if (showScanner) {
            setScannerStatus('Initializing Camera...')
            html5QrCode = new Html5Qrcode("reader")
            scannerRef.current = html5QrCode

            const config = {
                fps: 15,
                qrbox: { width: 300, height: 300 },
                aspectRatio: 1.0
            }

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                (errorMessage) => { }
            ).then(() => {
                setScannerStatus('Scanning...')
            }).catch(err => {
                console.error("Error starting scanner", err)
                setScannerStatus('Camera Error')
                toast.error('Could not access camera. Please ensure permissions are granted.')
                setShowScanner(false)
            })

            return () => {
                if (html5QrCode && html5QrCode.isScanning) {
                    html5QrCode.stop().then(() => html5QrCode.clear()).catch(err => console.error(err))
                }
            }
        }
    }, [showScanner])

    const onScanSuccess = (decodedText) => {
        handleStopScanner()
        setHashInput(decodedText)
        toast.success('QR Code Detected')
        handleVerify(decodedText)
    }

    const handleStopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current.clear()
                setShowScanner(false)
                setScannerStatus('Idle')
            }).catch(err => {
                console.error("Failed to stop scanner", err)
                setShowScanner(false)
            })
        } else {
            setShowScanner(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setScannerStatus('Analyzing Image...')
        toast.loading('Analyzing Certificate QR...')

        const html5QrCode = new Html5Qrcode("reader-hidden")
        try {
            // Options for scanFile to be more robust
            const decodedText = await html5QrCode.scanFile(file, true)
            toast.dismiss()
            setHashInput(decodedText)
            toast.success('Certificate Authenticated')
            handleVerify(decodedText)
        } catch (err) {
            toast.dismiss()
            toast.error('Scan Failed: Please ensure the QR code is clear and well-lit.')
            console.error("QR Scan error:", err)
        } finally {
            setScannerStatus('Idle')
            setTimeout(() => {
                try { 
                    html5QrCode.clear() 
                    html5QrCode.stop()
                } catch (e) { }
            }, 1000)
            e.target.value = ''
        }
    }

    const handleVerify = async (hash = null) => {
        let scannedText = hash || hashInput.trim()
        let certificateHash = scannedText;
        
        // Try to extract hash from URL if present
        if (scannedText.includes('hash=')) {
            try {
                // More robust extraction: find hash= and take the next 64 hex chars
                const match = scannedText.match(/hash=([a-fA-F0-0x]{64,66})/);
                if (match) {
                    certificateHash = match[1];
                } else {
                    const url = new URL(scannedText);
                    certificateHash = url.searchParams.get('hash') || scannedText;
                }
            } catch (e) {
                const match = scannedText.match(/hash=([^& \n\r]+)/);
                if (match) certificateHash = match[1];
            }
        }
        
        // Final cleanup
        certificateHash = certificateHash.trim().replace('0x', '');
        setHashInput(certificateHash);

        setResult(null)

        if (!certificateHash) {
            toast.error('Certificate fingerprint required')
            return
        }

        setLoading(true)
        try {
            const response = await certificateService.verifyCertificate(certificateHash)
            setResult(response.data)
            if (response.data.is_authentic) toast.success('Blockchain verified: Authentic')
            else toast.error('Security Alert: Invalid Record')
        } catch (err) {
            toast.error('Network error during verification')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Credential <span className="text-accent-pink">Audit</span></h1>

            <div id="reader-hidden" className="fixed -top-[10000px] left-0 w-[600px] h-[600px] opacity-0 pointer-events-none z-[-100]"></div>

            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-8">
                    <div className="relative overflow-hidden p-[1px] rounded-[2rem] bg-gradient-to-br from-white/10 to-white/0">
                        <div className="absolute inset-0 bg-primary-dark/90 backdrop-blur-3xl z-0"></div>
                        <div className="relative z-10 p-8 bg-primary-dark/40 rounded-[2rem] h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                                    <QrCodeIcon className="w-6 h-6 text-accent-pink" />
                                    Optical Verification
                                </h3>
                                <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${scannerStatus === 'Scanning...' ? 'border-accent-pink/50 text-accent-pink bg-accent-pink/10 animate-pulse' : 'border-white/10 text-gray-500 bg-white/5'}`}>
                                    {scannerStatus}
                                </div>
                            </div>

                            {!showScanner ? (
                                <div className="space-y-6 flex-1 flex flex-col justify-center">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-accent-pink/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                                        <div className="relative p-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-all text-center flex flex-col items-center justify-center gap-5 group-hover:border-accent-pink/30">
                                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-pink/20 to-purple-600/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/20">
                                                <PhotoIcon className="w-8 h-8 text-accent-pink" />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-white mb-1">Upload QR / Image</p>
                                                <p className="text-xs text-gray-500 font-medium">Supports scan of digital or physical certs</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowScanner(true)}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <CameraIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                        Launch Live Scanner
                                    </button>
                                </div>
                            ) : (
                                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative aspect-square bg-black group">
                                    <div id="reader" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                    <button
                                        onClick={handleStopScanner}
                                        className="absolute bottom-6 left-6 right-6 py-3 bg-red-500/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-red-500 transition-all shadow-lg"
                                    >
                                        Stop Scanning
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center justify-center gap-4 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity" onClick={() => document.getElementById('manual-input').classList.toggle('hidden')}>
                            <div className="h-px bg-white/10 flex-grow group-hover:bg-white/30 transition-colors"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Or Enter Hash Manually</span>
                            <div className="h-px bg-white/10 flex-grow group-hover:bg-white/30 transition-colors"></div>
                        </div>

                        <div id="manual-input" className="hidden mt-8">
                            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/0">
                                <div className="p-6 rounded-[1.9rem] bg-primary-dark/50 border border-white/5 relative overflow-hidden">
                                    <textarea
                                        value={hashInput}
                                        onChange={(e) => setHashInput(e.target.value)}
                                        placeholder="Paste cryptographic fingerprint (0x...)"
                                        className="w-full p-5 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-accent-pink/50 focus:bg-black/40 outline-none transition-all font-mono text-xs leading-relaxed mb-4 resize-none h-28"
                                    />
                                    <button
                                        onClick={() => handleVerify()}
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        {loading ? 'Decrypting on Chain...' : 'Verify Hash'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {result ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-10 rounded-[2.5rem] text-center shadow-2xl h-full flex flex-col justify-center border-b-8 transition-all duration-500 relative overflow-hidden ${result.is_authentic ? 'bg-white border-emerald-500 text-primary-dark shadow-emerald-500/20' : 'bg-white border-red-500 text-primary-dark shadow-red-500/20'}`}>
                            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 translate-x-1/2 -translate-y-1/2 ${result.is_authentic ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                            <div className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center relative z-10 shadow-lg ${result.is_authentic ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-400 to-red-600 text-white'}`}>
                                {result.is_authentic ? <CheckCircleIcon className="w-14 h-14" /> : <XCircleIcon className="w-14 h-14" />}
                            </div>

                            <h2 className="text-3xl font-black mb-2 uppercase tracking-tight leading-none">{result.is_authentic ? 'Authentic' : 'Fraudulent'}</h2>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-12">{result.is_authentic ? 'Identity Verification Successful' : 'Security Protocol Alert'}</p>

                            {result.certificate_details && (
                                <div className="space-y-6 text-left p-8 bg-gray-50 rounded-[2rem] border border-gray-100 font-sans relative z-10 text-primary-dark">
                                    <div className="flex gap-8">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400">
                                                    <AcademicCapIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Student Name</span>
                                                    <p className="font-bold text-lg text-gray-900 leading-tight">{result.certificate_details.student_name}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Institution</span>
                                                    <p className="text-sm font-bold text-gray-700">{result.certificate_details.institute_name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Course</span>
                                                    <p className="text-sm font-bold text-gray-700">{result.certificate_details.course_name}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Cert ID</span>
                                                    <p className="font-mono text-xs font-bold text-gray-700">#{result.certificate_details.certificate_id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Issue Date</span>
                                                    <p className="text-xs font-bold text-gray-700">{result.certificate_details.issue_date}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 bg-gray-100 p-3 rounded-xl border border-gray-200">
                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1">Blockchain Hash</span>
                                                <code className="block text-[10px] break-all font-mono text-gray-600">{result.certificate_details.blockchain_tx_hash || 'SYNCING'}</code>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {result.is_authentic && (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full mt-8 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                        >
                                            <AcademicCapIcon className="w-4 h-4" />
                                            View Verified Certificate
                                        </button>
                                    )}
                                </div>
                            )}

                            <CertificateModal 
                                isOpen={isModalOpen} 
                                onClose={() => setIsModalOpen(false)} 
                                certificate={result?.certificate_details} 
                            />
                        </motion.div>
                    ) : (
                        <div className="h-full rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-12 text-center bg-white/[0.01]">
                            <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mb-8">
                                <ShieldCheckIcon className="w-10 h-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Ready to Verify</h3>
                            <p className="text-gray-500 text-sm mt-3 font-medium leading-relaxed max-w-xs mx-auto">Upload a certificate QR or scan manually to decrypt its blockchain authenticity.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// History Page 
const HistoryPage = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await certificateService.getVerificationHistory()
                setHistory(res.data.items)
            } catch (err) { }
            finally { setLoading(false) }
        }
        fetchHistory()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Audit <span className="text-accent-pink">Logs</span></h1>
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : history.length > 0 ? (
                <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500 tracking-wider">Credential</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500 tracking-wider">Result</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500 tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {history.map(item => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-gray-200 font-medium">{item.certificate_name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.result === 'authentic' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-red-400 bg-red-500/5 border-red-500/20'}`}>
                                            {item.result}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs tabular-nums">{new Date(item.timestamp).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-16 text-center bg-white/[0.02] rounded-3xl border border-white/5">
                    <ClockIcon className="w-12 h-12 mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 text-sm">No activity recorded</p>
                </div>
            )}
        </motion.div>
    )
}

const VerifierDashboard = () => {
    return (
        <Routes>
            <Route element={<VerifierLayout />}>
                <Route index element={<VerifierOverview />} />
                <Route path="verify" element={<VerifyCertificatePage />} />
                <Route path="history" element={<HistoryPage />} />
            </Route>
        </Routes>
    )
}

export default VerifierDashboard
