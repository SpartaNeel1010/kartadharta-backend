const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); 


router.post('/create', async (req, res) => {
  try {

    const { userId, date, time, service , comments } = req.body;


    if (!userId || !date || !time || !service) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newAppointment = new Appointment({
      userId,
      date: new Date(date), 
      time,
      service,
      comments,
    });
    console.log(newAppointment)


    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      message: 'Appointment created successfully.',
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

module.exports = router;
