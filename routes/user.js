const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js'); // Import your User model
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = 'my_secret_123';
// POST request to create a new user
router.post('/register', async (req, res) => {
    try {
      // Destructure the request body
      const { name, email, phone, address1, address2, zipCode, password } = req.body;
  
      // Validate required fields
      if (!name || !email || !phone || !address1 || !zipCode || !password) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
      }
  
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const newUser = new User({
        name,
        email,
        phone,
        address1,
        address2,
        zipCode,
        password: hashedPassword,
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
  
      // Generate a token
      const token = jwt.sign({ id: savedUser._id, email: savedUser.email,name }, JWT_SECRET, {
        expiresIn: '1d', // Token expiration time
      });
  
      // Send the response with the token
      res.status(201).json({
        message: 'User registered successfully!',
        token,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
router.post('/login', async (req, res) => {
    try {
        // Destructure email and password from request body
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare provided password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token (optional)
        const token = jwt.sign({ id: user._id, email: user.email,name:user.name }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Send success response
        res.status(200).json({
            message: 'Login successful!',
            token, // Return the token if using JWT
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                name:user.name
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
