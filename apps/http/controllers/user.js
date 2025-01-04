import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import your User model

// Secret key for JWT (store securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup Controller
export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // Return the user and token
    res.status(201).json({ user: { id: newUser._id, email: newUser.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Return the user and token
    res.status(200).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
