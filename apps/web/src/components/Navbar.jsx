import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery } from '@mui/material';
import Logo from '../assets/images/mayflower-ship.png';
import Logout from '../assets/images/logout.png';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state';

const Navbar = () => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)'); // Check for small screens
  const user=useSelector(state=>state.user);  
  const token=useSelector(state=>state.token);
  const dispatch=useDispatch();
  return (
    <AppBar
      sx={{
        backgroundColor: 'black',
        boxShadow: 'none',
        paddingLeft: isSmallScreen ? 0 : 8, // Adjust padding for small screens
        paddingRight: isSmallScreen ? 0 : 8,
        paddingTop:isSmallScreen && 2,
        flex:1
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection:  'row', // Stack items vertically on small screens
          alignItems: isSmallScreen ? 'flex-start' : 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: isSmallScreen ? 1 : 0 }}>
          <img src={Logo} alt="logo" width={isSmallScreen ? 30 : 40} height={isSmallScreen ? 30 : 40} />
          <Typography
            variant="h6"
            sx={{
              color: '#ffffff',
              fontFamily: 'k2d',
              marginLeft: 2,
              fontSize: isSmallScreen ? '1rem' : '1.25rem', // Adjust font size
            }}
          >
            BuildStack
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
         {user && token && <Button
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
            onClick={()=>{dispatch(
              setLogout()
            )}}
          >
            <img
              src={Logout}
              alt="logout"
              width={isSmallScreen ? 16 : 20} // Adjust icon size
              height={isSmallScreen ? 16 : 20}
              style={{ marginRight: 5 }}
            />
            Sign Out
          </Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
