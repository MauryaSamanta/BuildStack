import { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const RepoTreeDisplay = ({ files, repoName }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const generateStructure = (files) => {
    const structure = new Map();
    structure.set(repoName, {
        text: repoName,
        depth: 0,
        isFolder: true,
        fullPath: repoName,
      });
    // Sort files by path
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));
    
    sortedFiles.forEach(file => {
      const parts = file.path.split('/');
      let depth = 0;
      let path = '';
      
      parts.forEach(part => {
        depth++;
        path += (path ? '/' : '') + part;
        if (!structure.has(path)) {
          const isFolder = depth < parts.length;
          const prefix = '│   '.repeat(depth - 1);
          structure.set(path, {
            text: prefix + '├── ' + part,
            depth,
            isFolder,
            fullPath: path
          });
        }
      });
    });

    // Add ending lines for better visualization
    const result = Array.from(structure.values());
    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      const next = result[i + 1];
      
      if (next && current.depth > next.depth) {
        const prefix = '│   '.repeat(next.depth - 1);
        result.splice(i + 1, 0, {
          text: prefix + '└──',
          depth: next.depth,
          isFolder: false,
          fullPath: current.fullPath + '_end'
        });
      }
    }

    return result;
  };

  const handleCopy = async () => {
    const structureText = generateStructure(files)
      .map(item => item.text)
      .join('\n');
    try {
      await navigator.clipboard.writeText(structureText);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const structureItems = generateStructure(files);

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
       <Typography
              variant="body2"
              sx={{
                color: 'white',
                whiteSpace: 'pre',
                fontSize: 20,
                fontFamily:'k2d'
              }}
            >
              directory structure
            </Typography>
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        zIndex: 1,
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderRadius: '4px',
      }}>
        <Tooltip title="Copy Structure">
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
        {structureItems.map((item, index) => (
          <Box
            key={item.fullPath}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.5,
              //pl: 1,
             
              borderRadius: 1,
            }}
          >
            
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                whiteSpace: 'pre',
                fontSize: '0.9rem',
              }}
            >
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Structure copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default RepoTreeDisplay;