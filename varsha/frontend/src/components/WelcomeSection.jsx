import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';

const WelcomeSection = ({ user, stats = {} }) => {
    // Dynamic greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Motivational quotes pool
    const motivationalQuotes = [
        "Your mental health journey matters. Take it one step at a time.",
        "Progress, not perfection. You're doing great!",
        "Every conversation is a step toward growth.",
        "Your well-being is worth the investment.",
        "Small steps lead to big transformations.",
    ];

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    // Calculate profile completion based on role
    const calculateProfileCompletion = () => {
        let completion = 0;
        const studentFields = ['name', 'email', 'interests', 'grade', 'school'];
        const counselorFields = ['name', 'email', 'specialization', 'bio', 'experience'];
        const adminFields = ['name', 'email'];
        const fields = user?.role === 'admin' ? adminFields : (user?.role === 'counselor' ? counselorFields : studentFields);

        fields.forEach(field => {
            if (user?.[field]) completion += (100 / fields.length);
        });
        return Math.round(completion);
    };

    const profileCompletion = calculateProfileCompletion();
    const sessionsThisWeek = stats.sessionsThisWeek || 0;
    const streak = stats.streak || 0;

    // Circle progress for profile completion
    const circumference = 2 * Math.PI * 40; // radius = 40
    const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

    return (
        <GlassCard className={`p-8 mb-8 relative overflow-hidden ${user?.role === 'admin' ? 'border-amber-500/20' :
                user?.role === 'counselor' ? 'border-emerald-500/20' :
                    'border-indigo-500/20'
            }`}>
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${user?.role === 'admin' ? 'from-amber-500/5 via-orange-500/5 to-red-500/5' :
                    user?.role === 'counselor' ? 'from-emerald-500/5 via-teal-500/5 to-cyan-500/5' :
                        'from-indigo-500/5 via-purple-500/5 to-pink-500/5'
                } animate-pulse`}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left: Greeting & Quote */}
                <div className="flex-1 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            {getGreeting()}, <span className={`text-transparent bg-clip-text bg-gradient-to-r ${user?.role === 'admin' ? 'from-amber-600 to-orange-600' :
                                    user?.role === 'counselor' ? 'from-emerald-600 to-teal-600' :
                                        'from-indigo-600 to-purple-600'
                                }`}>
                                {user?.role === 'admin' ? `Admin ${user?.name?.split(' ')[0]}` :
                                    user?.role === 'counselor' ? `Dr. ${user?.name?.split(' ')[0]}` :
                                        user?.name?.split(' ')[0] || 'Student'}
                            </span>
                            <Sparkles className="text-yellow-500" size={28} />
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-gray-600 text-lg italic"
                    >
                        "{randomQuote}"
                    </motion.p>

                    {sessionsThisWeek > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 text-emerald-700 font-semibold"
                        >
                            <TrendingUp size={20} />
                            <span>You've completed {sessionsThisWeek} session{sessionsThisWeek > 1 ? 's' : ''} this week!</span>
                        </motion.div>
                    )}
                </div>

                {/* Right: Stats Mini Cards */}
                <div className="flex gap-4">
                    {/* Profile Completion Ring */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative w-24 h-24">
                            <svg className="transform -rotate-90 w-24 h-24">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="#E5E7EB"
                                    strokeWidth="6"
                                    fill="none"
                                />
                                <motion.circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="url(#gradient)"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeDasharray={circumference}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={
                                            user?.role === 'admin' ? '#F59E0B' :
                                                user?.role === 'counselor' ? '#10B981' :
                                                    '#6366F1'
                                        } />
                                        <stop offset="100%" stopColor={
                                            user?.role === 'admin' ? '#EA580C' :
                                                user?.role === 'counselor' ? '#0D9488' :
                                                    '#A855F7'
                                        } />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">{profileCompletion}%</span>
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 mt-2">Profile</p>
                    </motion.div>

                    {/* Streak Counter */}
                    {streak > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg shadow-amber-500/30 text-white"
                        >
                            <div className="text-3xl font-extrabold">{streak}</div>
                            <div className="text-xs font-bold uppercase tracking-wide">Day Streak</div>
                            <div className="text-2xl mt-1">🔥</div>
                        </motion.div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};

export default WelcomeSection;
