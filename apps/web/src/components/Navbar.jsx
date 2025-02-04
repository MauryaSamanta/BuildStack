import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import Logo from '../assets/images/mayflower-ship.png';
import Logout from '../assets/images/logout.png';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "motion/react"
import PersonaCardModal from './PersonaCard';
import { useNavigate } from 'react-router-dom';
const Navbar = ({currentpage,togglepage}) => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)'); // Check for small screens
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const githubtoken=useSelector((state)=>state.githubtoken);
  const [isVisible,setisVisible]=useState(!Boolean(githubtoken));
  const [anchorEl, setAnchorEl] = useState(null);
  const [showpersona,setshowpersona]=useState(false);
  const navigate=useNavigate();
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    //setSelectedIndex(null);
  };
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
                //textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
             
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: currentpage === 'home' ? '100%' : 0,
                height: '2px',
                backgroundColor: '#635acc',
                transition: 'width 0.3s ease-in-out',
              },
              '&:hover::after': {
                width: '100%',
              }
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
                //textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: currentpage === 'projects' ? '100%' : 0,
                height: '2px',
                backgroundColor: '#635acc',
                transition: 'width 0.3s ease-in-out',
              },
              '&:hover::after': {
                width: '100%',
              }
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
            // <Button
            //   variant="text"
            //   sx={{
            //     color: '#ffffff',
            //     fontFamily: 'Rubik',
            //     textTransform: 'none',
            //     '&:hover': {
            //       backgroundColor: 'transparent',
            //       color: '#eeeeee',
            //     },
            //     fontSize: isSmallScreen ? '0.85rem' : '1rem', // Adjust button font size
            //   }}
            //   onClick={() => {
            //     dispatch(setLogout());
            //   }}
            // >
            //   <img
            //     src={Logout}
            //     alt="logout"
            //     width={isSmallScreen ? 16 : 20} // Adjust icon size
            //     height={isSmallScreen ? 16 : 20}
            //     style={{ marginRight: !isSmallScreen && 5 }}
            //   />
            //   {!isSmallScreen && "Sign Out"}
            // </Button>
            <motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onHoverStart={() => console.log('hover started!')}
  style={{width:40,height:40, borderRadius:'50%', display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'}}
    onClick={(event)=>{handleMenuClick(event)}}
>
  {user.avatar ?<img src={user.avatar} style={{width:40,height:40,borderRadius:'50%'}}/>:
  (
    user.email.slice(0, 2).toUpperCase()
  )}
</motion.button>
          )}
          <Menu
  anchorEl={anchorEl}
  open={anchorEl}
  onClose={handleMenuClose}
  sx={{
    '.MuiMenu-paper': {
      backgroundColor: '#28282B',
      borderRadius: 2,
      outline: '2px solid grey',     // Using outline instead of border
      padding: '2px',                   // Add padding
      
      border: '5px solid transparent',  
    },
    
    cursor:'pointer',
    
  }}
  PaperComponent={motion.div}
  PaperProps={{
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.2 }
  }}
>
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.2 }}
  >
    <MenuItem 
      sx={{
        padding: '8px 16px',
        color: user.persona? user.persona.color[0]:'#635acc',
        display: "flex",
        flexDirection: 'row',
        fontFamily: 'k2d',
        fontWeight: 'bold',
        letterSpacing: 1,
        textShadow: '0 0 10px rgba(99, 90, 204, 0.3)', // Subtle glow in same color
        transition: 'text-shadow 0.3s ease',
        '&:hover': {
          textShadow: '0 0 12px rgba(99, 90, 204, 0.4)', // Slightly stronger on hover
        },
        fontSize:18
      }}
    >
      {user.username}
    </MenuItem>
  </motion.div>
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.2, delay: 0.2 }}
  >
     <MenuItem
  sx={{
    padding: '8px 16px',
    color: 'white',
    display: "flex",
    flexDirection: 'row',
    fontFamily: 'k2d',
    alignItems: 'center',
    gap: '8px'
  }}
  onClick={() => {
    if(user.persona) {
      setshowpersona(true); 
      setAnchorEl(null)
    } else {
      navigate('/onboard')
    }
  }}
>
  my builder persona
  <Typography 
    sx={{
      backgroundColor: '#4CAF50', 
      color: 'white',
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '0.7em',
      fontWeight: 'bold',
      marginLeft: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontFamily:'k2d'
    }}
  >
    BETA
  </Typography>
</MenuItem>
  </motion.div>
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.2, delay: 0.4 }}
  >
     <MenuItem 
      sx={{ 
        padding: '8px 16px', 
        color: 'white',
        display: "flex", 
        flexDirection: 'row',
        fontFamily:'k2d',
       
      }}
      onClick={()=>{ dispatch(setLogout());}}
    >
      <img src={Logout} style={{width:20,height:20, marginRight:10}}/>
      log out
    </MenuItem>
  </motion.div>
</Menu>
        </Box>
      </Toolbar>
      {showpersona && <PersonaCardModal open={Boolean(showpersona)} onClose={()=>{setshowpersona(null); }} persona={user.persona}/> }
    </AppBar>
  );
};

export default Navbar;
