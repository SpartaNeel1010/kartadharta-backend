const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, 'Please provide a valid phone number.'],
  },
  address1: {
    type: String,
    required: true,
    trim: true,
  },
  address2: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, 'Please provide a valid zip code.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}, {
  timestamps: true,
});

// Export the model
module.exports = mongoose.model('User', userSchema);
