import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Sun, Zap, Brain, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedButton from './AnimatedButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTracker = () => {
    const [mood, setMood] = useState(3); // 1-5 scale
    const [stress, setStress] = useState(50); // 0-100
    const [energy, setEnergy] = useState(50); // 0-100
    const [isLogged, setIsLogged] = useState(false);

    const moodData = [
        { day: 'Mon', mood: 3 },
        { day: 'Tue', mood: 4 },
        { day: 'Wed', mood: 2 },
        { day: 'Thu', mood: 3 },
        { day: 'Fri', mood: 5 },
        { day: 'Sat', mood: 4 },
        { day: 'Sun', mood: 4 },
    ];

    const moodIcons = [
        { icon: Frown, label: 'Sad', color: 'text-red-500', value: 1 },
        { icon: Meh, label: 'Meh', color: 'text-orange-500', value: 2 },
        { icon: Smile, label: 'Good', color: 'text-yellow-500', value: 3 },
        { icon: Sun, label: 'Happy', color: 'text-green-500', value: 4 },
        { icon: Zap, label: 'Energetic', color: 'text-blue-500', value: 5 },
    ];

    const handleLogMood = () => {
        setIsLogged(true);
        setTimeout(() => setIsLogged(false), 3000);
    };

    return (
        <GlassCard className="p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Brain size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Mood & Wellbeing</h3>
                    <p className="text-sm text-gray-500">How are you feeling today?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Mood Logger */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Select Mood</label>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {moodIcons.map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => setMood(item.value)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${mood === item.value ? 'bg-white shadow-md scale-110 shadow-indigo-500/10' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <item.icon className={item.color} size={32} />
                                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-gray-700">
                                <span>Stress Level</span>
                                <span className="text-indigo-600">{stress}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={stress}
                                onChange={(e) => setStress(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-gray-700">
                                <span>Energy Level</span>
                                <span className="text-blue-600">{energy}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={energy}
                                onChange={(e) => setEnergy(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>

                    <AnimatedButton
                        onClick={handleLogMood}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30"
                    >
                        {isLogged ? "Mood Logged! ✨" : "Log Today's Mood"}
                    </AnimatedButton>
                </div>

                {/* Mood Chart */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Weekly Trend</h4>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <TrendingUp size={14} />
                            <span>Improving</span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#6366F1"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                            💡 <span className="font-bold underline">Insight:</span> Your stress levels reduced by 15% after your last counseling session. Keep it up!
                        </p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default MoodTracker;
