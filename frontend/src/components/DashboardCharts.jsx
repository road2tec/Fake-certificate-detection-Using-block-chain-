import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const mockActivityData = [
    { name: 'Mon', verifications: 400, registrations: 240 },
    { name: 'Tue', verifications: 300, registrations: 139 },
    { name: 'Wed', verifications: 200, registrations: 980 },
    { name: 'Thu', verifications: 278, registrations: 390 },
    { name: 'Fri', verifications: 189, registrations: 480 },
    { name: 'Sat', verifications: 239, registrations: 380 },
    { name: 'Sun', verifications: 349, registrations: 430 },
];

const mockPieData = [
    { name: 'Authentic', value: 400 },
    { name: 'Suspicious', value: 40 },
    { name: 'Counterfeit', value: 20 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export const ActivityChart = ({ data = mockActivityData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl h-96 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/5 blur-3xl opacity-50"></div>
            <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Infrastructure Activity</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d53369" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#d53369" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }}
                    />
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <Tooltip
                        contentStyle={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="verifications" stroke="#d53369" strokeWidth={3} fillOpacity={1} fill="url(#colorVerifications)" />
                    <Area type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRegistrations)" />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export const VerificationPieChart = ({ data = mockPieData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl h-96 flex flex-col relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-50"></div>
            <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Security Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        cornerRadius={10}
                        paddingAngle={8}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Safe</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Warning</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Fake</span></div>
            </div>
        </motion.div>
    );
};
