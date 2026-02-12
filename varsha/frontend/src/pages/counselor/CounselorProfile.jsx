import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Briefcase,
    DollarSign,
    BookOpen,
    Award,
    Languages,
    Stethoscope,
    Save
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CounselorProfile = () => {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState({
        name: '', email: '', phone: '', bio: '', specialization: '',
        experience: 0, price: 0, skills: '', services: '', languages: '',
        education: '', certifications: '', approach: '', photo: ''
    });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                specialization: user.specialization || '',
                experience: user.experience || 0,
                price: user.price || 0,
                skills: user.skills ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills) : '',
                services: user.services ? (Array.isArray(user.services) ? user.services.join(', ') : user.services) : '',
                languages: user.languages ? (Array.isArray(user.languages) ? user.languages.join(', ') : user.languages) : '',
                education: user.education || '',
                certifications: user.certifications || '',
                approach: user.approach || '',
                photo: user.photo || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedProfile = {
                ...profile,
                skills: typeof profile.skills === 'string' ? profile.skills.split(',').map(s => s.trim()) : profile.skills,
                services: typeof profile.services === 'string' ? profile.services.split(',').map(s => s.trim()) : profile.services,
                languages: typeof profile.languages === 'string' ? profile.languages.split(',').map(s => s.trim()) : profile.languages
            };

            const res = await axios.put('http://localhost:5000/api/counselor/profile', updatedProfile, { withCredentials: true });
            toast.success('Profile updated successfully');
            // Update context if login function supports it, or just rely on next fetch
            // login(res.data);
        } catch (err) {
            toast.error('Failed to update profile');
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
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><User size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <input type="text" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <input type="email" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" value={profile.email} disabled />
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                            <div className="relative">
                                <input type="text" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                            <div className="relative">
                                <input type="text" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.specialization} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} />
                                <Stethoscope className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Experience (Years)</label>
                            <div className="relative">
                                <input type="number" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
                                <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Session Price ($)</label>
                            <div className="relative">
                                <input type="number" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.price} onChange={(e) => setProfile({ ...profile, price: e.target.value })} />
                                <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                            <label className="block text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Professional Details</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Qualification / Education</label>
                                    <div className="relative">
                                        <input type="text" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} />
                                        <BookOpen className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Certifications</label>
                                    <div className="relative">
                                        <input type="text" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.certifications} onChange={(e) => setProfile({ ...profile, certifications: e.target.value })} />
                                        <Award className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Counselling Approach</label>
                                    <textarea rows={3} className="block w-full border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all px-4 py-3" value={profile.approach} onChange={(e) => setProfile({ ...profile, approach: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                            <textarea rows={4} className="block w-full border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all px-4 py-3" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Skills (comma separated)</label>
                            <input type="text" className="block w-full border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all px-4 py-3" value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Services Offered (comma separated)</label>
                            <input type="text" className="block w-full border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all px-4 py-3" value={profile.services} onChange={(e) => setProfile({ ...profile, services: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Languages (comma separated)</label>
                            <div className="relative">
                                <input type="text" className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all" value={profile.languages} onChange={(e) => setProfile({ ...profile, languages: e.target.value })} />
                                <Languages className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Photo URL</label>
                            <input type="text" className="block w-full border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all px-4 py-3" value={profile.photo} onChange={(e) => setProfile({ ...profile, photo: e.target.value })} />
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <AnimatedButton
                            type="submit"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30"
                            icon={Save}
                        >
                            Save Profile
                        </AnimatedButton>
                    </div>
                </form>
            </GlassCard>
        </motion.div>
    );
};

export default CounselorProfile;
