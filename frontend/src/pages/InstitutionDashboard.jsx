import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import CertificateCard from '../components/CertificateCard'
import CertificateDetails from './CertificateDetails'
import certificateService from '../services/certificate.service'
import toast from 'react-hot-toast'
import {
    AcademicCapIcon,
    QrCodeIcon,
    PlusIcon,
    ShieldCheckIcon,
    CheckBadgeIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline'

import { NoisyBackground, GradientBlur } from '../components/Decorations'
import { useAuth } from '../context/AuthContext'
import CertificateDocument from '../components/CertificateDocument'
import CertificateThumbnail from '../components/CertificateThumbnail'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

// Modal Component for Certificate (REMOVED AS REQUESTED)
// Direct Print utility replaces this

// Layout
const InstitutionLayout = () => {
    return (
        <div className="min-h-screen bg-primary-dark relative font-sans">
            <NoisyBackground />
            <GradientBlur color="indigo-500" position="top-left" />
            <GradientBlur color="accent-pink" position="bottom-right" />
            <Sidebar role="manufacturer" />
            <main className="ml-64 p-10 lg:p-16 relative z-10">
                <Outlet />
            </main>
        </div>
    )
}

// Dashboard Overview
const InstitutionOverview = () => {
    const { user } = useAuth()
    const [certificates, setCertificates] = useState([])
    const [totalCertificates, setTotalCertificates] = useState(0)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await certificateService.getMyCertificates(1, 4)
                setCertificates(response.data.items)
                setTotalCertificates(response.data.total)
            } catch (error) {
                console.error('Failed to load certificates')
            } finally {
                setLoading(false)
            }
        }
        fetchCertificates()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight leading-none">Institution <span className="text-accent-pink font-black">Portal</span></h1>
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user?.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            {user?.status || 'Pending Verification'}
                        </span>
                    </div>
                    <p className="text-gray-500 font-medium italic">Issue and manage secure certificates on the blockchain.</p>
                </div>
                <button
                    onClick={() => navigate('/institution/issue')}
                    className="btn-primary flex items-center gap-3"
                >
                    <PlusIcon className="w-5 h-5" />
                    Issue New Certificate
                </button>
            </div>

            {user?.status !== 'approved' && (
                <div className="mb-12 p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <ShieldCheckIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Institution Accreditation <span className="text-amber-500">Pending</span></h3>
                            <p className="text-gray-500 text-sm font-medium">Your institution is currently in the audit queue. Issuance features are in read-only mode until authorized.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <StatsCard
                    title="Total Issued"
                    value={totalCertificates}
                    icon={AcademicCapIcon}
                />
                <StatsCard
                    title="Ledger Entries"
                    value={totalCertificates}
                    icon={QrCodeIcon}
                />
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                    <div className="text-accent-pink font-bold text-xs flex items-center gap-2 mb-2 uppercase tracking-widest">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${user?.status === 'approved' ? 'bg-accent-pink' : 'bg-gray-700'}`}></span>
                        Status: {user?.status === 'approved' ? 'AUTHORIZED' : 'RESTRICTED'}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{user?.status === 'approved' ? 'Blockchain synchronization active' : 'Awaiting network authorization'}</p>
                </div>
            </div>

            {/* Recent Certificates */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Recent Issuances</h2>
                    <button
                        onClick={() => navigate('/institution/certificates')}
                        className="text-accent-pink hover:text-white font-bold text-sm transition-colors"
                    >
                        Full History →
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                    </div>
                ) : certificates.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {certificates.map((cert) => (
                            <CertificateCard key={cert.id} certificate={cert} />
                        ))}
                    </div>
                ) : (
                    <div className="p-20 rounded-[3rem] bg-white/[0.03] border border-white/5 text-center">
                        <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-700 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">No Certificates Issued</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Issue your first secure certificate to begin.</p>
                        <button
                            onClick={() => navigate('/institution/issue')}
                            className="btn-primary"
                        >
                            Issue Certificate
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Issue Certificate Page
const IssueCertificatePage = () => {
    const [formData, setFormData] = useState({
        student_name: '',
        institute_name: '',
        course_name: '',
        certificate_id: '',
        issue_date: '',
        description: '',
        image: null
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('student_name', formData.student_name);
            formDataToSend.append('institute_name', formData.institute_name);
            formDataToSend.append('course_name', formData.course_name);
            formDataToSend.append('certificate_id', formData.certificate_id);
            formDataToSend.append('issue_date', formData.issue_date);
            formDataToSend.append('description', formData.description || '');

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await certificateService.issueCertificate(formDataToSend)
            setResult(response.data)
            toast.success('Certificate Written to Blockchain')
            setFormData({ student_name: '', institute_name: '', course_name: '', certificate_id: '', issue_date: '', description: '', image: null })

            // Reset file input
            const fileInput = document.getElementById('certificate-image-upload');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error(error)
            let errorMessage = 'Blockchain write failed';

            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    errorMessage = detail.map(err => `${err.loc[1]}: ${err.msg}`).join(', ');
                } else if (typeof detail === 'string') {
                    errorMessage = detail;
                }
            }

            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            {/* Hidden High-Fidelity Print-Only Layer */}
            {result && (
                <div className="hidden print:block fixed inset-0 z-[99999] bg-white print-show">
                    <CertificateDocument certificate={result.certificate} />
                </div>
            )}

            <h1 className="text-4xl font-bold text-white tracking-tight mb-12 print:hidden">Issue <span className="text-accent-pink">Certificate</span></h1>

            <div className="grid lg:grid-cols-12 gap-10 items-start print:hidden">
                {/* Left Form Column */}
                <div className="lg:col-span-5 p-4 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-2xl">
                    <div className="mb-8 p-4 rounded-2xl bg-accent-pink/5 border border-accent-pink/10 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <DocumentTextIcon className="w-5 h-5 text-accent-pink" />
                             <span className="text-xs font-bold text-white">Certificate Details</span>
                         </div>
                         {result && (
                             <button 
                                onClick={() => setResult(null)}
                                className="text-[10px] font-black uppercase text-accent-pink hover:text-white transition-colors"
                             >
                                 Clear & New +
                             </button>
                         )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 px-2">Student Name</label>
                                <input
                                    type="text"
                                    name="student_name"
                                    value={formData.student_name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all text-sm"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 px-2">Institution Name</label>
                                <input
                                    type="text"
                                    name="institute_name"
                                    value={formData.institute_name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all text-sm"
                                    placeholder="e.g. Raisoni University"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 px-2">Course Name</label>
                                <input
                                    type="text"
                                    name="course_name"
                                    value={formData.course_name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all text-sm"
                                    placeholder="e.g. B-tech AI"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 px-2">Cert ID</label>
                                    <input
                                        type="text"
                                        name="certificate_id"
                                        value={formData.certificate_id}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all text-sm"
                                        placeholder="CERT-001"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 px-2">Date</label>
                                    <input
                                        type="date"
                                        name="issue_date"
                                        value={formData.issue_date}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl bg-primary-dark border border-white/5 text-white focus:border-accent-pink outline-none transition-all text-sm flex-row-reverse"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheckIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span>Confirm & Issue on Blockchain</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {result && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                 <div className="flex items-center gap-2 mb-2">
                                     <CheckBadgeIcon className="w-4 h-4" />
                                     <span className="text-[10px] font-black uppercase tracking-widest">Transaction Confirmed</span>
                                 </div>
                                 <p className="text-[10px] font-mono break-all opacity-60 leading-relaxed tabular-nums">{result.certificate.blockchain_tx_hash}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Certificate Column */}
                <div className="lg:col-span-7 flex flex-col gap-6 sticky top-10 print:hidden">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Official Document View</h3>
                        {result && (
                            <div className="flex gap-4">
                                <button 
                                    onClick={async () => {
                                        const node = document.querySelector('.print-show-actual');
                                        if (node) {
                                            const dataUrl = await toPng(node, { 
                                                cacheBust: true, 
                                                quality: 1.0, 
                                                pixelRatio: 2 
                                            });
                                            saveAs(dataUrl, `cert-${result.certificate.student_name}.png`);
                                            toast.success('Certificate Downloaded as PNG');
                                        }
                                    }}
                                    className="text-[10px] font-black text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-emerald-500/10"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    DOWNLOAD PNG (FOR VERIFY)
                                </button>
                                <button 
                                    onClick={() => window.print()}
                                    className="text-[10px] font-black text-accent-pink border border-accent-pink/20 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-accent-pink/10"
                                >
                                    <AcademicCapIcon className="w-4 h-4" />
                                    PRINT / PDF
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-1 shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative aspect-[1.414/1] overflow-hidden print-show-actual">
                         <CertificateThumbnail certificate={{
                             student_name: formData.student_name || result?.certificate.student_name || "STUDENT NAME",
                             course_name: formData.course_name || result?.certificate.course_name || "COURSE NAME",
                             institute_name: formData.institute_name || result?.certificate.institute_name || "INSTITUTION NAME",
                             issue_date: formData.issue_date || result?.certificate.issue_date || "2024-01-01",
                             certificate_id: formData.certificate_id || result?.certificate.certificate_id || "CERT-000",
                             certificate_hash: result?.certificate.certificate_hash,
                             qr_code_path: result?.certificate.qr_code_path
                         }} />
                    </div>
                </div>
            </div>
            {/* Modal removed to avoid additional previews */}
        </motion.div>
    )
}

// My Certificates Page
const MyCertificatesPage = () => {
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCert, setSelectedCert] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await certificateService.getMyCertificates()
                setCertificates(response.data.items)
            } catch (error) {
                console.error('Failed to load certificates')
            } finally {
                setLoading(false)
            }
        }
        fetchCertificates()
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-12">Certification <span className="text-accent-pink">Ledger</span></h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="relative group">
                            <CertificateCard certificate={cert} />
                            <div className="absolute top-4 right-4 z-20">
                                <button 
                                    onClick={() => {
                                        setSelectedCert(cert)
                                        setIsModalOpen(true)
                                    }}
                                    className="p-3 bg-white/10 hover:bg-accent-pink text-white rounded-xl backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                                    title="View Full Certificate"
                                >
                                    <AcademicCapIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-20 rounded-[3rem] bg-white/[0.03] border border-white/5 text-center">
                    <PlusIcon className="w-12 h-12 mx-auto text-gray-700 mb-6" />
                    <p className="text-gray-500 font-bold">No issued certificates found</p>
                </div>
            )}

            <CertificateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                certificate={selectedCert} 
            />
        </motion.div>
    )
}

const InstitutionDashboard = () => {
    return (
        <Routes>
            <Route element={<InstitutionLayout />}>
                <Route index element={<InstitutionOverview />} />
                <Route path="issue" element={<IssueCertificatePage />} />
                <Route path="certificates" element={<MyCertificatesPage />} />
                <Route path="certificates/:id" element={<CertificateDetails />} />
            </Route>
        </Routes>
    )
}

export default InstitutionDashboard
