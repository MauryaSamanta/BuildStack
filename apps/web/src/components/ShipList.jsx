import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Paper,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
const ShipList = ({ships, setShips, setTotalShips, setTodaysShips, setActivityData, activityData, projects, deleteprojectnames, setnewships}) => {
 console.log(ships)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  //const [projects,setprojects]=useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedships,setselectedships]=useState([]);
  const githubToken=useSelector((state)=>state.githubtoken);
  const [isVisible,setisVisible]=useState(!Boolean(githubToken));
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
 useEffect(()=>{
setselectedships(ships.ships);
 },[ships])
 function formatDate(created_at){
 // console.log(created_at)
  const date = new Date(created_at);

  // Get date components
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format day suffix (st, nd, rd, th)
  const suffix = 
    day % 10 === 1 && day !== 11 ? 'st' : 
    day % 10 === 2 && day !== 12 ? 'nd' : 
    day % 10 === 3 && day !== 13 ? 'rd' : 
    'th';

  // Convert hours to 12-hour format and determine am/pm
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  const period = hours < 12 ? 'am' : 'pm';

  // Format minutes
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Construct the formatted date string
  return `${day}${suffix} ${month}, ${year} ${formattedHours}:${formattedMinutes} ${period}`;
}
const difficultyLevels = [
  {
    name: "easy",
    backgroundColor: "#e0f2e9",  // Light green
    textColor: "#2e7d32"        // Medium-dark green
  },
  {
    name: "medium",
    backgroundColor: "#fff3e0",  // Light orange
    textColor: "#ed6c02"        // Medium-dark orange
  },
  {
    name: "hard",
    backgroundColor: "#feecec",  // Light red
    textColor: "#d32f2f"        // Medium-dark red
  }
];
  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedText(ships.ships[index].title);
    handleMenuClose();
  };

  const handleSave = async(index) => {
    console.log(editedText);
    const updatedShips = {...ships};
    updatedShips.ships[index].title = editedText;
    setShips(updatedShips);
    
    try {
      const response=await fetch(`https://buildstack.onrender.com/ship/edit/${ships.ships[index]._id}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title:editedText})
      });
      const data=await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setEditedText('');
    setEditingIndex(null);
  };

  const handleDelete = async(index, shipid) => {
    console.log(ships.ships[index]);
    const today = new Date().toISOString().split("T")[0];
    const isTodaysShip =
      new Date(ships.ships[index].createdAt).toISOString().split("T")[0] === today;
    if (isTodaysShip) {
      setTodaysShips((prev) => prev - 1); 
    }
    const dateString = new Date(ships.ships[index].createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Find the index of the date in activityData
    const foundindex = activityData.findIndex((data) => data.date === dateString);

    // If the date exists, increment the value
    if (foundindex !== -1) {
      const updatedData = [...activityData];
      updatedData[foundindex].value -= 1;
      setActivityData(updatedData); // Update the state
    }
    setTotalShips((prev)=>prev-1);
    
    const shipindex=ships.ships.findIndex((data)=>data._id===shipid)
    const updatedShips = {
      ...ships,
      ships: ships.ships.filter(ship => ship._id !== shipid) // Exclude the ship with the matching _id
    };
    if(selectedships.length===1)
      deleteprojectnames(selectedFilter);
    setShips(updatedShips);
    setSelectedFilter("All");
    console.log(ships.ships);
    setselectedships(ships.ships);
    
    try {
      const response=await fetch(`https://buildstack.onrender.com/ship/delete/${ships.ships[index]._id}`, {
        method:"DELETE"
      });
      const data=await response.json();

    } catch (error) {
      console.log(error);
      
    }
    handleMenuClose();
  };

  const handleprojectclick=(project)=>{
    
    if(project==='All'){
      //console.log(ships.ships);
      setselectedships(ships.ships);
    }
    else
    {
      setselectedships(ships.ships?.map((ship) => ship.project && ship.project.projectName === project ? ship : null).filter(Boolean));
    }
    setSelectedFilter(project);
    
  }

  useEffect(()=>{
    setselectedships(ships.ships);
  },[ships])

  return (
    <Box>
      <Box sx={{ display: "flex",
        flexDirection: "row",
        gap: 2,
        padding: 1,
        justifyContent: "start",
        alignItems: "center",
        overflowX:'auto',
        scrollbarWidth: "none", // For Firefox
        "&::-webkit-scrollbar": {
          display: "none", // For Chrome, Safari, and Edge
        },}} >
      <Button sx={{
          padding: "4px 16px",
          borderRadius: 2,
          border: "2px solid",
          borderColor: selectedFilter === "All" ? "#635acc" : "#4a4a4a",
          backgroundColor: selectedFilter === "All" ? "rgba(64, 60, 107,0.5)" : "rgba(200, 200, 200, 0.2)",
          color: selectedFilter === "All" ? "#635acc" : "white",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(64, 60, 107,0.5)",
            color: "white",
          },
          fontFamily:'k2d', fontSize:12, 
           textTransform: "none"
        }}
        onClick={()=>{handleprojectclick('All')}}>
          
              All
         
          </Button>
          {!githubToken && isSmallScreen &&  isVisible &&(
             <Box sx={{  maxWidth: 'md', mx: 'auto' }}>
             <Paper
               sx={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 padding: "4px 16px",
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
                   //flex: 1,
                   fontFamily:'k2d',
                   fontSize:11
                 }}
               >
                 Login using GitHub to get projects view
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
          
        {projects?.map((project, index)=>(
          <Button sx={{
            padding: "4px 16px",
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
            borderRadius: 2,
            border: "2px solid",
            borderColor: selectedFilter === project ? "#635acc" : "#4a4a4a",
            backgroundColor: selectedFilter === project ? "rgba(64, 60, 107,0.5)" : "rgba(200, 200, 200, 0.2)",
            color: selectedFilter === project ? "#635acc" : "white",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(64, 60, 107,0.5)",
              color: "white",
            },
            fontFamily:'k2d', fontSize:12, 
             textTransform: "none"
          }}
          
          onClick={()=>{handleprojectclick(project)}}>
            
              {project}
     
          </Button>
        ))}

      </Box>
    <List
    sx={{
      borderRadius: 2,
      width: '100%',
      maxHeight: '400px', // Set a max height to enable scrolling
      overflowY: 'auto', // Enable vertical scrolling
      '&::-webkit-scrollbar': {
        width: '3px', // Width of the scrollbar
      },
      '&::-webkit-scrollbar-track': {
        background: '#1e1e1e', // Track background color
        borderRadius: '3px', // Track rounded corners
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(145deg, #444, #888)', // Thumb gradient
        borderRadius: '3px', // Thumb rounded corners
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'linear-gradient(145deg, #666, #aaa)', // Hover effect on thumb
      },
    }}
    >
      {selectedships?.map((ship, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#1e1e1e',
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            
          }}
        >
          {editingIndex === index ? (
            <Box sx={{   width: '100%' }}>
              <TextField
                variant="outlined"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
               // onBlur={()=>{setEditingIndex(null); setEditedText('')}}
                fullWidth
                sx={{
                  backgroundColor: '#1e1e1e',
                  borderRadius: 20,
                  color: '#ffffff',
                  '& .MuiOutlinedInput-root': {
                    color: 'lightgrey',
                    borderRadius: 2,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffffff',
                  },
                  
                }}
              />
              <Box sx={{display:'flex', justifyContent:'space-between',marginTop: 1,}}>
              <Button
                onClick={() => handleSave(index)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                  fontFamily:"k2d"
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {setEditedText(''); setEditingIndex(null)}}
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                  fontFamily:"k2d"
                }}
              >
                Cancel
              </Button>
              </Box>
            </Box>
          ) : (
            <>
            <Box sx={{flexGrow:1}}>
              <Typography
               // primary=
                sx={{
                  color: '#ffffff',
                  fontFamily: 'k2d',
              
                }}
              >{ship.title}</Typography>
              <Typography
               // primary=
                sx={{
                  color: 'grey',
                  fontFamily: 'rubik',
                  fontSize:12,
            
                }}
              >{formatDate(ship.createdAt)}</Typography>
              </Box>
                {ship.diff && <Typography
               sx={{
                 backgroundColor: difficultyLevels[ship.diff].backgroundColor,
                 color: difficultyLevels[ship.diff].textColor,
                 fontWeight: 700,
                 padding: '2px 6px',
                 borderRadius: 2,
             
                 fontFamily:'k2d'
               }}
              >
               {difficultyLevels[ship.diff].name}
              </Typography>}
              <IconButton
                onClick={(event) => handleMenuClick(event, index)}
                sx={{ color: '#ffffff' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
  anchorEl={anchorEl}
  open={selectedIndex === index}
  onClose={handleMenuClose}
  sx={{
    ".MuiMenu-paper":{
       backgroundColor: '#28282B',
       borderRadius:2
    }
  }}
  
>
  <MenuItem onClick={() => handleEdit(index)} sx={{ padding: '8px 16px', color:'white', display:"flex", flexDirection:'row' }}>
    <EditIcon sx={{marginRight:2}}/>
    Edit
  </MenuItem>
  <MenuItem onClick={() => handleDelete(index, ship._id)} sx={{  padding: '8px 16px', color:'red' }}>
  <DeleteIcon sx={{marginRight:2}}/>
    Delete
  </MenuItem>
</Menu>
            </>
          )}
        </Box>
      ))}
    </List>
    </Box>
  );
};

export default ShipList;
