const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer'); // Mailer package
const User = require("../models/User")

// Dummy function to get user details (replace with your actual logic)
const getUserDetails = async (userId) => {
    try {
        const user = await User.findById(userId); // Find user by ID
        if (!user) {
            console.log('User not found.');
            return null; // Handle case where user does not exist
        }
        return user;
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error; // Handle error
    }
};

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or your SMTP server
    auth: {
        user: 'kartadharta.maid@gmail.com', // Replace with your email
        pass: 'gdmj azlw fvwg hrpk', 
    },
});

router.post('/create', async (req, res) => {
    try {
        const { userId, date, time, service, comments } = req.body;

        // Validate inputs
        if (!userId || !date || !time || !service) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Fetch user details
        const userDetails = await getUserDetails(userId);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Save the appointment
        const newAppointment = new Appointment({
            userId,
            date: new Date(date),
            time,
            service,
            comments,
        });
        const formattedDate = newAppointment.date.toLocaleDateString('en-US', {
            weekday: 'long', // "Monday"
            year: 'numeric', // "2024"
            month: 'long',   // "April"
            day: 'numeric',  // "15"
        });
          

        const savedAppointment = await newAppointment.save();
        console.log("Appointment created successfully")

        // Email content for user
        const userMailOptions = {
            from: 'kartadharta.maid@gmail.com',
            to: userDetails.email,
            subject: 'Appointment Confirmation',
            text: `Dear ${userDetails.name},\n\nYour appointment has been confirmed:\nDate: ${formattedDate}\nTime: ${time}\nService: ${service}\nComments: ${comments || 'N/A'}\n\nThank you!`,
        };

        // Email content for yourself
        const adminMailOptions = {
            from: 'kartadharta.maid@gmail.com',
            to: 'shahneel1309@gmail.com',
            subject: 'New Appointment Booked',
            text: `New appointment booked:\n\nUser Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}\nAddress: ${userDetails.address1}\n${userDetails.address2}\n${userDetails.zipCode}\n\nAppointment Details:\nDate: ${formattedDate}\nTime: ${time}\nService: ${service}\nComments: ${comments || 'N/A'}`,
        };

        // Send emails to user and admin
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(201).json({
            message: 'Appointment created successfully. Emails sent.',
            appointment: savedAppointment,
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            message: 'Internal server error.',
            error: error.message,
        });
    }
});

router.get('/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        
        // Find all appointments where userId matches
        const appointments = await Appointment.find({ userId: userid })
            .sort({ date: 1, time: 1 }) // Sort by date and time in ascending order
            .populate('userId', 'name email') // Optional: populate user details if needed
            .exec();
        
        if (!appointments.length) {
            return res.status(404).json({
                success: false,
                message: 'No appointments found for this user'
            });
        }

        return res.status(200).json({
            success: true,
            data: appointments
        });

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

module.exports = router;
