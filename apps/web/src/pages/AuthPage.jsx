import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, useMediaQuery, CircularProgress } from '@mui/material';
import Logo from '../assets/images/mayflower-ship.png';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Media query to detect smaller screens
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [loading,setloading]=useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    if(isLogin){
      setloading(true); 
      try {
        const response=await fetch('https://buildstack.onrender.com/user/v1/login',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
        });

        const loggedInUser=await response.json();
        dispatch(
          setLogin({
          user: loggedInUser.user,
          token: loggedInUser.token
         
        })
       
      );
      if(loggedInUser)
        navigate('/home');
      setloading(false);
      } catch (error) {
        
      }
    }
    else
    {  setloading(true); 
      try {
        const response=await fetch('https://buildstack.onrender.com/user/v1/signup',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
        });
        

        const loggedInUser=await response.json();
        //console.log(loggedInUser);
        dispatch(
          setLogin({
          user: loggedInUser.user,
          token: loggedInUser.token
         
        })
      );
      if(loggedInUser)
        navigate('/home');
      setloading(false);
      } catch (error) {
        
      }
    }
  };

  const handlegithub = () => {
    const GITHUB_CLIENT_ID = "Ov23linkw39HN1VwNk18";
    const REDIRECT_URI = 'https://www.buildstack.online/callback';
     
    // GitHub OAuth URL
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email,repo`;
    
    // Redirect to GitHub
    window.location.href = githubUrl;
  };
 return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(145deg, #0c0c0c, #202020)',
        padding: isSmallScreen ? '10px' : '20px',
      }}
    >
      <Paper
        sx={{
          padding: isSmallScreen ? '30px' : '50px',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          boxShadow:
            '10px 10px 20px rgba(0, 0, 0, 0.8), -5px -5px 15px rgba(50, 50, 50, 0.2)',
          width: '100%',
          maxWidth: isSmallScreen ? '320px' : isMediumScreen ? '400px' : '450px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: isSmallScreen ? '20px' : '30px',
          }}
        >
          <img
            src={Logo}
            alt="BuildStack Logo"
            style={{
              width: isSmallScreen ? '50px' : '60px',
              height: isSmallScreen ? '50px' : '60px',
              marginRight: 5,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'k2d',
              fontWeight: 800,
              fontSize: isSmallScreen ? '22px' : '28px',
              letterSpacing: '1.5px',
              color: '#ffffff',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
            }}
          >
            BuildStack
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 800,
            fontSize: isSmallScreen ? '24px' : '32px',
            letterSpacing: '2px',
            marginBottom: isSmallScreen ? '30px' : '40px',
            color: '#ffffff',
            textShadow:
              '2px 2px 5px rgba(0, 0, 0, 0.7), -2px -2px 5px rgba(255, 255, 255, 0.1)',
          }}
        >
          {isLogin ? 'Welcome Back!' : 'Join Us!'}
        </Typography>
        <Button
            //type="submit"
            sx={{
              width: '100%',
              marginBottom:2,
              padding: isSmallScreen ? '12px' : '15px',
              background: 'black',
              color: 'white',
              fontWeight: 800,
              fontSize: isSmallScreen ? '14px' : '16px',
              borderRadius: '10px',
              boxShadow:
                '0 4px 10px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.2)',
              
              fontFamily: 'k2d',
            }}
            startIcon={<GitHubIcon />}
            onClick={()=>{handlegithub()}}
          >
            Login with Github  
          </Button>

        <form onSubmit={handleSubmit}>
          <Typography
            sx={{
              color: '#dcdcdc',
              fontWeight: 600,
              marginBottom: '10px',
              textAlign: 'left',
              fontSize: isSmallScreen ? '16px' : '18px',
              fontFamily: 'k2d',
            }}
          >
            Enter Email
          </Typography>
          <TextField
            sx={{
              width: '100%',
              marginBottom: isSmallScreen ? '20px' : '30px',
              '& .MuiInputBase-root': {
                color: '#ffffff',
              },
              '& .MuiOutlinedInput-root': {
                border: '1px solid #444444',
                background: '#2a2a2a',
                borderRadius: '10px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#b3b3b3',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ffffff',
              },
            }}
            variant="outlined"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <Typography
            sx={{
              color: '#dcdcdc',
              fontWeight: 600,
              marginBottom: '10px',
              textAlign: 'left',
              fontSize: isSmallScreen ? '16px' : '18px',
              fontFamily: 'k2d',
            }}
          >
            Enter Password
          </Typography>
          <TextField
            sx={{
              width: '100%',
              marginBottom: isSmallScreen ? '20px' : '30px',
              '& .MuiInputBase-root': {
                color: '#ffffff',
              },
              '& .MuiOutlinedInput-root': {
                border: '1px solid #444444',
                background: '#2a2a2a',
                borderRadius: '10px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#b3b3b3',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ffffff',
              },
            }}
            variant="outlined"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <Button
            type="submit"
            sx={{
              width: '100%',
              padding: isSmallScreen ? '12px' : '15px',
              background: 'linear-gradient(145deg, #ffffff, #eeeeee)',
              color: 'black',
              fontWeight: 800,
              fontSize: isSmallScreen ? '14px' : '16px',
              borderRadius: '10px',
              boxShadow:
                '0 4px 10px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: 'linear-gradient(145deg, #f0f0f0, #dcdcdc)',
              },
              fontFamily: 'k2d',
            }}
          >
            {isLogin && !loading ? ('Login' ):(!isLogin && !loading? ('Sign Up'):(<CircularProgress size={20} color='black'/>))}  
          </Button>
         
        </form>
        <Typography
          sx={{
            marginTop: isSmallScreen ? '20px' : '30px',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
            '&:hover': {
              color: '#cccccc',
            },
            fontFamily: 'k2d',
          }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AuthPage;
