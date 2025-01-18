import React, { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import lightImage from "../assets/images/lighthouse.png";

const CreateMainLoader = () => {
  const [index, setIndex] = useState(0);
  const messages = [
    "Debugging isn't failing, it's learning one step closer to success!",
    "You don’t need to know everything; just start building and learn as you go.",
    "Code your dreams into reality, one line at a time.",
    "Every great app started with a blank screen. You've got this!",
    "Failures in code are just stepping stones to innovation.",
    "Think it, code it, change the world.",
    "The best way to predict the future is to code it.",
    "Every error teaches you something the docs couldn’t.",
    "You’re not stuck; you’re just one Google search away from a breakthrough.",
    "Your code doesn’t have to be perfect; it just has to run.",
    "Stay curious, keep coding, and embrace the process.",
    "Coding is like magic; you’re literally creating something out of nothing.",
    "Your keyboard is your superpower—use it to build the impossible.",
    "Think of every bug as a challenge, not a problem.",
    "Creativity and logic are your ultimate tools—use them wisely.",
    "If your code compiles, celebrate; if it doesn’t, iterate.",
    "One small script can make a huge difference—start today.",
    "Great developers aren’t born; they’re self-taught, self-motivated, and relentless.",
    "Your future self will thank you for the time you spend coding today.",
    "Don’t compare your Chapter 1 to someone else’s Chapter 20. Keep coding",
  ];
   const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setIndex(randomIndex);
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        height: "100vh",
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: "K2D",
      }}
    >
      {/* Lighthouse Glow Animation */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          animation: "pulse 3s infinite",
        }}
      >
        <img
          src={lightImage}
          alt="Lighthouse"
          style={{
            width: "150px",
            filter: "drop-shadow(0px 0px 15px #ffffff)",
          }}
        />
      </Box>

      {/* Loading Text */}
      {!isSmallScreen && <Typography
        sx={{
          color: "white",
          fontSize: "20px",
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "center",
          animation: "fadeIn 3s ease-in-out infinite",
          fontFamily:'k2d',
          letterSpacing:5
        }}
      >
        {messages[index]}
      </Typography>}

      {/* Keyframes for animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0px 0px 15px #ffffff);
            }
            50% {
              transform: scale(1.1);
              filter: drop-shadow(0px 0px 30px #ffffff);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default CreateMainLoader;
