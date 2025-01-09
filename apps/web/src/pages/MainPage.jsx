import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShipList from '../components/ShipList';  // Assuming ShipList is a component that lists ships.
import Navbar from '../components/Navbar';
import ActivityChart from '../components/ActivityChart';
import { useSelector } from 'react-redux';
import Empty from "../assets/images/empty-folder.png";
import { CircularProgress } from '@mui/material';
import SaveIcon from "../assets/images/bookmark.png";
const MainPage = () => {
  const user = useSelector((state)=>state.user);
  const token = useSelector((state)=>state.token);
   const [formData, setFormData] = useState({
      userId: user.id,
      title: '',
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      console.log(name, value)
      setFormData({ ...formData, [name]: value });
    };
 // console.log(user);
  const [ships,setShips]=useState([]);  
  const [todaysShips,setTodaysShips]=useState(0);
  const [totalShips,setTotalShips]=useState(0);
  const [activityData,setActivityData]=useState([]);
  const [loading,setloading]=useState(false);
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
              <img src={SaveIcon} alt="Save" style={{width:20,height:20,marginRight:5}}/>
              <Typography variant="button" sx={{ fontFamily: "rubik" }} onClick={user && token && !loading && saveShip}>
               {user && token?( !loading?("Save!!"):(<CircularProgress size={20} color='black'/>)):("Sign up!!")}
              </Typography>
            </Button>
          <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 5, justifyContent: 'center' }}>
            <Paper sx={{ marginRight: 10, backgroundColor: '#1e1e1e', borderRadius: 4, padding: 3, width: 350, height: 100 }} elevation={3}>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontSize: 15 }}>Today's ships</Typography>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontWeight: 'bold', fontSize: 25 }}>{todaysShips}</Typography>
            </Paper>
            <Paper sx={{ marginRight: 10, backgroundColor: '#1e1e1e', borderRadius: 4, padding: 3, width: 350, height: 100 }} elevation={3}>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "K2D", textAlign: 'left', fontSize: 15 }}>Total ships</Typography>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "K2D", textAlign: 'left', fontWeight: 'bold', fontSize: 25 }}>{totalShips}</Typography>
            </Paper>
          </Box>
          <Box sx={{marginTop:5, width:550}}>
          <ActivityChart data={activityData}/>
          </Box>
        </Grid>

        {/* Right Column: List of Ships */}
        <Grid item xs={12} md={6}>
          {user && token && ships?.ships?.length>0 && !loading?(<Box sx={{ maxHeight: '80vh', overflowY: 'auto', paddingTop: 5, marginTop:5 }}>
            <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontSize: 18, marginBottom:2 }}>Your Ships</Typography>
            {/* Ship List should be scrollable */}
            <ShipList ships={ships} setShips={setShips} setTodaysShips={setTodaysShips} setTotalShips={setTotalShips} setActivityData={setActivityData}
            activityData={activityData}/>
          </Box>):!loading && ships?.ships?.length===0?(
            <Box sx={{ maxHeight: '80vh', overflowY: 'auto', paddingTop: 5, marginTop:5}}>
             <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: "k2d", textAlign: 'left', fontSize: 18, marginBottom:2 }}>Your Ships</Typography>
             <Box sx={{alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'column', marginTop:10}}> 
             <img src={Empty} alt="Empty" style={{width:100,height:100, alignSelf:'center'}}/>
             <Typography variant="h5" sx={{ color: 'grey', fontFamily: "k2d", textAlign: 'left', fontSize: 18, marginBottom:2, marginTop:5 }}>Seems you haven't shipped anything yet</Typography>
             </Box>
            </Box>
          ):(<CircularProgress color='grey' thickness={5} size={30}/>)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainPage;
