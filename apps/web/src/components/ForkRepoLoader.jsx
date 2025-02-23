import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import forkImage from "../assets/images/fork.png";

const ForkLoader = () => {
  const [textIndex, setTextIndex] = useState(0);
  const messages = ["Forking Repository...", "Cloning the Codebase...", "Setting Up Your Fork..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        fontFamily: "K2D",
      }}
    >
      {/* Fork Animation */}
      <Box
        sx={{
          position: "relative",
          animation: "scaleFork 1.5s ease-in-out infinite",
        }}
      >
        <img
          src={forkImage}
          alt="Forking"
          style={{
            width: "60px",
          }}
        />
      </Box>

      {/* Loading Text */}
      <Typography
        sx={{
          color: "white",
          fontSize: 15,
          marginTop: "20px",
          fontWeight: 600,
          fontFamily: "K2D",
        }}
      >
        {messages[textIndex]}
      </Typography>

      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes scaleFork {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default ForkLoader;
