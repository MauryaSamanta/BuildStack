import express from 'express';
import { loginUser, signupUser, githubLogin, savepersona } from '../controllers/user.js'; // Assuming controllers are in the controllers folder

const router = express.Router();

// Route for user signup
router.post('/v1/signup', signupUser);

// Route for user login
router.post('/v1/login', loginUser);

router.post('/v1/githublogin', githubLogin);    

router.post('/onboard', savepersona);
export default router;
