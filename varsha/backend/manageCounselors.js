const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Counselor = require('./models/Counselor');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const manageCounselors = async () => {
    try {
        // 1. Remove 'teacher'
        const result = await Counselor.deleteMany({ name: { $regex: /teacher/i } });
        console.log(`Deleted ${result.deletedCount} counselor(s) with name matching 'teacher'.`);

        // 2. Add 3 New Counselors
        const newCounselors = [
            {
                name: 'Dr. Emily Wong',
                email: 'emily.wong@example.com',
                password: 'password123',
                specialization: 'Study Abroad Specialist',
                bio: 'Guiding students through the complex process of applying to international universities and scholarships.',
                skills: ['Visa Application', 'University Selection', 'Scholarship Essays', 'Cultural Adaptation'],
                languages: ['English', 'Cantonese', 'Mandarin'],
                price: 2000,
                experience: 15,
                photo: 'https://img.freepik.com/free-photo/young-beautiful-woman-looking-camera-trendy-girl-casual-summer-white-t-shirt-jeans-shorts-positive-female-shows-facial-emotions-funny-model-isolated-yellow_158538-15796.jpg',
                availability: [
                    { date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '09:00 AM', endTime: '10:00 AM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 3)), startTime: '11:00 AM', endTime: '12:00 PM' }
                ]
            },
            {
                name: 'Mr. James Wilson',
                email: 'james.wilson@example.com',
                password: 'password123',
                specialization: 'Sports Psychology',
                bio: 'Helping student-athletes balance academics and sports while maintaining mental toughness and focus.',
                skills: ['Performance Anxiety', 'Goal Setting', 'Team Dynamics', 'Motivation'],
                languages: ['English'],
                price: 1600,
                experience: 7,
                photo: 'https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg',
                availability: [
                    { date: new Date(new Date().setDate(new Date().getDate() + 1)), startTime: '04:00 PM', endTime: '05:00 PM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 4)), startTime: '05:00 PM', endTime: '06:00 PM' }
                ]
            },
            {
                name: 'Ms. Priya Patel',
                email: 'priya.patel@example.com',
                password: 'password123',
                specialization: 'Art Therapy',
                bio: 'Using creative expression to help students process emotions, reduce stress, and improve self-awareness.',
                skills: ['Art Therapy', 'Creative Expression', 'Emotional Healing', 'Mindfulness'],
                languages: ['English', 'Hindi', 'Gujarati'],
                price: 1400,
                experience: 9,
                photo: 'https://img.freepik.com/free-photo/young-indian-woman-wearing-sari_23-2149400847.jpg',
                availability: [
                    { date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '02:00 PM', endTime: '03:00 PM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 3)), startTime: '10:00 AM', endTime: '11:00 AM' },
                    { date: new Date(new Date().setDate(new Date().getDate() + 5)), startTime: '01:00 PM', endTime: '02:00 PM' }
                ]
            }
        ];

        for (const counselorData of newCounselors) {
            const exists = await Counselor.findOne({ email: counselorData.email });
            if (!exists) {
                await Counselor.create(counselorData);
                console.log(`Counselor ${counselorData.name} added.`);
            } else {
                console.log(`Counselor ${counselorData.name} already exists.`);
            }
        }

        console.log('Counselor management completed.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

manageCounselors();
