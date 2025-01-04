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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ShipList = () => {
  const [ships, setShips] = useState([
    'Fixed a bug in the payment system',
    'Added dark mode toggle',
    'Refactored API endpoint',
    'Improved mobile responsiveness',
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
    setEditedText(ships[index]);
    handleMenuClose();
  };

  const handleSave = (index) => {
    const updatedShips = [...ships];
    updatedShips[index] = editedText;
    setShips(updatedShips);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedShips = ships.filter((_, i) => i !== index);
    setShips(updatedShips);
    handleMenuClose();
  };

  return (
    <List
      sx={{
       // backgroundColor: '#1e1e1e',
        borderRadius: 2,
       // padding: 2,
        width: '100%',
      }}
    >
      {ships.map((ship, index) => (
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
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <TextField
                variant="outlined"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: '#1e1e1e',
                  borderRadius: 2,
                  color: '#ffffff',
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffffff',
                  },
                }}
              />
              <Button
                onClick={() => handleSave(index)}
                sx={{
                  marginLeft: 1,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                }}
              >
                Save
              </Button>
            </Box>
          ) : (
            <>
              <ListItemText
                primary={ship}
                primaryTypographyProps={{
                  color: '#ffffff',
                  fontFamily: 'Rubik',
                }}
              />
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
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: '#1e1e1e', // Set the menu's background color
        padding: 0, // Remove padding around the menu
        boxShadow: 'none', // Optional: Remove shadow for a flat look
      },
    },
  }}
>
  <MenuItem onClick={() => handleEdit(index)} sx={{ padding: '8px 16px' }}>
    Edit
  </MenuItem>
  <MenuItem onClick={() => handleDelete(index)} sx={{  padding: '8px 16px' }}>
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
