const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Counselor = require('./models/Counselor');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedCounselors = async () => {
    try {
        const counselors = [
            {
                name: 'Dr. Sarah Jenkins',
                email: 'sarah.jenkins@example.com',
                password: 'password123',
                specialization: 'Career Counseling',
                bio: 'Expert in career transitions and resume building with 10+ years of experience helping students and professionals find their dream jobs.',
                skills: ['Resume Writing', 'Interview Prep', 'Career Planning', 'LinkedIn Optimization'],
                languages: ['English', 'Spanish'],
                price: 1500,
                experience: 10,
                photo: 'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg', // Placeholder
                availability: [
                    { date: new Date(new Date().setDate(new Date().getDate() + 1)), startTime: '10:00 AM', endTime: '11:00 AM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 1)), startTime: '02:00 PM', endTime: '03:00 PM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '11:00 AM', endTime: '12:00 PM' }
                ]
            },
            {
                name: 'Mr. David Chen',
                email: 'david.chen@example.com',
                password: 'password123',
                specialization: 'Academic Counseling',
                bio: 'Helping students navigate academic challenges, college applications, and study strategies to achieve their educational goals.',
                skills: ['College Applications', 'Study Skills', 'Time Management', 'Test Prep'],
                languages: ['English', 'Mandarin'],
                price: 1200,
                experience: 8,
                photo: 'https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg', // Placeholder
                availability: [
                    { date: new Date(new Date().setDate(new Date().getDate() + 1)), startTime: '09:00 AM', endTime: '10:00 AM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 3)), startTime: '04:00 PM', endTime: '05:00 PM' }
                ]
            },
            {
                name: 'Ms. Maria Rodriguez',
                email: 'maria.rodriguez@example.com',
                password: 'password123',
                specialization: 'Mental Health',
                bio: 'Compassionate therapist specializing in anxiety, stress management, and emotional well-being for students.',
                skills: ['Anxiety Management', 'Stress Reduction', 'Mindfulness', 'CBT'],
                languages: ['English', 'Portuguese'],
                price: 1800,
                experience: 12,
                photo: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg', // Placeholder
                availability: [
                    { date: new Date(new Date().setDate(new Date().getDate() + 1)), startTime: '01:00 PM', endTime: '02:00 PM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '10:00 AM', endTime: '11:00 AM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 4)), startTime: '03:00 PM', endTime: '04:00 PM' }
                ]
            }
        ];

        for (const counselorData of counselors) {
            const exists = await Counselor.findOne({ email: counselorData.email });
            if (!exists) {
                await Counselor.create(counselorData);
                console.log(`Counselor ${counselorData.name} added.`);
            } else {
                console.log(`Counselor ${counselorData.name} already exists.`);
            }
        }

        console.log('Counselor seeding completed.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedCounselors();
