import { motion } from 'framer-motion';
import { Award, Trophy, Star, ShieldCheck, Flame } from 'lucide-react';
import GlassCard from './GlassCard';

const AchievementBadges = () => {
    const badges = [
        { id: 1, label: 'Early Bird', detail: '1st Session Done', icon: Star, color: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/40' },
        { id: 2, label: 'Committed', detail: '5 Sessions Hit', icon: Trophy, color: 'from-blue-400 to-indigo-600', glow: 'shadow-indigo-500/40' },
        { id: 3, label: 'Unstoppable', detail: '7 Day Streak', icon: Flame, color: 'from-red-400 to-rose-600', glow: 'shadow-rose-500/40' },
        { id: 4, label: 'Fearless', detail: 'Goal Achiever', icon: ShieldCheck, color: 'from-emerald-400 to-teal-600', glow: 'shadow-emerald-500/40' },
    ];

    return (
        <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Award size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
                    <p className="text-sm text-gray-500">Celebrating your progress milestones.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            delay: index * 0.1
                        }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className={`
                            w-20 h-20 rounded-3xl bg-gradient-to-br ${badge.color} 
                            flex items-center justify-center text-white shadow-xl ${badge.glow}
                            mb-4 relative overflow-hidden group-hover:rotate-12 transition-transform duration-500
                        `}>
                            {/* Inner Shine */}
                            <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700" />
                            <badge.icon size={36} />
                        </div>
                        <h4 className="font-black text-gray-900 text-sm tracking-tight">{badge.label}</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">{badge.detail}</p>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
};

export default AchievementBadges;
