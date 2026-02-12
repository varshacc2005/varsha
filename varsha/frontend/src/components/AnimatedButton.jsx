import { motion } from 'framer-motion';

const AnimatedButton = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
    icon: Icon
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-transparent',
        secondary: 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm border',
        ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 border-transparent',
        danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30 border-transparent',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border-transparent',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative flex items-center justify-center gap-2 px-6 py-3 
                text-sm font-bold rounded-xl transition-all duration-300
                bg-[length:200%_auto] hover:bg-right
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
