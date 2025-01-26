import React from 'react';
import { Container, Typography, Box, Button, useMediaQuery } from '@mui/material';
import logo from "../assets/images/mayflower-ship.png";
import heart from "../assets/images/heart.png";
import li from "../assets/images/linkedin.png";
import ig from "../assets/images/instagram.png";
const AboutUsPage = () => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
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
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            fontFamily:'k2d'
          }}
        >
          About Us
        </Typography>
      </Box>

      <Box sx={{
        maxWidth: 800,
        mx: 'auto',
        textAlign: 'left'
      }}>
        <Typography
          sx={{
            fontSize: isSmallScreen?'1.1rem':'1.4rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          <strong>Our Story</strong>
        </Typography>

        <Typography
          sx={{
            fontSize: isSmallScreen?'1rem':'1.3rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          We are a small, lean team of developers from Kolkata   </Typography>
        <Typography
          sx={{
            fontSize:  isSmallScreen?'1rem':'1.3rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          We launched BuildStack from our university classroom in January 2025 to help solo developers and small coding teams to streamline and enjoy the process of development and learning.
        </Typography>


        <Typography
          sx={{
            fontSize: isSmallScreen?'1.1rem':'1.4rem',
            color: 'white',
            mb: 2,
            mt: 2,
            fontFamily:'k2d'
          }}
        >
          <strong>Reach Out</strong>
        </Typography>

        <Typography
          sx={{
            fontSize:  isSmallScreen?'1rem':'1.3rem',
            color: 'white',
            mb: 2,
            fontFamily:'k2d'
          }}
        >
          Suggest features and report bugs below
        </Typography>

        <Box sx={{
  display: 'flex',
  //justifyContent: 'center',
  gap: 2,
  mt: 4,
  //alignItems: 'center'
}}>
  <Box sx={{ display: 'flex', gap: 1 }}>
    <img 
      src={li}
      alt="LinkedIn" 
      style={{ width: 30, height: 30 }} 
    />
   <Typography 
      component="a" 
      href="https://www.linkedin.com/company/buildstackonline/" 
      target="_blank" 
      sx={{
        fontFamily:'k2d',
        color:'white',
        textDecoration: 'none',
        
      }}
    >
      message us on linkedin
    </Typography>
  </Box>
  
  {/* <Box sx={{ display: 'flex',  gap: 1 }}>
    <img 
      src={ig}
      alt="Instagram" 
      style={{ width: 30, height: 30 }} 
    />
    {!isSmallScreen && <Typography 
      component="a" 
      href="https://www.instagram.com/buildstack" 
      target="_blank" 
      sx={{
        fontFamily:'k2d',
        color:'white',
        textDecoration: 'none',
        
      }}
    >
      follow our instagram page
    </Typography>}
  </Box> */}
</Box>
     
        <Typography
 sx={{
   mt: 4,
   textAlign: 'center',
   fontSize: '0.8rem',
   color: 'white',
   fontFamily:'k2d',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center'
 }}
>
 Made with 
 <img 
   src={heart} 
   alt="heart" 
   style={{ 
     width: 20, 
     height: 20, 
     margin: '0 5px' 
   }} 
 /> 
 by © 2025 BuildStack
</Typography>
      </Box>
    </Box>
  );
};

export default AboutUsPage;