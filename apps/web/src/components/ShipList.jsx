import React, { useState } from 'react';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const ShipList = ({ships, setShips, setTotalShips, setTodaysShips, setActivityData, activityData}) => {
 // console.log(ships)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
 
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

  const handleDelete = async(index) => {
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
    
    setShips((prevShips) => {
      // Create a copy of the previous ships array
      const updatedShips = { ...prevShips, ships: [...prevShips.ships] };
  
      // Remove the ith element
      updatedShips.ships.splice(index, 1);
  
      return updatedShips; // Return the updated ships object
    });
   
    try {
      const response=await fetch(`https://buildstack.onrender.com/ship/delete/${ships.ships[index]._id}`, {
        method:"DELETE"
      });
      const data=await response.json();

    } catch (error) {
      
    }
    handleMenuClose();
  };

  return (
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
      {ships?.ships?.map((ship, index) => (
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
            <Box>
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
                  fontSize:12
                }}
              >{formatDate(ship.createdAt)}</Typography>
              </Box>
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
  // MenuProps={{
  //   PaperProps: {
  //     sx: {
  //       backgroundColor: 'grey', // Set the menu's background color
  //       padding: 0, // Remove padding around the menu
  //       boxShadow: 'none', // Optional: Remove shadow for a flat look
  //     },
  //   },
  // }}
>
  <MenuItem onClick={() => handleEdit(index)} sx={{ padding: '8px 16px', color:'white', display:"flex", flexDirection:'row' }}>
    <EditIcon sx={{marginRight:2}}/>
    Edit
  </MenuItem>
  <MenuItem onClick={() => handleDelete(index)} sx={{  padding: '8px 16px', color:'red' }}>
  <DeleteIcon sx={{marginRight:2}}/>
    Delete
  </MenuItem>
</Menu>
            </>
          )}
        </Box>
      ))}
    </List>
  );
};

export default ShipList;
