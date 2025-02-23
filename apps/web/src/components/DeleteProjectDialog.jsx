import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Modal
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

const DeleteProjectDialog = ({ project, open, onClose, onDelete }) => {
  //console.log(open);
  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: 2, md: 4 },
            //backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            style={{
             
             
              //bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 12,
              padding: '16px',
              //minWidth: '400px',
              backgroundColor: 'white'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: -8,
                  top: -8,
                }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>

              <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                pb: 1
              }}>
                <DeleteOutlineIcon color="error" />
                <Typography variant="h6" component="span">
                  Delete Project
                </Typography>
              </DialogTitle>

              <DialogContent sx={{ pb: 2, pt: 1 }}>
                <DialogContentText>
                  Do you want to delete project <Box component="span" sx={{ fontWeight: 600 }}>{project?.name}</Box>?
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    This action cannot be undone.
                  </Typography>
                </DialogContentText>
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button 
                  onClick={onClose}
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onDelete(project.id);
                    onClose();
                  }}
                  variant="contained"
                  color="error"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                  autoFocus
                >
                  Delete Project
                </Button>
              </DialogActions>
            </Box>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default DeleteProjectDialog;