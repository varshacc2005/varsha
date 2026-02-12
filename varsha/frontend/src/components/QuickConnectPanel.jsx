import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Phone, Calendar, X } from 'lucide-react';
import { useState } from 'react';

const QuickConnectPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { icon: Calendar, label: 'Book Session', color: 'bg-indigo-600', shadow: 'shadow-indigo-500/40' },
        { icon: MessageSquare, label: 'Chat Now', color: 'bg-purple-600', shadow: 'shadow-purple-500/40' },
        { icon: Phone, label: 'Emergency', color: 'bg-red-600', shadow: 'shadow-red-500/40' },
    ];

    return (
        <div className="fixed bottom-10 right-10 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-4 mb-4 items-end">
                        {actions.map((action, index) => (
                            <motion.div
                                key={action.label}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-white px-3 py-1.5 rounded-xl shadow-lg text-sm font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {action.label}
                                </span>
                                <button className={`p-4 ${action.color} text-white rounded-2xl shadow-xl ${action.shadow} hover:scale-110 transition-transform active:scale-95`}>
                                    <action.icon size={24} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1, rotate: isOpen ? -90 : 0 }}
                whileTap={{ scale: 0.9 }}
                className={`p-5 rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white hover:shadow-indigo-500/50'}`}
            >
                {isOpen ? <X size={32} /> : <Plus size={32} />}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-3xl bg-indigo-500 blur-xl -z-10 opacity-30 animate-pulse"
                    />
                )}
            </motion.button>
        </div>
    );
};

export default QuickConnectPanel;
