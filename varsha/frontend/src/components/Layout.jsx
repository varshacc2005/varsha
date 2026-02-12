import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AnimatedSidebar from './AnimatedSidebar';
import BackgroundOrbs from './BackgroundOrbs';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Determine background style based on role
    const bgGradient = user?.role === 'counselor'
        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50';

    return (
        <div className={`flex min-h-screen font-sans ${bgGradient} relative overflow-hidden`}>
            {/* Futuristic Animated Background Orbs */}
            <BackgroundOrbs role={user?.role} />

            {/* Sidebar */}
            {user && <AnimatedSidebar />}

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="max-w-7xl mx-auto w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;
