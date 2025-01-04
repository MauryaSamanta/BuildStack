import React from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShipList from '../components/ShipList';  // Assuming ShipList is a component that lists ships.
import Navbar from '../components/Navbar';
import ActivityChart from '../components/ActivityChart';

const MainPage = () => {
  return (
    <Box
      sx={{
        background: "black",
        //height: "100vh",
        flex:1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start", // Align to top
        // /textAlign: "center",
        position: "relative",
       paddingLeft:15,
       paddingRight:15,
       
      }}
    >
        <Navbar/>
      <Grid container spacing={4}>
        {/* Left Column: Textfield and Stats */}
        <Grid item xs={12} md={6}>
          <Box sx={{ paddingTop: 10 }}>
          <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontSize: 18, marginBottom:2 }}>What did you ship today?</Typography>
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
                width: "90%", // Adjust the width here to make it smaller or larger
                
              }}
              inputProps={{
                style: {
                  color: '#ffffff', // Text color
                 // opacity: 0.6, // Placeholder text opacity
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
              <Typography variant="button" sx={{ fontFamily: "rubik" }}>
                Save!!
              </Typography>
            </Button>
          <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 5, justifyContent: 'center' }}>
            <Paper sx={{ marginRight: 10, backgroundColor: '#1e1e1e', borderRadius: 4, padding: 3, width: 350, height: 100 }} elevation={3}>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontSize: 15 }}>Today's ships</Typography>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontWeight: 'bold', fontSize: 25 }}>5</Typography>
            </Paper>
            <Paper sx={{ marginRight: 10, backgroundColor: '#1e1e1e', borderRadius: 4, padding: 3, width: 350, height: 100 }} elevation={3}>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "K2D", textAlign: 'left', fontSize: 15 }}>Total ships</Typography>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "K2D", textAlign: 'left', fontWeight: 'bold', fontSize: 25 }}>5</Typography>
            </Paper>
          </Box>
          <Box sx={{marginTop:5}}>
          <ActivityChart/>
          </Box>
        </Grid>

        {/* Right Column: List of Ships */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxHeight: '80vh', overflowY: 'auto', paddingTop: 5, marginTop:5 }}>
            <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontSize: 18, marginBottom:2 }}>Your Ships</Typography>
            {/* Ship List should be scrollable */}
            <ShipList /> {/* Assuming this component renders a scrollable list of ships */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainPage;
