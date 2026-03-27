import { ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

const CertificateThumbnail = ({ certificate }) => {
    if (!certificate) return null;

    return (
        <div className="bg-white rounded-3xl p-6 border-[12px] border-double border-slate-100 relative shadow-inner font-serif text-slate-800 h-full overflow-hidden select-none">
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-accent-pink/20 rounded-tl-xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-accent-pink/20 rounded-tr-xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-accent-pink/20 rounded-bl-xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-accent-pink/20 rounded-br-xl"></div>

            <div className="text-center mb-4">
                <AcademicCapIcon className="w-8 h-8 mx-auto text-accent-pink/40 mb-1" />
                <h4 className="text-[14px] font-black uppercase tracking-tight text-slate-900 leading-none">Certificate</h4>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1 italic">of achievement</p>
            </div>

            <div className="text-center mb-6">
                <p className="text-[7px] text-slate-400 uppercase tracking-widest leading-none mb-1">To certify that</p>
                <h2 className="text-xl font-black text-slate-900 truncate px-2 font-sans">{certificate.student_name || 'STUDENT'}</h2>
            </div>

            <div className="text-center mb-6">
                <p className="text-[7px] text-slate-400 mb-1">completed requirements for</p>
                <h3 className="text-xs font-bold text-slate-800 px-2 truncate leading-tight">{certificate.course_name || 'COURSE'}</h3>
                <p className="text-[8px] text-accent-pink font-black uppercase mt-1 tracking-widest">{certificate.institute_name || 'INSTITUTE'}</p>
            </div>

            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                    <div className="p-3 bg-white rounded-xl shadow-lg flex items-center justify-center border border-slate-100">
                       <img 
                            src={`http://localhost:8000${certificate.qr_code_path}`} 
                            alt="QR" 
                            className="w-20 h-20 object-contain block" 
                            crossOrigin="anonymous"
                            onError={(e) => {
                                e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + certificate.certificate_hash
                            }}
                        />
                    </div>
                <div className="text-center flex flex-col items-center">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-500/40" />
                    <span className="text-[6px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                </div>
                <div className="text-right">
                   <div className="w-10 h-0.5 bg-slate-100 mb-1"></div>
                   <p className="text-[6px] text-slate-400 uppercase font-bold">Registrar</p>
                </div>
            </div>

            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02]">
                <ShieldCheckIcon className="w-32 h-32 text-slate-900" />
            </div>
        </div>
    )
}

export default CertificateThumbnail
