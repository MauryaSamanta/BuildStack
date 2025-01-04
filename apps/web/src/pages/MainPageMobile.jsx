import React from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, useMediaQuery } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShipList from '../components/ShipList'; // Assuming ShipList is a component that lists ships.
import Navbar from '../components/Navbar';
import ActivityChart from '../components/ActivityChart';

const MainPageMobile = () => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Media query for phones and tablets

  return (
    <Box
      sx={{
        background: 'black',
        flex: 1,
        display: 'flex',
        flexDirection: 'column', // Switch to column for small screens
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
        paddingLeft: isSmallScreen ? 2 : 15, // Adjust padding for small screens
        paddingRight: isSmallScreen ? 2 : 15,
      }}
    >
      <Navbar />
      <Grid container spacing={isSmallScreen ? 2 : 4}>
        {/* Left Column: Textfield, Stats, and Chart */}
        <Grid item xs={12}>
          <Box sx={{ paddingTop: isSmallScreen ? 5 : 10 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#ffffff',
                fontFamily: 'k2d',
                textAlign: 'left',
                fontSize: 18,
                marginBottom: 2,
                marginTop:5
              }}
            >
              What did you ship today?
            </Typography>
            <TextField
              variant="outlined"
              placeholder="I built..."
              fullWidth
              multiline
              sx={{
                backgroundColor: '#1e1e1e',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  color: '#36454F',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#36454F',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#36454F',
                },
                width: '100%', // Full width for small screens
                
              }}
              inputProps={{
                style: {
                  color: '#ffffff',
                  //height:10
                },
              }}
            />
          </Box>
          <Button
            sx={{
              borderRadius: 2,
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: '#eeeeee',
              },
              marginTop: 2, // Adjust space between button and textfield
            }}
          >
            <Typography variant="button" sx={{ fontFamily: 'rubik' }}>
              Save!!
            </Typography>
          </Button>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row', // Switch to column for small screens
              paddingTop: 5,
              justifyContent:  'center' ,
              gap: isSmallScreen ? 2 : 0, // Add spacing between cards for small screens
            }}
          >
            <Paper
              sx={{
                backgroundColor: '#1e1e1e',
                borderRadius: 4,
                padding: 3,
                width: isSmallScreen ? '100%' : 350, // Full width for small screens
                height: 100,
              }}
              elevation={3}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#ffffff',
                  fontFamily: 'k2d',
                  textAlign: 'left',
                  fontSize: 15,
                }}
              >
                Today's ships
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#ffffff',
                  fontFamily: 'k2d',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}
              >
                5
              </Typography>
            </Paper>
            <Paper
              sx={{
                backgroundColor: '#1e1e1e',
                borderRadius: 4,
                padding: 3,
                width: isSmallScreen ? '100%' : 350, // Full width for small screens
                height: 100,
              }}
              elevation={3}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#ffffff',
                  fontFamily: 'K2D',
                  textAlign: 'left',
                  fontSize: 15,
                }}
              >
                Total ships
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#ffffff',
                  fontFamily: 'K2D',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}
              >
                5
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ marginTop: 5 }}>
            <ActivityChart />
          </Box>
        </Grid>

        {/* Right Column: List of Ships */}
        {isSmallScreen ? (
          <Grid item xs={12} >
            <Typography
              variant="h5"
              sx={{
                color: '#ffffff',
                fontFamily: 'k2d',
                textAlign: 'left',
                fontSize: 18,
               // marginBottom: 2,
              }}
            >
              Your Ships
            </Typography>
            <Box sx={{ maxHeight: '80vh', overflowY: 'auto', paddingTop: 5 }}>
              <ShipList /> {/* Ship List for small screens */}
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <Box sx={{ maxHeight: '80vh', overflowY: 'auto', paddingTop: 5 }}>
              <Typography
                variant="h5"
                sx={{
                  color: '#ffffff',
                  fontFamily: 'k2d',
                  textAlign: 'left',
                  fontSize: 18,
                  marginBottom: 2,
                }}
              >
                Your Ships
              </Typography>
              <ShipList /> {/* Ship List for larger screens */}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MainPageMobile;
