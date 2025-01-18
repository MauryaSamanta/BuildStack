import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, Paper, IconButton } from '@mui/material';
import Logo from '../assets/images/mayflower-ship.png';
import Logout from '../assets/images/logout.png';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state';
import CloseIcon from '@mui/icons-material/Close';
const Navbar = ({currentpage,togglepage}) => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)'); // Check for small screens
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const githubtoken=useSelector((state)=>state.githubtoken);
  const [isVisible,setisVisible]=useState(!Boolean(githubtoken));
  console.log(githubtoken);
  return (
    <AppBar
    sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent white
      backdropFilter: 'blur(8px)', // Glass effect
      boxShadow: 'none',
      paddingLeft: isSmallScreen ? 0 : 8, // Adjust padding for small screens
      paddingRight: isSmallScreen ? 0 : 8,
      paddingTop: isSmallScreen && 2,
      flex: 1,
      borderBottomLeftRadius:5,
      borderBottomRightRadius:5 
    }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row', // Stack items vertically on small screens
          alignItems: isSmallScreen ? 'flex-start' : 'center',
        }}
      >
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: isSmallScreen ? 1 : 0 }}>
          <img src={Logo} alt="logo" width={isSmallScreen ? 30 : 40} height={isSmallScreen ? 30 : 40} />
          {(!isSmallScreen || !githubtoken) && <Typography
            variant="h6"
            sx={{
              color: '#ffffff',
              fontFamily: 'k2d',
              marginLeft: 2,
              fontSize: isSmallScreen ? '1rem' : '1.25rem', // Adjust font size
            }}
          >
            BuildStack
          </Typography>}
        </Box>

        {/* Center Buttons (Home and Goals) */}
       {githubtoken ? ( <Box sx={{ display: 'flex', gap: 4, flexGrow: 1, justifyContent: 'center' }}>
          <Button
            sx={{
              color: '#ffffff',
              fontFamily: 'Rubik',
              textTransform: 'none',
              fontSize: isSmallScreen ? '0.85rem' : '1rem',
              '&:hover': {
                fontWeight: 'bold',
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
              textDecoration: currentpage==='home' && 'underline',
            }}
            onClick={()=>{togglepage('home')}}
          >
            Home
          </Button>
         <Button
            sx={{
              color: '#ffffff',
              fontFamily: 'Rubik',
              textTransform: 'none',
              fontSize: isSmallScreen ? '0.85rem' : '1rem',
              '&:hover': {
                fontWeight: 'bold',
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
              textDecoration: currentpage==='projects' && 'underline',
            }}
            onClick={()=>{togglepage('projects')}}
          >
            Projects
          </Button>
        </Box>):isVisible && !isSmallScreen && (
          <Box sx={{  maxWidth: 'md', mx: 'auto' }}>
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              border: 2,
              borderColor: 'warning.main',
              backgroundColor: 'warning.light',
              borderRadius: 1,
              '& .MuiIconButton-root:hover': {
                backgroundColor: 'warning.main',
                opacity: 0.4
              }
            }}
          >
            <Typography 
              sx={{ 
                color: 'text.primary',
                flex: 1,
                fontFamily:'k2d'
              }}
            >
              Login using GitHub to enable projects view
            </Typography>
            <IconButton
              onClick={() => setisVisible(false)}
              aria-label="Close"
              size="small"
              sx={{ ml: 2 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
        )}

        {/* Sign Out Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && token && (
            <Button
              variant="text"
              sx={{
                color: '#ffffff',
                fontFamily: 'Rubik',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#eeeeee',
                },
                fontSize: isSmallScreen ? '0.85rem' : '1rem', // Adjust button font size
              }}
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              <img
                src={Logout}
                alt="logout"
                width={isSmallScreen ? 16 : 20} // Adjust icon size
                height={isSmallScreen ? 16 : 20}
                style={{ marginRight: !isSmallScreen && 5 }}
              />
              {!isSmallScreen && "Sign Out"}
            </Button>
          )}
        </Box>
      </Toolbar>
      
    </AppBar>
  );
};

export default Navbar;
