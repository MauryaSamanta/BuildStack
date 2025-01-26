import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicyPage = () => {

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
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            mb: 2 
          }}
        >
          <strong>Data Privacy Commitment</strong>
        </Typography>
        
        <Typography 
          sx={{ 
            fontSize: '1rem', 
            color: 'white', 
            mb: 2 
          }}
        >
          We are committed to protecting your privacy and ensuring transparency in our data handling practices. When you use our GitHub repository browsing feature, all repository interactions occur entirely within your browser.
        </Typography>

        <Typography 
          sx={{ 
            fontSize: '1.1rem', 
            color: 'white', 
            mb: 2 
          }}
        >
          <strong>Key Privacy Principles:</strong>
        </Typography>

        <Box 
          component="ul" 
          sx={{ 
            pl: 3, 
            color: 'white', 
            fontSize: '1rem' 
          }}
        >
          <li>No Access to Repository Contents: All repository browsing happens client-side. We do not store, access, or transmit any of your repository data.</li>
          <li>Complete Browser-Based Experience: Your GitHub data remains under your complete control at all times.</li>
          <li>Secure and Transparent: We prioritize your data privacy and security.</li>
        </Box>

        <Typography 
          sx={{ 
            mt: 2, 
            fontSize: '1rem', 
            color: 'white' 
          }}
        >
          By using our service, you agree to these terms and our commitment to minimal data interaction.
        </Typography>

        <Typography 
          sx={{ 
            mt: 4, 
            textAlign: 'center', 
            fontSize: '0.8rem', 
            color: 'white' 
          }}
        >
          Last Updated: January 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default PrivacyPolicyPage;