import { Link, useLocation } from 'react-router-dom';
import { FaUserMd, FaUserGraduate, FaUserShield, FaSignOutAlt, FaChartPie, FaCalendarAlt, FaCommentDots, FaUser, FaCog, FaListAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const links = {
        student: [
            { path: '/dashboard', label: 'Overview', icon: FaChartPie },
            { path: '/find-counselors', label: 'Find Counselors', icon: FaUserMd },
            { path: '/my-bookings', label: 'My Bookings', icon: FaCalendarAlt },
        ],
        counselor: [
            { path: '/counselor', label: 'Dashboard', icon: FaChartPie },
            { path: '/counselor/profile', label: 'My Profile', icon: FaUser },
        ],
        admin: [
            { path: '/admin', label: 'Overview', icon: FaChartPie },
        ]
    };

    const currentLinks = links[role] || [];

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-40 shadow-sm">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                    {role === 'admin' ? <FaUserShield className="text-2xl" /> :
                        role === 'counselor' ? <FaUserMd className="text-2xl" /> :
                            <FaUserGraduate className="text-2xl" />}
                    <span>Counseling<span className="text-gray-900">App</span></span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl mb-6">
                    <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-indigo-600 font-medium capitalize">{role}</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {currentLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`text-lg ${active ? 'text-white' : 'text-gray-400'}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <FaSignOutAlt className="text-lg" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
