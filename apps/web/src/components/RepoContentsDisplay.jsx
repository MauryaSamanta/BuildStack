import { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const RepoContents = ({ contents }) => {
  const [copySuccess, setCopySuccess] = useState(false);


  const handleCopy = async () => {
   
    try {
      await navigator.clipboard.writeText(contents);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        borderRadius:3,
        mt:1,
        p: 2,
        minHeight: '20vh',
        maxHeight:'40vh',
        bgcolor: '#1a1a1a',
        border: '1px solid #333',
        position: 'relative',
        overflowY:'auto',
        overflowX:'auto',
        '&::-webkit-scrollbar': {
            height: '3px',
            width:'1px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e1e1e',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(145deg, #444, #888)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(145deg, #666, #aaa)',
          },
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        zIndex: 1,
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderRadius: '4px',
      }}>
        <Tooltip title="Copy Contents">
          <IconButton 
            onClick={handleCopy}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ fontFamily: 'monospace', ml: 2, mt: 2,overflowX:'auto',
        '&::-webkit-scrollbar': {
            height: '3px',
            width:'1px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e1e1e',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(145deg, #444, #888)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(145deg, #666, #aaa)',
          }, }}>
        
               
        <Typography
              variant="body2"
              sx={{
                color: 'white',
                whiteSpace: 'pre',
                fontSize: 20,
                fontFamily:'k2d'
              }}
            >
              repository contents
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                whiteSpace: 'pre',
                fontSize: '0.9rem',
              }}
            >
              {contents}
            </Typography>
         
      </Box>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Contents copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default RepoContents;