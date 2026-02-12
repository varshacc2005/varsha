import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Calendar
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import axios from 'axios';
import { toast } from 'react-toastify';

const CounselorAvailability = () => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState(30);

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/counselor/slots', {
                date, startTime, endTime, duration
            }, { withCredentials: true });
            toast.success('Availability slots generated successfully!');
            setDate(''); setStartTime(''); setEndTime('');
        } catch (err) {
            toast.error('Failed to add slots');
        }
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
            className="grid lg:grid-cols-3 gap-8"
        >
            <div className="lg:col-span-1">
                <GlassCard className="p-8 sticky top-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Clock size={24} /></div>
                        <h3 className="text-xl font-bold text-gray-900">Set Availability</h3>
                    </div>
                    <form onSubmit={handleAddSlot} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                            <input type="date" required className="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 bg-gray-50/50" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                                <input type="time" required className="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 bg-gray-50/50" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">End Time</label>
                                <input type="time" required className="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 bg-gray-50/50" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 bg-gray-50/50">
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="45">45 Minutes</option>
                                <option value="60">1 Hour</option>
                            </select>
                        </div>
                        <AnimatedButton
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30"
                            icon={Calendar}
                        >
                            Generate Slots
                        </AnimatedButton>
                    </form>
                </GlassCard>
            </div>
            <div className="lg:col-span-2">
                <GlassCard className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <Calendar size={48} className="text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Your Calendar</h3>
                    <p className="text-gray-500 max-w-md">Use the form to add new availability slots. Your students will be able to book these slots immediately.</p>
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default CounselorAvailability;
