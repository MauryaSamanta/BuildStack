import React from 'react';
import { Container, Typography, Box, Divider, useMediaQuery, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/mayflower-ship.png';

const PrivacyPolicyPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        //mt: isMobile ? 2 : 4,
        mb: isMobile ? 2 : 4,
        px: isMobile ? 2 : 0,
        background: 'linear-gradient(145deg, #0c0c0c, #202020)',
        fontFamily: 'K2D',
        color: 'white',
        //borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Header Section */}
      <Box display="flex" alignItems="center" mb={isMobile ? 2 : 4}>
        <img src={logo} alt="BuildStack Logo" style={{ width: 40, height: 40, marginRight: 8 }} />
        <Typography variant={isMobile ? "h6" : "h5"} component="h1">
          BuildStack
        </Typography>
      </Box>

      {/* Back Button */}
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Page Title */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        gutterBottom
      >
        Privacy Policy
      </Typography>

     

      <Divider sx={{ my: 2, borderColor: 'white' }} />

      {/* Content Sections */}
      <Typography
        variant={isMobile ? "h6" : "h6"}
        component="h2"
        gutterBottom
      >
        1. Information We Collect
      </Typography>
      <Typography paragraph>
        We collect the following types of information:
      </Typography>
      <Typography variant="subtitle1" component="h3" gutterBottom>
        a. Personal Information
      </Typography>
      <Typography paragraph>
        - Email Address: To create and manage your account, and for communication purposes.<br />
        - Password: Stored securely and used for authentication.
      </Typography>
      <Typography variant="subtitle1" component="h3" gutterBottom>
        b. Automatically Collected Information
      </Typography>
      <Typography paragraph>
        - Device information (e.g., IP address, operating system, browser type).<br />
        - Usage data (e.g., interactions with the app).
      </Typography>

      <Divider sx={{ my: 2, borderColor: 'white' }} />

      <Typography
        variant={isMobile ? "h6" : "h6"}
        component="h2"
        gutterBottom
      >
        2. How We Use Your Information
      </Typography>
      <Typography paragraph>
        We use your information to:
      </Typography>
      <Typography component="ul" sx={{ pl: isMobile ? 2 : 3 }}>
        <Typography component="li">Provide, operate, and improve the Service.</Typography>
        <Typography component="li">Send account-related updates and communication.</Typography>
        <Typography component="li">Respond to support requests and inquiries.</Typography>
        <Typography component="li">
          Ensure the security of your account and prevent unauthorized access.
        </Typography>
      </Typography>

      <Divider sx={{ my: 2, borderColor: 'white' }} />

      <Typography
        variant={isMobile ? "h6" : "h6"}
        component="h2"
        gutterBottom
      >
        3. How We Protect Your Information
      </Typography>
      <Typography paragraph>
        We implement technical, administrative, and organizational measures to secure your data, including:
      </Typography>
      <Typography component="ul" sx={{ pl: isMobile ? 2 : 3 }}>
        <Typography component="li">Encrypting passwords and sensitive data.</Typography>
        <Typography component="li">Using secure servers and firewalls.</Typography>
        <Typography component="li">
          Limiting access to personal data to authorized personnel.
        </Typography>
      </Typography>

     

    
    </Container>
  );
};

export default PrivacyPolicyPage;
