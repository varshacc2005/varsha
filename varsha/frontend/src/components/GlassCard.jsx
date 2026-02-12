import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = false, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            whileHover={hoverEffect ? { scale: 1.02, translateY: -5 } : {}}
            className={`
                relative overflow-hidden
                bg-white/70 backdrop-blur-xl 
                border border-white/40 shadow-xl 
                rounded-2xl 
                ${className}
            `}
        >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
