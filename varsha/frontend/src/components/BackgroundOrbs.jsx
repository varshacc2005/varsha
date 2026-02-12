import { motion } from 'framer-motion';

const BackgroundOrbs = ({ role = 'student' }) => {
    // Determine colors based on role or default
    const orbColors = role === 'counselor'
        ? ['bg-emerald-300', 'bg-teal-300', 'bg-cyan-300']
        : role === 'admin'
            ? ['bg-blue-300', 'bg-indigo-300', 'bg-purple-300']
            : ['bg-purple-300', 'bg-indigo-300', 'bg-pink-300'];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 ${orbColors[0]}`}
            />
            <motion.div
                animate={{
                    x: [0, -70, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className={`absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 ${orbColors[1]}`}
            />
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className={`absolute bottom-[40%] left-[20%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 ${orbColors[2]}`}
            />
        </div>
    );
};

export default BackgroundOrbs;
