import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import your User model
import dotenv from 'dotenv';
dotenv.config();
// Secret key for JWT (store securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// Signup Controller
export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
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

export const githubLogin = async (req, res) => { 
  const { code } = req.body;
  console.log("code=", code);
  const data={ client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code}
    //console.log(GITHUB_CLIENT_ID);
  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',{
      body: JSON.stringify(data),
      method:"POST",
      headers:{"Content-Type":"application/json",
        Accept: "application/json"
      } 
      }
    );
    const tokenResponseText = await tokenResponse.text();
    let returnedToken;
    try {
      returnedToken = JSON.parse(tokenResponseText);
    } catch (err) {
      throw new Error(`GitHub API error: ${tokenResponseText}`);
    }

    const accessToken = returnedToken.access_token;
    //console.log(tokenResponse)
   
    // console.log("accessToken=", accessToken);
    // Get user data from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      },
      method:"GET",
    });

    // Get user's email from GitHub
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      },
      method:"GET",
    });
   // console.log(emailResponse);
    const returneduser=await userResponse.json();
    const returnedemail=await emailResponse.json(); 
    const userData = returneduser;
    console.log(returneduser)
    let primaryEmail
   for(var i=0;i<returnedemail.length;i++)  {
    const email=returnedemail[i]; 
    //console.log(email);
    if(email.primary){
      primaryEmail=email.email;
     // console.log("primaryEmail=", primaryEmail); 
      break;
    }
   }
 
    if (!primaryEmail) {
      throw new Error('No email found for this GitHub account');
    }

    // Find or create user in MongoDB
    let user={};
     user = await User.findOne({ email:primaryEmail });
    
    if (!user) {
      // Create new user
      user = await User.create({
        githubId: userData.id,
        email: primaryEmail,
        username: userData.login,
        //avatarUrl: userData.avatar_url
      });
    } else {
      // Update existing user's last login
      user.lastLogin = new Date();
      githubId: userData.id,
      user.email = primaryEmail; // Update email in case it changed
      user.username = userData.login;
      //user.avatarUrl = userData.avatar_url;
      await user.save();
    }

    // Create JWT token with user data
    const token = jwt.sign(
      {
        id: user._id,
        githubId: user.githubId,
        email: user.email,
        username: user.username,
        //avatarUrl: user.avatarUrl
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token and user data
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        //avatarUrl: user.avatarUrl
      },
      githubtoken:accessToken
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
}
