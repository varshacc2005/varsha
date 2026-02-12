import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    UserCheck,
    HourglassIcon,
    CheckCircle2,
    Activity,
    Shield
} from 'lucide-react';
import WelcomeSection from '../../components/WelcomeSection';
import StatCard from '../../components/StatCard';
import QuickConnectPanel from '../../components/QuickConnectPanel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GlassCard from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        monthlyData: [],
        pendingBookings: 0,
        approvedBookings: 0,
        declinedBookings: 0,
        completedBookings: 0,
        totalUsers: 0,
        totalCounselors: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats', { withCredentials: true });
            setStats(res.data);
        } catch (err) {
            console.error(err);
            // Fallback data
            setStats({
                totalUsers: 120,
                totalCounselors: 15,
                totalBookings: 342,
                pendingBookings: 8,
                approvedBookings: 45,
                declinedBookings: 12,
                completedBookings: 280,
                monthlyData: [
                    { name: 'Jan', bookings: 40 },
                    { name: 'Feb', bookings: 30 },
                    { name: 'Mar', bookings: 20 },
                    { name: 'Apr', bookings: 27 },
                    { name: 'May', bookings: 18 },
                    { name: 'Jun', bookings: 23 },
                    { name: 'Jul', bookings: 34 },
                ]
            });
        }
    };

    const pieData = [
        { name: 'Pending', value: stats.pendingBookings || 0, color: '#F59E0B' },
        { name: 'Approved', value: stats.approvedBookings || 0, color: '#10B981' },
        { name: 'Declined', value: stats.declinedBookings || 0, color: '#EF4444' },
        { name: 'Completed', value: stats.completedBookings || 0, color: '#6366F1' },
    ].filter(d => d.value > 0);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
        >
            <WelcomeSection user={user} stats={{
                sessionsThisWeek: stats.completedBookings || 0,
                streak: 100, // System Uptime or similar metric
            }} />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Students" value={stats.totalUsers || 0} trend={5} color="amber" />
                <StatCard icon={UserCheck} label="Active Counselors" value={stats.totalCounselors || 0} color="emerald" />
                <StatCard icon={HourglassIcon} label="Pending Reviews" value={stats.pendingBookings || 0} color="amber" />
                <StatCard icon={CheckCircle2} label="Sessions Completed" value={stats.completedBookings || 0} color="indigo" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Monthly Activity Chart */}
                <GlassCard className="lg:col-span-8 p-6" hoverEffect={false}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={24} /></div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">System Activity</h3>
                                <p className="text-sm text-gray-500">Monthly booking volume</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '16px', border: 'none', backdropFilter: 'blur(8px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                                    {stats.monthlyData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === stats.monthlyData.length - 1 ? '#4F46E5' : '#C7D2FE'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Booking Status Distribution */}
                <GlassCard className="lg:col-span-4 p-6" hoverEffect={false}>
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <Shield className="text-indigo-500" size={24} />
                        Booking Status
                    </h3>
                    <div className="h-[250px] flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {pieData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <QuickConnectPanel />
        </motion.div>
    );
};

export default AdminHome;
