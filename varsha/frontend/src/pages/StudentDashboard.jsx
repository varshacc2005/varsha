import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ChatComponent from '../components/ChatComponent';
import CounselorCard from '../components/CounselorCard';
import ConfirmationModal from '../components/ConfirmationModal';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Clock, MessageSquare, ChevronRight, User, GraduationCap, BookOpen, Target, Smile, Phone, Mail, CalendarCheck, HourglassIcon, CheckCircle2 } from 'lucide-react';
import WelcomeSection from '../components/WelcomeSection';
import StatCard from '../components/StatCard';
import MoodTracker from '../components/MoodTracker';
import AppointmentTimeline from '../components/AppointmentTimeline';
import GoalTracker from '../components/GoalTracker';
import QuickConnectPanel from '../components/QuickConnectPanel';
import ResourceRecommendations from '../components/ResourceRecommendations';
import AchievementBadges from '../components/AchievementBadges';

const StudentDashboard = ({ defaultTab = 'dashboard' }) => {
    const { user, login } = useAuth();
    const [counselors, setCounselors] = useState([]);
    const [filteredCounselors, setFilteredCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSkill, setFilterSkill] = useState('');
    const [filterLanguage, setFilterLanguage] = useState('');

    // Booking state
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Chat state
    const [showChat, setShowChat] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    // Profile State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    useEffect(() => {
        fetchCounselors();
        fetchMyBookings();
    }, []);

    useEffect(() => {
        filterCounselors();
    }, [searchTerm, filterSkill, filterLanguage, counselors]);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    const fetchCounselors = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/student/counselors', { withCredentials: true });
            setCounselors(res.data);
            setFilteredCounselors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/student/bookings', { withCredentials: true });
            setMyBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filterCounselors = () => {
        let result = counselors;
        if (searchTerm) {
            result = result.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterSkill) {
            result = result.filter(c => c.skills && Array.isArray(c.skills) && c.skills.some(s => s.toLowerCase().includes(filterSkill.toLowerCase())));
        }
        if (filterLanguage) {
            result = result.filter(c => c.languages && Array.isArray(c.languages) && c.languages.some(l => l.toLowerCase().includes(filterLanguage.toLowerCase())));
        }
        setFilteredCounselors(result);
    };

    const handleSelectCounselor = async (counselor) => {
        setSelectedCounselor(counselor);
        setSlots([]);
        try {
            const res = await axios.get(`http://localhost:5000/api/student/counselors/${counselor._id}/slots`, { withCredentials: true });
            setSlots(res.data.filter(s => !s.isBooked));
        } catch (err) {
            toast.error('Failed to load slots');
        }
    };

    const initiateBooking = (slot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const confirmBooking = async () => {
        setIsModalOpen(false);
        try {
            await axios.post('http://localhost:5000/api/student/bookings', {
                counselorId: selectedCounselor._id,
                slotId: selectedSlot._id,
            }, { withCredentials: true });
            toast.success('Slot booking request sent! Awaiting approval.');
            fetchMyBookings();
            handleSelectCounselor(selectedCounselor);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        }
    };

    const openChat = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowChat(true);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/api/student/profile', profile, { withCredentials: true });
            toast.success('Profile updated successfully');
            setIsEditingProfile(false);
            login(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const allSkills = [...new Set(counselors.flatMap(c => c.skills || []))];
    const allLanguages = [...new Set(counselors.flatMap(c => c.languages || []))];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // Calculate dashboard stats
    const dashboardStats = {
        sessionsThisWeek: (myBookings || []).filter(b => {
            if (!b.slot?.dateTime) return false;
            const bookingDate = new Date(b.slot.dateTime);
            const today = new Date();
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return b.status === 'completed' && bookingDate >= weekAgo && bookingDate <= today;
        }).length,
        streak: 3, // Placeholder - would calculate from user activity
    };

    const totalSessionsAttended = (myBookings || []).filter(b => b.status === 'completed').length;
    const upcomingAppointments = (myBookings || []).filter(b => b.status === 'approved' && b.slot?.dateTime && new Date(b.slot.dateTime) > new Date()).length;
    const pendingRequests = (myBookings || []).filter(b => b.status === 'pending').length;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <WelcomeSection user={user} stats={dashboardStats} />

            {activeTab === 'dashboard' && (
                <AnimatePresence mode="wait">
                    {isEditingProfile ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <GlassCard className="max-w-3xl mx-auto p-8 relative overflow-visible">
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><User size={24} /></div>
                                        Edit Profile
                                    </h3>
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                                <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                <input type="email" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-100/50 text-gray-500 cursor-not-allowed" value={profile.email || ''} disabled />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                                <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                                            </div>

                                            {/* Academic Info */}
                                            <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                                                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Academic Details</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Education/Degree</label>
                                                        <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.education || ''} onChange={(e) => setProfile({ ...profile, education: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">College/University</label>
                                                        <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.college || ''} onChange={(e) => setProfile({ ...profile, college: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Course/Major</label>
                                                        <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.course || ''} onChange={(e) => setProfile({ ...profile, course: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Year/Semester</label>
                                                        <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.year || ''} onChange={(e) => setProfile({ ...profile, year: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Personal Info */}
                                            <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                                                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Personal Goals</h4>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Area of Interest</label>
                                                        <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.areaOfInterest || ''} onChange={(e) => setProfile({ ...profile, areaOfInterest: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Goal</label>
                                                        <textarea rows={3} className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.goal || ''} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Mood / Mindset</label>
                                                        <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" value={profile.mood || ''} onChange={(e) => setProfile({ ...profile, mood: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                                            <AnimatedButton variant="secondary" onClick={() => setIsEditingProfile(false)} className="flex-1">
                                                Cancel
                                            </AnimatedButton>
                                            <AnimatedButton type="submit" variant="primary" className="flex-1">
                                                Save Changes
                                            </AnimatedButton>
                                        </div>
                                    </form>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {/* Smart Overview Cards */}
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={CheckCircle2}
                                        label="Sessions Attended"
                                        value={totalSessionsAttended}
                                        trend={12}
                                        color="indigo"
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={CalendarCheck}
                                        label="Upcoming Appointments"
                                        value={upcomingAppointments}
                                        color="emerald"
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={HourglassIcon}
                                        label="Pending Requests"
                                        value={pendingRequests}
                                        color="amber"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Middle Section: Timeline and Goals */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <motion.div variants={itemVariants} className="lg:col-span-7">
                                    <AppointmentTimeline appointments={myBookings} />
                                </motion.div>
                                <motion.div variants={itemVariants} className="lg:col-span-5">
                                    <GoalTracker />
                                </motion.div>
                            </div>

                            {/* Focus Section: Mood Tracking */}
                            <motion.div variants={itemVariants}>
                                <MoodTracker />
                            </motion.div>

                            {/* Achievement & Gamification */}
                            <motion.div variants={itemVariants}>
                                <AchievementBadges />
                            </motion.div>

                            {/* Intelligent Recommendations */}
                            <motion.div variants={itemVariants}>
                                <ResourceRecommendations interests={user?.interests} />
                            </motion.div>

                            {/* Profile Info (Keep as secondary or link from welcome) */}
                            {/* Floating Quick Connect */}
                            <QuickConnectPanel />
                        </div>
                    )}
                </AnimatePresence>
            )}

            {activeTab === 'find-counselors' && (
                <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
                    {/* Search & List */}
                    <div className="lg:col-span-5 flex flex-col h-full gap-6">
                        {/* Filters */}
                        <GlassCard className="p-4 space-y-4 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                                        value={filterSkill}
                                        onChange={(e) => setFilterSkill(e.target.value)}
                                    >
                                        <option value="">All Skills</option>
                                        {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                                        value={filterLanguage}
                                        onChange={(e) => setFilterLanguage(e.target.value)}
                                    >
                                        <option value="">All Languages</option>
                                        {allLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </GlassCard>

                        {/* List */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4"
                        >
                            {filteredCounselors.map((counselor) => (
                                <motion.div key={counselor._id} variants={itemVariants}>
                                    <CounselorCard
                                        counselor={counselor}
                                        onSelect={handleSelectCounselor}
                                        isSelected={selectedCounselor?._id === counselor._id}
                                    />
                                </motion.div>
                            ))}
                            {filteredCounselors.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <Search size={40} className="mb-3 opacity-20" />
                                    <p>No counselors found matching your criteria.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Detail & Slots */}
                    <div className="lg:col-span-7 h-full flex flex-col">
                        <GlassCard className="flex-1 p-8 flex flex-col relative overflow-hidden" hoverEffect={false}>
                            {selectedCounselor ? (
                                <>
                                    <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none" />
                                    <div className="relative z-10 flex gap-6 mb-8">
                                        <motion.img
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            src={selectedCounselor.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                            alt={selectedCounselor.name}
                                            className="w-32 h-32 rounded-2xl object-cover bg-gray-100 shadow-lg ring-4 ring-white"
                                        />
                                        <div className="flex-1 pt-2">
                                            <motion.h2
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-3xl font-bold text-gray-900 mb-1"
                                            >
                                                {selectedCounselor.name}
                                            </motion.h2>
                                            <p className="text-indigo-600 font-semibold text-lg mb-4">{selectedCounselor.specialization}</p>
                                            <div className="flex gap-2 mb-4">
                                                {selectedCounselor.skills?.map(skill => (
                                                    <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mb-8 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About</h4>
                                        <p className="text-gray-600 leading-relaxed text-sm">{selectedCounselor.bio || "No bio available."}</p>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col border-t border-gray-100 pt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Calendar className="text-indigo-500" size={20} />
                                            Available Slots
                                        </h3>

                                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                                            {slots.length > 0 ? (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {slots.map((slot) => (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            key={slot._id}
                                                            onClick={() => initiateBooking(slot)}
                                                            className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 group"
                                                        >
                                                            <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1 group-hover:text-indigo-100">
                                                                {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-sm font-black">
                                                                {slot.startTime}
                                                            </span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                                                    <Calendar size={32} className="mb-2 opacity-50" />
                                                    <p className="font-medium">No available slots</p>
                                                    <p className="text-xs">Try selecting another counselor</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <Search className="text-4xl text-indigo-200" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-300">Select a counselor</p>
                                    <p className="text-sm text-gray-400">View profile details and availability</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            )}

            {activeTab === 'my-bookings' && (
                <div className="max-w-5xl mx-auto">
                    <GlassCard className="rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500"><Calendar size={20} /></div>
                            <h3 className="text-lg font-bold text-gray-900">Your Scheduled Sessions</h3>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {myBookings.map((booking) => (
                                <li key={booking._id} className="p-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={booking.counselorId?.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                    alt="Counselor"
                                                    className="w-14 h-14 rounded-2xl object-cover bg-gray-100 shadow-sm group-hover:shadow-md transition-all"
                                                />
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${booking.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {booking.counselorId?.name || 'Unknown Counselor'}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        <span>{new Date(booking.slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={14} className="text-gray-400" />
                                                        <span>{booking.slot.startTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${booking.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                {booking.status}
                                            </span>
                                            {booking.status === 'approved' && (
                                                <AnimatedButton
                                                    variant="secondary"
                                                    onClick={() => openChat(booking._id)}
                                                    className="!py-2 !px-4 text-xs font-bold"
                                                    icon={MessageSquare}
                                                >
                                                    Chat
                                                </AnimatedButton>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {myBookings.length === 0 && (
                                <li className="py-16 text-center text-gray-400 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Calendar size={32} className="opacity-50" />
                                    </div>
                                    <p className="font-medium">You haven&apos;t booked any sessions yet.</p>
                                </li>
                            )}
                        </ul>
                    </GlassCard>
                </div>
            )}

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmBooking}
                title="Confirm Booking"
                message={`Are you sure you want to book a session with ${selectedCounselor?.name} on ${selectedSlot ? new Date(selectedSlot.date).toLocaleDateString() : ''} at ${selectedSlot?.startTime}?`}
                confirmText="Yes, Book It"
            />

            {showChat && selectedBookingId && (
                <ChatComponent bookingId={selectedBookingId} onClose={() => setShowChat(false)} />
            )}
        </div>
    );
};

export default StudentDashboard;
