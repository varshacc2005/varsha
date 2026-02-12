import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    List,
    Calendar,
    Clock,
    Check,
    X,
    MessageSquare
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import ChatComponent from '../../components/ChatComponent';
import axios from 'axios';
import { toast } from 'react-toastify';

const CounselorBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

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

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/counselor/bookings/${id}`, { status }, { withCredentials: true });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const openChat = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowChat(true);
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
        >
            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-emerald-50/30 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600"><List size={20} /></div>
                    <h3 className="text-xl font-bold text-gray-900">Session Requests</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                        <li key={booking._id} className="p-6 hover:bg-emerald-50/20 transition-colors">
                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                                        {booking.studentId?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-bold text-gray-900">{booking.studentId?.name}</h4>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${booking.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">{booking.studentId?.email}</p>
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-emerald-500" />
                                                <span>{new Date(booking.slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-emerald-500" />
                                                <span>{booking.slot.startTime} - {booking.slot.endTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {booking.status === 'pending' ? (
                                        <>
                                            <AnimatedButton
                                                variant="success"
                                                onClick={() => handleStatusUpdate(booking._id, 'approved')}
                                                className="!py-2 !px-4 text-xs"
                                                icon={Check}
                                            >
                                                Approve
                                            </AnimatedButton>
                                            <AnimatedButton
                                                variant="danger"
                                                onClick={() => handleStatusUpdate(booking._id, 'declined')}
                                                className="!py-2 !px-4 text-xs"
                                                icon={X}
                                            >
                                                Decline
                                            </AnimatedButton>
                                        </>
                                    ) : booking.status === 'approved' ? (
                                        <AnimatedButton
                                            variant="primary"
                                            onClick={() => openChat(booking._id)}
                                            className="!py-2 !px-4 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30"
                                            icon={MessageSquare}
                                        >
                                            Chat
                                        </AnimatedButton>
                                    ) : null}
                                </div>
                            </div>
                        </li>
                    ))}
                    {bookings.length === 0 && (
                        <li className="py-16 text-center text-gray-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <List size={32} className="opacity-50" />
                            </div>
                            <p className="font-medium">No bookings yet.</p>
                        </li>
                    )}
                </ul>
            </GlassCard>

            {showChat && selectedBookingId && (
                <ChatComponent bookingId={selectedBookingId} onClose={() => setShowChat(false)} />
            )}
        </motion.div>
    );
};

export default CounselorBookings;
