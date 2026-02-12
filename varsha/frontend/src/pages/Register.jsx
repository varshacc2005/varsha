import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    UserPlus, User, Mail, Lock, Phone, GraduationCap, Briefcase,
    BookOpen, Heart, Smile, Award, Languages, Globe, ChevronLeft
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import BackgroundOrbs from '../components/BackgroundOrbs';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    // const [step, setStep] = useState(1); // 1: Role Selection, 2: Registration Form - REMOVED
    const [role, setRole] = useState('student'); // Force role to student

    // Common Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    // Student Fields
    const [education, setEducation] = useState('');
    const [course, setCourse] = useState('');
    const [year, setYear] = useState('');
    const [college, setCollege] = useState('');
    const [areaOfInterest, setAreaOfInterest] = useState('');
    const [goal, setGoal] = useState('');
    const [mood, setMood] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name, email, password, role: 'student', phone,
                education, course, year, college, areaOfInterest, goal, mood
            };

            const res = await axios.post('http://localhost:5000/api/auth/register', payload, { withCredentials: true });
            login(res.data);
            toast.success('Registration successful');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans py-12 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 transition-colors duration-1000" />
            <BackgroundOrbs role={'student'} />

            <div className="w-full max-w-2xl relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="register-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <GlassCard className="p-8 sm:p-10">
                            <div className="text-center mb-8">
                                <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                    <UserPlus className="text-indigo-600" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create Student Account</h2>
                                <p className="text-gray-500 text-lg">Join us to get expert guidance</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <input type="text" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                                            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <input type="email" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <input type="tel" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none" placeholder="+1234567890" value={phone} onChange={e => setPhone(e.target.value)} />
                                            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <input type="password" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <input type="password" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    {/* Student Specific Fields */}
                                    <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Academic Profile</h3>
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Qualification</label>
                                        <input type="text" className="block w-full px-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all" placeholder="e.g. Undergraduate" value={education} onChange={e => setEducation(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Course / Major</label>
                                        <input type="text" className="block w-full px-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all" placeholder="e.g. CS" value={course} onChange={e => setCourse(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Year / Semester</label>
                                        <input type="text" className="block w-full px-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all" placeholder="e.g. 3rd Year" value={year} onChange={e => setYear(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Institution</label>
                                        <input type="text" className="block w-full px-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all" placeholder="University Name" value={college} onChange={e => setCollege(e.target.value)} />
                                    </div>
                                </div>

                                <AnimatedButton
                                    type="submit"
                                    className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : 'Register'}
                                </AnimatedButton>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-500">
                                        Already have an account?{' '}
                                        <Link to="/" className="font-bold text-indigo-600 hover:underline">
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Register;
