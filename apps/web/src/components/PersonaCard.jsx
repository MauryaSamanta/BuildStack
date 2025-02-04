import React from 'react';
import { Box, Typography, Modal } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ship from '../assets/images/mayflower-ship.png';
const PersonaCardModal = ({ open, onClose, persona }) => {
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
          padding: { xs: 2, md: 4 }
        }}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' } // Adjust opacity here
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
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: '100%', sm: '450px' },
                background: `linear-gradient(135deg, ${persona.color[0]}, ${persona.color[1]})`,
                borderRadius: '24px',
                padding: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              {/* Decorative background circles */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(40px)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-10%',
                  left: '-10%',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(30px)',
                }}
              />

              {/* Logo Container */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection:'row',
                    alignItems:'center',
                    mb: 4
                  }}
                >
                  <Box
                    component="img"
                    src={ship}
                    alt="Mayflower Ship"
                    sx={{
                      width: '70px',
                      height: '70px',
                      filter: 'brightness(0) invert(1)',
                      opacity: 0.9
                    }}
                  />
                 
                </Box>
              </motion.div>

              {/* Persona Text Container */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  
                  <Typography
                    //variant="h4"
                    sx={{
                      color: 'white',
                      fontFamily: 'k2d',
                      fontSize: 25,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      //lineHeight: 1.6,
                      opacity: 0.95,
                      textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {persona.text}
                  </Typography>
                </Box>
              </motion.div>

              {/* Close button */}
           
                <Box
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    }
                  }}
                >
                  <Typography sx={{ color: 'white', fontSize: '18px' }}>×</Typography>
                </Box>
      
            </Box>
          </motion.div>
          
        </Modal>
     
    
  )
}
</AnimatePresence>
  )
}

export default PersonaCardModal;