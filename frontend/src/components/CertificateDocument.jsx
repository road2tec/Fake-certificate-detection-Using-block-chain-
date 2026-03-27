import { motion } from 'framer-motion'
import { ShieldCheckIcon, AcademicCapIcon, QrCodeIcon } from '@heroicons/react/24/outline'

const CertificateDocument = ({ certificate }) => {
    if (!certificate) return null;

    const handlePrint = () => {
        window.print();
    }

    return (
        <div className="bg-white min-h-[800px] w-full max-w-5xl mx-auto p-12 border-[20px] border-double border-slate-200 relative shadow-2xl font-serif text-slate-900 print:shadow-none print:border-slate-300">
            {/* Elegant Corner Ornaments */}
            <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-accent-pink/30 rounded-tl-3xl"></div>
            <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-accent-pink/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-accent-pink/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-accent-pink/30 rounded-br-3xl"></div>

            {/* Header */}
            <div className="text-center mb-16 relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-accent-pink/5 flex items-center justify-center border-2 border-accent-pink/20">
                        <AcademicCapIcon className="w-12 h-12 text-accent-pink" />
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase mb-2 text-slate-900">Certificate of Achievement</h1>
                <p className="text-lg font-medium text-slate-500 uppercase tracking-[0.4em] italic">This is to certify that</p>
            </div>

            {/* Student Name */}
            <div className="text-center mb-16">
                <h2 className="text-6xl font-black text-slate-900 border-b-2 border-slate-100 inline-block px-12 py-4 mb-4 font-sans">
                    {certificate.student_name || 'STUDENT NAME'}
                </h2>
                <p className="text-xl text-slate-500">has successfully completed the requirements for the degree of</p>
            </div>

            {/* Course & Institute */}
            <div className="text-center mb-20">
                <h3 className="text-4xl font-bold text-slate-800 mb-2 font-sans tracking-tight">
                    {certificate.course_name || 'COURSE NAME'}
                </h3>
                <p className="text-slate-400 italic text-lg">Issued by</p>
                <h4 className="text-2xl font-black text-accent-pink uppercase tracking-widest mt-2">
                    {certificate.institute_name || 'INSTITUTION NAME'}
                </h4>
            </div>

            {/* Footer with QR and Signatures */}
            <div className="flex justify-between items-end px-12 border-t border-slate-100 pt-16">
                <div className="w-1/3 text-left">
                    <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-block group">
                        <img 
                            src={`http://localhost:8000${certificate.qr_code_path}`} 
                            alt="Verification QR" 
                            className="w-32 h-32 mix-blend-multiply" 
                            onError={(e) => {
                                e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + certificate.certificate_hash
                            }}
                        />
                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest text-center">Scan to Verify</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certificate ID</p>
                        <p className="text-xs font-mono font-bold text-slate-600">{certificate.certificate_id || 'CERT-000000'}</p>
                    </div>
                </div>

                <div className="w-1/3 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                            <ShieldCheckIcon className="w-10 h-10 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Blockchain Verified</p>
                        <p className="text-[9px] text-slate-400 mt-1 max-w-[150px] leading-relaxed">
                            Secured via Ethereum Ledger Integrity Protocol
                        </p>
                    </div>
                </div>

                <div className="w-1/3 text-right">
                    <div className="mb-12 border-b-2 border-slate-200 inline-block px-12 pb-2">
                        <p className="font-serif italic text-2xl text-slate-700">Digital Signature</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Office of the Registrar</p>
                    <p className="text-[10px] text-slate-400 font-medium">Issue Date: {certificate.issue_date || 'N/A'}</p>
                </div>
            </div>

            {/* Blockchain Details Overlay (Subtle) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
                <ShieldCheckIcon className="w-[600px] h-[600px] text-slate-900" />
            </div>

            {/* Print Button (Hidden during print) */}
            <div className="absolute -top-16 right-0 print:hidden flex gap-4">
                <button 
                    onClick={handlePrint}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download PDF / Print
                </button>
            </div>
        </div>
    )
}

const ArrowDownTrayIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
)

export default CertificateDocument
