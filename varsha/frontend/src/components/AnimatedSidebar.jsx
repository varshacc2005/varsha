import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    User,
    LogOut,
    Shield,
    GraduationCap,
    Stethoscope,
    Menu,
    X,
    MessageSquare,
    Settings,
    UserPlus
} from 'lucide-react';
import { useState } from 'react';

const AnimatedSidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    // Default role to student if not found (for safety)
    const role = user?.role || 'student';

    const toggleSidebar = () => setIsOpen(!isOpen);

    const isActive = (path) => location.pathname === path;

    const links = {
        student: [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/find-counselors', label: 'Find Counselors', icon: Users },
            { path: '/my-bookings', label: 'My Bookings', icon: Calendar },
        ],
        counselor: [
            { path: '/counselor', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/counselor/bookings', label: 'Bookings', icon: Calendar },
            { path: '/counselor/availability', label: 'Availability', icon: Calendar },
            { path: '/counselor/profile', label: 'My Profile', icon: User },
        ],
        admin: [
            { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/admin/students', label: 'Students', icon: Users },
            { path: '/admin/add-counselor', label: 'Add Counselor', icon: UserPlus },
        ]
    };

    const currentLinks = links[role] || [];

    // Theme configuration based on role
    const theme = role === 'counselor'
        ? {
            activeBg: 'bg-emerald-500/10',
            activeText: 'text-emerald-500',
            activeBorder: 'border-emerald-500',
            hoverBg: 'hover:bg-emerald-500/5',
            iconColor: 'text-emerald-500',
            gradient: 'from-emerald-600 to-teal-600'
        }
        : {
            activeBg: 'bg-indigo-500/10',
            activeText: 'text-indigo-500',
            activeBorder: 'border-indigo-500',
            hoverBg: 'hover:bg-indigo-500/5',
            iconColor: 'text-indigo-500',
            gradient: 'from-indigo-600 to-purple-600'
        };

    const sidebarVariants = {
        open: { width: '280px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    return (
        <motion.div
            initial="open"
            animate={isOpen ? "open" : "closed"}
            variants={sidebarVariants}
            className="h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl z-50 flex flex-col"
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
                <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'justify-center w-full'}`}>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg shadow-indigo-500/20`}>
                        {role === 'admin' ? <Shield size={20} /> :
                            role === 'counselor' ? <Stethoscope size={20} /> :
                                <GraduationCap size={20} />}
                    </div>
                    {isOpen && (
                        <span className="font-bold text-xl tracking-tight text-gray-800">
                            Counseling<span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>App</span>
                        </span>
                    )}
                </div>
                {/* Mobile Toggle (Visible only on small screens usually, but here acting as collapse) */}
                {/* For desktop collapse */}
                <button onClick={toggleSidebar} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden">
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* User Profile Snippet */}
            <div className="p-6">
                <div className={`flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100/50 ${!isOpen && 'justify-center p-2'}`}>
                    <div className={`h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${theme.gradient}`}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 font-medium capitalize">{role}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {currentLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                        <Link key={link.path} to={link.path}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                                    ${active ? `${theme.activeBg} ${theme.activeText} shadow-sm border border-transparent` : `text-gray-500 ${theme.hoverBg} hover:text-gray-900`}
                                    ${!isOpen && 'justify-center px-2'}
                                `}
                            >
                                <link.icon size={22} className={`${active ? theme.text : 'group-hover:scale-110 transition-transform duration-300'}`} />
                                {isOpen && <span className="font-medium text-sm">{link.label}</span>}
                                {active && isOpen && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className={`ml-auto w-1.5 h-1.5 rounded-full bg-current`}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <button
                    onClick={logout}
                    className={`
                        w-full flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300
                        ${!isOpen && 'justify-center px-2'}
                    `}
                >
                    <LogOut size={22} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default AnimatedSidebar;
