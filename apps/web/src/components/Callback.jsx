// src/components/Callback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setGithubLogin, setLogin } from '../state';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from "../assets/images/mayflower-ship.png";
// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: 'black',
  width:'100%',
  flex:1
}));

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  //maxWidth: 400,
  padding: theme.spacing(3),
  textAlign: 'center',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#1e1e1e',
}));

const LoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  backgroundColor: '#1e1e1e',
}));

const HeaderIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection:'row',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '3rem',
    color: 'white'
  }
}));

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = new URLSearchParams(location.search).get('code');
        
        if (!code) {
          setError('No authorization code received from GitHub');
          setIsLoading(false);
          return;
        }

        const response = await fetch('https://buildstack.onrender.com/user/v1/githublogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        console.log(response);

        if (!response.ok) {
          throw new Error('Failed to authenticate with GitHub');
        }

        const data = await response.json();
        console.log(data);
        if (data.error) {
          throw new Error(data.error);
        }

        dispatch(
          setGithubLogin({
            user: data.user,
            token: data.token,
            githubtoken: data.githubtoken
          })
        );
        if (data)
          navigate('/home');
        
      } catch (err) {
        console.error('Authentication Error:', err);
        setError(err.message);
        setIsLoading(false);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <Box sx={{ display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'black',
      width:'100%',
      flex:1,
      padding:2}} >
      <StyledCard>
        <HeaderIcon>
          <GitHubIcon color='#ffffff'/>
          <Typography sx={{color:'white', ml:2, mr:2}}>X</Typography>
          <img src={logo} style={{width:50, height:50}}/>
        </HeaderIcon>
        <CardContent>
          {error ? (
            <>
              <Alert severity="error" sx={{ mb: 2, backgroundColor: '#1e1e1e',fontWeight:'bold' }}>
                {error}
              </Alert>
              <Typography variant="body2" color="white" sx={{fontFamily:'k2d'}}>
                Redirecting to login page...
              </Typography>
            </>
          ) : (
            <LoadingBox>
              <CircularProgress color="white" />
              <Typography variant="h6" color="white" sx={{fontFamily:'k2d'}}>
                Authenticating...
              </Typography>
              <Typography variant="body2" color="white" sx={{fontFamily:'k2d'}}>
                Please wait while we complete your GitHub login
              </Typography>
            </LoadingBox>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Callback;
