import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    UserPlus, Mail, Phone, Lock, Briefcase, Award,
    BookOpen, Globe, User, Book
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { motion } from 'framer-motion';

const AdminAddCounselor = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        specialization: '', experience: '', education: '',
        certifications: '', bio: '', languages: '', approach: '', photo: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('http://localhost:5000/api/admin/counselor', formData, { withCredentials: true });
            toast.success('Counselor added successfully');
            setFormData({
                name: '', email: '', password: '', phone: '',
                specialization: '', experience: '', education: '',
                certifications: '', bio: '', languages: '', approach: '', photo: ''
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add counselor');
        } finally {
            setIsLoading(false);
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
            className="max-w-4xl mx-auto"
        >
            <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><UserPlus size={24} /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Add New Counselor</h3>
                        <p className="text-sm text-gray-500">Create a professional account with full profile details.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Personal Information</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <input type="text" name="name" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.name} onChange={handleChange} />
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <input type="email" name="email" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.email} onChange={handleChange} />
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <input type="tel" name="phone" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.phone} onChange={handleChange} />
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input type="password" name="password" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.password} onChange={handleChange} />
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="md:col-span-2 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Professional Details</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                            <div className="relative">
                                <input type="text" name="specialization" required className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.specialization} onChange={handleChange} />
                                <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                            <div className="relative">
                                <input type="number" name="experience" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.experience} onChange={handleChange} />
                                <Award className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Qualification (Education)</label>
                            <div className="relative">
                                <input type="text" name="education" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.education} onChange={handleChange} />
                                <BookOpen className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Certifications</label>
                            <div className="relative">
                                <input type="text" name="certifications" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.certifications} onChange={handleChange} />
                                <Award className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Languages (comma separated)</label>
                            <div className="relative">
                                <input type="text" name="languages" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.languages} onChange={handleChange} />
                                <Globe className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Photo URL</label>
                            <div className="relative">
                                <input type="text" name="photo" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="https://..." value={formData.photo} onChange={handleChange} />
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Counseling Approach</label>
                            <div className="relative">
                                <input type="text" name="approach" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. CBT, Solution-Focused" value={formData.approach} onChange={handleChange} />
                                <Book className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Short Professional Bio</label>
                            <textarea name="bio" rows="4" className="block w-full px-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" value={formData.bio} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <AnimatedButton
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30"
                            icon={UserPlus}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Counselor Account'}
                        </AnimatedButton>
                    </div>
                </form>
            </GlassCard>
        </motion.div>
    );
};

export default AdminAddCounselor;
