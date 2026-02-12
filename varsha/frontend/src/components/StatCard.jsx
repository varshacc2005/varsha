import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import GlassCard from './GlassCard';

const StatCard = ({ icon: Icon, label, value, trend, color = 'indigo' }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, value, { duration: 2, ease: "easeOut" });
        return controls.stop;
    }, [value, count]);

    const colorClasses = {
        indigo: 'from-indigo-500 to-purple-500 shadow-indigo-500/30',
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/30',
        amber: 'from-amber-500 to-orange-500 shadow-amber-500/30',
        pink: 'from-pink-500 to-rose-500 shadow-pink-500/30',
    };

    const backgroundColors = {
        indigo: 'bg-indigo-100',
        emerald: 'bg-emerald-100',
        amber: 'bg-amber-100',
        pink: 'bg-pink-100',
    };

    const iconColors = {
        indigo: 'text-indigo-600',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600',
        pink: 'text-pink-600',
    };

    return (
        <GlassCard className="p-6 relative overflow-hidden group" hoverEffect={true}>
            {/* Background gradient blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${backgroundColors[color]} ${iconColors[color]}`}>
                        <Icon size={24} strokeWidth={2.5} />
                    </div>
                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {trend > 0 ? '+' : ''}{trend}%
                        </motion.div>
                    )}
                </div>

                <div className="space-y-1">
                    <motion.p className="text-3xl font-extrabold text-gray-900">
                        {rounded}
                    </motion.p>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                </div>
            </div>
        </GlassCard>
    );
};

export default StatCard;
