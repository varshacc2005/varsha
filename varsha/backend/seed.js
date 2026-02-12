const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@example.com' });

        if (!adminExists) {
            const adminUser = await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin',
            });
            console.log('Admin User Created');
        } else {
            console.log('Admin User already exists');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
