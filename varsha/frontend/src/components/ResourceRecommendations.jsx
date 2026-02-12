import { motion } from 'framer-motion';
import { BookOpen, Video, Users, ChevronRight, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

const ResourceRecommendations = ({ interests = [] }) => {
    const resources = [
        { id: 1, title: 'Mastering Mindfulness', type: 'Article', duration: '5 min read', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 2, title: 'Dealing with Academic Stress', type: 'Video', duration: '12 min', icon: Video, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 3, title: 'Group Support: Fear of Failure', type: 'Workshop', duration: 'Sat, 11 AM', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <GlassCard className="p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
                    <p className="text-sm text-gray-500">Curated based on your interests and mood.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res, index) => (
                    <motion.div
                        key={res.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="group cursor-pointer"
                    >
                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/5 transition-all duration-300">
                            <div className={`${res.bg} ${res.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                <res.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{res.type}</span>
                            <h4 className="font-extrabold text-gray-900 mt-1 mb-2 group-hover:text-indigo-600 transition-colors">{res.title}</h4>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs font-bold text-gray-500">{res.duration}</span>
                                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 text-indigo-600">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300">
                Explore All Resources
            </button>
        </GlassCard>
    );
};

export default ResourceRecommendations;
