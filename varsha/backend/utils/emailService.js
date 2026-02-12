const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    }
});

const sendBookingRequestEmail = async (counselorEmail, studentName, date, time) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: 'New Booking Request',
            html: `
                <h3>New Booking Request</h3>
                <p>Hello Counselor (Original Recipient: ${counselorEmail}),</p>
                <p>You have a new booking request from <strong>${studentName}</strong>.</p>
                <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p>Please log in to your dashboard to approve or decline this request.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Booking request email sent explicitly to sender');
    } catch (error) {
        console.error('Error sending booking request email:', error);
    }
};

const sendBookingConfirmationEmail = async (studentEmail, counselorName, date, time, status) => {
    try {
        const subject = status === 'approved' ? 'Booking Confirmed' : 'Booking Update';
        const message = status === 'approved'
            ? `Your booking with <strong>${counselorName}</strong> has been confirmed.`
            : `Your booking with <strong>${counselorName}</strong> has been updated to: ${status}.`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: subject,
            html: `
                <h3>${subject}</h3>
                <p>Hello Student (Original Recipient: ${studentEmail}),</p>
                <p>${message}</p>
                <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                <p><strong>Time:</strong> ${time}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to sender');
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
    }
};

module.exports = {
    sendBookingRequestEmail,
    sendBookingConfirmationEmail,
};
