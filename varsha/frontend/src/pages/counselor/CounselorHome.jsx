import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    CalendarCheck,
    HourglassIcon,
    MessageSquare,
    Award
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import AppointmentTimeline from '../../components/AppointmentTimeline';
import AchievementBadges from '../../components/AchievementBadges';
import QuickConnectPanel from '../../components/QuickConnectPanel';
import GlassCard from '../../components/GlassCard';
import WelcomeSection from '../../components/WelcomeSection';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CounselorHome = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/counselor/bookings', { withCredentials: true });
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const totalBookings = (bookings || []).length;
    const pendingBookings = (bookings || []).filter(b => b.status === 'pending').length;
    const completedBookings = (bookings || []).filter(b => b.status === 'completed').length;
    const upcomingBookings = (bookings || []).filter(b => b.status === 'approved').length;

    const dashboardStats = {
        sessionsThisWeek: (bookings || []).filter(b => {
            if (!b.slot?.dateTime) return false;
            const bookingDate = new Date(b.slot.dateTime);
            const today = new Date();
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return b.status === 'completed' && bookingDate >= weekAgo && bookingDate <= today;
        }).length,
        streak: 5, // Placeholder
    };

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
            <WelcomeSection user={user} stats={dashboardStats} />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={CheckCircle2} label="Completed Sessions" value={completedBookings} trend={8} color="emerald" />
                <StatCard icon={CalendarCheck} label="Upcoming" value={upcomingBookings} color="emerald" />
                <StatCard icon={HourglassIcon} label="Pending Requests" value={pendingBookings} color="amber" />
                <StatCard icon={MessageSquare} label="New Messages" value={3} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Appointment Timeline */}
                <div className="lg:col-span-8">
                    <AppointmentTimeline appointments={bookings.filter(b => b.status === 'approved')} />
                </div>

                {/* Achievements/Milestones */}
                <div className="lg:col-span-4 space-y-8">
                    <AchievementBadges />
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="text-emerald-500" size={20} />
                            Performance Insight
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Student Satisfaction</span>
                                <span className="font-bold text-emerald-600">98%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-[98%] bg-emerald-500 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-400 italic">"Consistently positive feedback on communication style."</p>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <QuickConnectPanel />
        </motion.div>
    );
};

export default CounselorHome;
