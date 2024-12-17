const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    match: /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i, // Ensures proper 12-hour format
  },
  service: {
    type: String,
    required: true,
     // Replace with actual service options
  },
  comments: {
    type: String,
    maxlength: 500, // Optional: Limit note length
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
