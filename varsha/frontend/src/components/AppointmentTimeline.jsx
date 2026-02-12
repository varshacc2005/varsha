import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, User } from 'lucide-react';
import GlassCard from './GlassCard';

const AppointmentTimeline = ({ appointments = [] }) => {
    // Mock data if none provided
    const timelineData = appointments.length > 0 ? appointments : [
        { id: 1, title: 'Career Guidance', counselor: 'Dr. Sarah Smith', date: '2023-11-20', time: '10:00 AM', status: 'upcoming' },
        { id: 2, title: 'Stress Management', counselor: 'Prof. James Wilson', date: '2023-11-22', time: '02:30 PM', status: 'upcoming' },
        { id: 3, title: 'Study Habits', counselor: 'Dr. Sarah Smith', date: '2023-11-25', time: '11:00 AM', status: 'pending' },
    ];

    return (
        <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Calendar size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Upcoming Timeline</h3>
                    <p className="text-sm text-gray-500">Your scheduled sessions and milestones.</p>
                </div>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                <div className="space-y-8">
                    {timelineData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-12 group cursor-pointer"
                        >
                            {/* Node */}
                            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-125 ${item.status === 'upcoming' ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                <Clock size={12} className="text-white" />
                            </div>

                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/5 transition-all duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <User size={12} />
                                            <span className="font-medium">{item.counselor}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-indigo-500 uppercase">{item.time}</span>
                                        <span className="block text-xs font-medium text-gray-400 mt-1">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ChevronRight size={14} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-indigo-500/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Next Session Starts In</p>
                        <p className="text-xl font-black">02:45:12</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-soft hover:bg-gray-50 transition-colors">
                    Join Waiting Room
                </button>
            </div>
        </GlassCard>
    );
};

export default AppointmentTimeline;
