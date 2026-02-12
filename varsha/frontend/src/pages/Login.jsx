import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, Check } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import BackgroundOrbs from '../components/BackgroundOrbs';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
                role,
            }, { withCredentials: true });
            login(res.data);
            toast.success('Login successful');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-1000 ${role === 'counselor' ? 'from-emerald-50 via-teal-50 to-cyan-50' :
                    role === 'admin' ? 'from-blue-50 via-indigo-50 to-purple-50' :
                        'from-indigo-50 via-purple-50 to-pink-50'
                }`} />
            <BackgroundOrbs role={role} />

            <div className="w-full max-w-md p-4 relative z-10">
                <GlassCard className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${role === 'counselor' ? 'bg-emerald-100 text-emerald-600' :
                                role === 'admin' ? 'bg-blue-100 text-blue-600' :
                                    'bg-indigo-100 text-indigo-600'
                            }`}>
                            <LogIn size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">I am a...</label>
                            <div className="grid grid-cols-3 gap-3 p-1 bg-gray-50/50 rounded-xl border border-gray-100">
                                {['student', 'counselor', 'admin'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-2 px-2 text-sm font-bold rounded-lg capitalize transition-all duration-300 flex items-center justify-center gap-1 ${role === r
                                                ? r === 'counselor' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' :
                                                    r === 'admin' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' :
                                                        'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100'
                                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className={`block w-full pl-11 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none ${role === 'counselor' ? 'focus:ring-emerald-500' :
                                            role === 'admin' ? 'focus:ring-blue-500' :
                                                'focus:ring-indigo-500'
                                        }`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className={`block w-full pl-11 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none ${role === 'counselor' ? 'focus:ring-emerald-500' :
                                            role === 'admin' ? 'focus:ring-blue-500' :
                                                'focus:ring-indigo-500'
                                        }`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <AnimatedButton
                            type="submit"
                            variant={role === 'counselor' ? 'success' : 'primary'}
                            className={`w-full justify-center ${role === 'counselor' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' :
                                    role === 'admin' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
                                        'bg-gradient-to-r from-indigo-600 to-purple-600'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </AnimatedButton>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-gray-100">
                        <p className="text-gray-500">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className={`font-bold hover:underline transition-colors ${role === 'counselor' ? 'text-emerald-600 hover:text-emerald-700' : 'text-indigo-600 hover:text-indigo-700'
                                    }`}
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Login;
