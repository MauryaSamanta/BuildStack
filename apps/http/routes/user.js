import express from 'express';
import { loginUser, signupUser } from '../controllers/user.js'; // Assuming controllers are in the controllers folder

const router = express.Router();

// Route for user signup
router.post('/v1/signup', signupUser);

// Route for user login
router.post('/v1/login', loginUser);

export default router;
