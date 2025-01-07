import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, useMediaQuery, CircularProgress } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShipList from '../components/ShipList'; // Assuming ShipList is a component that lists ships.
import Navbar from '../components/Navbar';
import ActivityChart from '../components/ActivityChart';
import { useSelector } from 'react-redux';
import Empty from "../assets/images/empty-folder.png";
const MainPageMobile = () => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Media query for phones and tablets
  const user=useSelector(state=>state.user);
  const token=useSelector(state=>state.token);
  const [ships,setShips]=useState([]);  
   const [todaysShips,setTodaysShips]=useState(0);
   const [totalShips,setTotalShips]=useState(0);
   const [activityData,setActivityData]=useState([]);
   const [loading,setloading]=useState(false);
   const [formData, setFormData] = useState({
         userId: user.id,
         title: '',
       });
   
       const handleInputChange = (e) => {
         const { name, value } = e.target;
         console.log(name, value)
         setFormData({ ...formData, [name]: value });
       };
   useEffect(() => {
     setloading(true);
     const getships=async()=>{
       const response=await fetch(`https://buildstack.onrender.com/ship/getships/${user.id}`,{
         method:"GET",
       });
       const ships=await response.json();
       console.log(ships); 
       setloading(false);
       setShips(ships);
       setTodaysShips(ships.todaysShips);
       setTotalShips(ships.totalShips);
       setActivityData(ships.shipsPerDay);
     }
     getships();
   },[]);
 
   const saveShip=async()=>{
     setloading(true);
     try {
       const response=await fetch(`https://buildstack.onrender.com/ship/save`,{
         method:"POST",
         headers:{"Content-Type":"application/json"},
         body:JSON.stringify(formData)
       });
       const returneddata=await response.json();
       setShips((prevState) => ({
         ...prevState, // Keep all other attributes unchanged
         ships: [returneddata,...prevState.ships], // Update the `ships` array
       }));
       setloading(false);
       setTodaysShips((prev)=>prev+1);
       setTotalShips((prev)=>prev+1);
       const createdAtDate = new Date(returneddata.createdAt);
       const dateString = createdAtDate.toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
       });
 
       // Find the index of the date in activityData
       const index = activityData.findIndex((data) => data.date === dateString);
 
       // If the date exists, increment the value
       if (index !== -1) {
         const updatedData = [...activityData];
         updatedData[index].value += 1;
         setActivityData(updatedData); // Update the state
       }
     } catch (error) {
       console.log(error);
     }
     setFormData({...formData, title:''});
 
   }

    // const activityData = [
    //   { date: "Dec 24", value: 0 },
    //   { date: "Dec 25", value: 0 },
    //   { date: "Dec 26", value: 0 },
    //   { date: "Dec 27", value: 0 },
    //   { date: "Dec 28", value: 0 },
    //   { date: "Dec 29", value: 1 },
    //   { date: "Dec 30", value: 0 },
    //   { date: "Dec 31", value: 0 },
    //   { date: "Jan 1", value: 0 },
    //   { date: "Jan 2", value: 3 },
    //   { date: "Jan 3", value: 0 },
    //   { date: "Jan 4", value: 0 },
    //   { date: "Jan 5", value: 0 },
    // ];
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
              name="title"
              value={formData.title}
              onChange={handleInputChange}
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
            <Typography variant="button" sx={{ fontFamily: 'rubik' }}  onClick={user && token && !loading && saveShip}>
            {user && token?( !loading?("Save!!"):(<CircularProgress size={20} color='black'/>)):("Sign up!!")}
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
                {todaysShips}
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
                {totalShips}
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ marginTop: 5 }}>
            <ActivityChart data={activityData} />
          </Box>
        </Grid>

        
          <Grid item xs={12} md={6}>
            {ships?.ships?.length>0 && !loading?(<Box sx={{ maxHeight: '80vh', overflowY: 'auto',paddingTop:2 }}>
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
              <ShipList ships={ships} setShips={setShips} setTodaysShips={setTodaysShips} setTotalShips={setTotalShips} setActivityData={setActivityData}
            activityData={activityData}/>
            </Box>):ships?.ships?.length===0 && !loading?(
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
              <Box sx={{alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'column'}}>
               <img src={Empty} alt="Empty" style={{width:100,height:100, alignSelf:'center'}}/>
              <Typography variant="h5" sx={{ color: 'grey', fontFamily: "k2d", textAlign: 'left', fontSize: 18, marginBottom:2 }}>Seems you haven't shipped anything yet</Typography>
              </Box>
            </Box>
            ):loading && (
              <CircularProgress color='grey' thickness={5} size={30}/>  
            )}
          </Grid>
        
      </Grid>
    </Box>
  );
};

export default MainPageMobile;
