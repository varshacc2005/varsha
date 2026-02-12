import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle2, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';

const GoalTracker = () => {
    const goals = [
        { id: 1, title: 'Improve Communication Skills', progress: 45, nextMilestone: 'Attend workshop', color: 'bg-blue-500' },
        { id: 2, title: 'Reduce Exam Anxiety', progress: 70, nextMilestone: 'Weekly review', color: 'bg-emerald-500' },
        { id: 3, title: 'Build Self-Confidence', progress: 25, nextMilestone: 'Read recommendation', color: 'bg-purple-500' },
    ];

    return (
        <GlassCard className="p-8 h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Personal Goals</h3>
                        <p className="text-sm text-gray-500">Track your growth and milestones.</p>
                    </div>
                </div>
                <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-8">
                {goals.map((goal, index) => (
                    <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3 cursor-pointer group"
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{goal.title}</h4>
                            <span className="text-sm font-bold text-gray-500">{goal.progress}%</span>
                        </div>

                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full ${goal.color} rounded-full`}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="flex items-center gap-1.5 text-gray-500 font-medium italic">
                                Next: <span className="text-gray-900 not-italic font-bold">{goal.nextMilestone}</span>
                            </span>
                            <div className="flex items-center gap-1 text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                Details <ChevronRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Recent Milestone</p>
                        <p className="text-xs text-emerald-700 font-medium">Completed "Initial Assessment" phase. +50 XP</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default GoalTracker;
