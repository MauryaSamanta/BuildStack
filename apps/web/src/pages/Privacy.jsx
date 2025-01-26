import React from 'react';
import { Container, Typography, Box, useMediaQuery, Button } from '@mui/material';
import logo from "../assets/images/mayflower-ship.png";
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
      const isSmallScreen = useMediaQuery('(max-width:600px)');
      const navigate=useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: 'black', 
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: 4
      }}
    >
      <Box display="flex" alignItems="center" mb={4} sx={{alignItems:'center', justifyContent:'center'}}>
        <img src={logo} alt="BuildStack Logo" style={{ width: 40, height: 40, marginRight: 8 }} />
        <Typography variant={"h5"} component="h1" sx={{fontFamily:'k2d'}}>
          BuildStack
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mb: 4, }}>
        <Typography
          sx={{
            fontSize: !isSmallScreen?'2.5rem':'1.5rem',
            fontWeight: 'bold',
            color: 'white',
            fontFamily:'k2d'
          }}
        >
          Privacy Policy & Terms of Service
        </Typography>
      </Box>

      <Box sx={{
        maxWidth: 800,
        mx: 'auto',
        textAlign: 'left'
      }}>
        <Typography
          sx={{
            fontSize: '1.1rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          <strong>Data Collection and Protection</strong>
        </Typography>

        <Typography
          sx={{
            fontSize: '1rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          BuildStack is committed to maintaining the highest standards of data privacy and security. We collect minimal user information to provide and improve our services while ensuring complete transparency about our data handling practices.
        </Typography>

        <Typography
          sx={{
            fontSize: '1.1rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          <strong>User Data Collection</strong>
        </Typography>

        <Box
          component="ul"
          sx={{
            pl: 3,
            color: 'white',
            fontSize: '1rem'
          }}
        >
          <li style={{fontFamily:'k2d'}}>Email and Password: We collect user email addresses and passwords for account authentication and service access.</li>
          <li style={{fontFamily:'k2d'}}>Password Security: All user passwords are stored in a highly secure, salted and bcrypt-encrypted format, ensuring maximum protection against potential breaches.</li>
          <li style={{fontFamily:'k2d'}}>Email Confidentiality: We guarantee that user email addresses will never be shared, sold, or distributed to third parties under any circumstances.</li>
        </Box>

        <Typography
          sx={{
            fontSize: '1.1rem',
            color: 'white',
            mb: 2,
            mt: 2,
            fontFamily:'k2d'
          }}
        >
          <strong>GitHub Repository Interaction</strong>
        </Typography>

        <Box
          component="ul"
          sx={{
            pl: 3,
            color: 'white',
            fontSize: '1rem'
          }}
        >
          <li style={{fontFamily:'k2d'}}>Repository Creation: We assist users in creating GitHub repositories through our platform.</li>
          <li style={{fontFamily:'k2d'}}>Strict Non-Interference Policy: We do not view, modify, or access the contents of user-created repositories. All repository management occurs directly through GitHub's interfaces.</li>
          <li style={{fontFamily:'k2d'}}>Client-Side Operations: In the browse repo function, the repository contents are shown on the client-side and are not stored on our servers at any point.</li>
        </Box>

        <Typography
          sx={{
            mt: 2,
            fontSize: '1rem',
            color: 'white',
            fontFamily:'k2d'
          }}
        >
          By using BuildStack, you acknowledge and agree to our comprehensive data protection and privacy practices. We are dedicated to providing a secure, transparent, and user-centric service experience.
        </Typography>
        <Box sx={{ display:'flex',alignItems:'center', justifyContent:'center',mt:!isSmallScreen?2:1}}>
        <Button sx={{backgroundColor:'#353935', padding:1, fontFamily:'k2d', color:'white', textTransform: 'lowercase' }} onClick={()=>{navigate('/')}}>
          <Typography sx={{fontFamily:'k2d', color:'white', letterSpacing:2}}>
          back to login
          </Typography>
        </Button>
        </Box>
        <Typography
          sx={{
            mt: 4,
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'white',
            fontFamily:'k2d'
          }}
        >
          Last Updated: January 2025
        </Typography>
      
      </Box>
    </Box>
  );
};

export default PrivacyPolicyPage;