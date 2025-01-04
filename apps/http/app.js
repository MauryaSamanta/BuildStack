// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.js";
import shipRoutes from "./routes/ship.js";
import connectDB from './connections/db.js';
// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
connectDB(); // Connect to the database
app.use('/user', userRoutes);
app.use('/ship', shipRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; // For testing or further integration
