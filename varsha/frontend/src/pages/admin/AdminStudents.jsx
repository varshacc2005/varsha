import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import { motion } from 'framer-motion';

const AdminStudents = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', { withCredentials: true });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            // Fallback
            setUsers([
                { _id: '1', name: 'Alice Student', email: 'alice@example.com', createdAt: '2023-01-15' },
                { _id: '2', name: 'Bob Learner', email: 'bob@example.com', createdAt: '2023-02-20' },
                { _id: '3', name: 'Charlie Mentee', email: 'charlie@example.com', createdAt: '2023-03-10' },
            ]);
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
        >
            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-blue-50/30 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Users size={20} /></div>
                    <h3 className="text-xl font-bold text-gray-900">Registered Students</h3>
                </div>
                <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {users.map((user) => (
                        <li key={user._id} className="p-6 hover:bg-blue-50/20 transition-colors">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    Joined: <span className="font-medium text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                    {users.length === 0 && (
                        <li className="p-12 text-center text-gray-400">
                            No students found.
                        </li>
                    )}
                </ul>
            </GlassCard>
        </motion.div>
    );
};

export default AdminStudents;
