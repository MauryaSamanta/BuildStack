import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import your User model
import dotenv from 'dotenv';
import OpenAI from "openai";
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
    
    const [userResponse, emailResponse] = await Promise.all([
      fetch('https://api.github.com/user', { headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }, method: "GET" }),
      fetch('https://api.github.com/user/emails', { headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }, method: "GET" })
    ]);
    //console.log("email=",emailResponse);
    const returneduser=await userResponse.json();
    const returnedemail=await emailResponse.json(); 
    //console.log(returnedemail[0].email);
    const userData = returneduser;
    //console.log(returneduser)
    const primaryEmailObj = Array.isArray(returnedemail) 
    ? returnedemail.find(emailObj => emailObj.primary === true) 
    : null;
    const primaryEmail = primaryEmailObj ? primaryEmailObj.email : null;
   
   // Find or create user in MongoDB
    let user={};
     user = await User.findOne({ email:primaryEmail });
    
    if (!user) {
     
      const newuser = new User({
        githubId: userData.id,
        email:  primaryEmail,
        username: userData.login,
        avatar:userData.avatar_url
     
      });
      const newUser2=await newuser.save();
      user=newUser2;
    } else {
      //console.log(primaryEmail)
      user.lastLogin = new Date();
      user.githubId=userData.id;
      user.email = primaryEmail; // Update email in case it changed
      
      user.username = userData.login;
      user.avatar=userData.avatar_url
      //console.log("user=",user);
      const newUser=await user.save();
      
    }

    // Create JWT token with user data
    const token = jwt.sign(
      {
        id: user._id,
        githubId: user.githubId,
        email: user.email,
        username: user.username,
        avatar:userData.avatar_url,
        
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
        avatar:userData.avatar_url,
        persona:user.persona
      },
      githubtoken:accessToken
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    //console.error(error.stack);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET, // Ensure this is set in .env
});

export const savepersona = async (req, res) => {
  const { userid, prompt } = req.body;
 
  // Array of professional and visually appealing gradient pairs
  const gradientPairs = [
    ["#635acc", "#3b3663"],  // Purple mystic
    ["#FF6B6B", "#556270"],  // Sunset charcoal
    ["#36D1DC", "#5B86E5"],  // Ocean breeze
    ["#007991", "#78ffd6"],  // Tropical waters
    ["#659999", "#f4791f"],  // Earthy sunset
    ["#dd5e89", "#f7bb97"],  // Rose dawn
    ["#4facfe", "#00f2fe"],  // Electric blue
    ["#43cea2", "#185a9d"],  // Forest depths
    ["#141E30", "#243B55"],  // Midnight steel
    ["#8E2DE2", "#4A00E0"],  // Royal purple
  ];

  try {
    // Get persona description from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an enthusiastic builder persona judge. Provide a concise, unique, inspiring and creative description of the user's builder personality based on their answers. Keep it under 25 tokens." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 1,
      max_tokens: 25,
    });

    const personalityText = response.choices[0].message.content;
    
    // Randomly select a gradient pair
    const randomGradient = gradientPairs[Math.floor(Math.random() * gradientPairs.length)];

    // Find and update user with new persona object
    let user = await User.findById(userid);
    user.persona = {
      text: personalityText,
      color: randomGradient
    };
    //console.log(user);
    const newUser=await user.save();
    console.log(newUser);
    res.status(200).json( {id: user._id,
      email: user.email,
      username: user.username,
      avatar:user.avatar,
      persona:user.persona});

  } catch (error) {
    console.error("Error in savepersona:", error);
    res.status(500).json({ error: "Failed to save persona" });
  }
};
