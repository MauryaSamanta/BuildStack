import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
//import "../App.css"; // Include this if you need global styles
import shipImage from "../assets/images/mayflower-ship.png";

const CreateRepoLoader = () => {
  const [textIndex, setTextIndex] = useState(0);
  const messages = ["Creating Project...", "Initializing Your Repository..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
       // width: "100vw",
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
      {/* Ship Animation */}
      <Box
        sx={{
          position: "absolute",
          bottom: "50%",
          transform: "translateY(50%)",
          animation: "moveShip 3s linear infinite",
        }}
      >
        <img
          src={shipImage}
          alt="Mayflower Ship"
          style={{
            width: "50px",
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
          fontFamily:'k2d'
        }}
      >
        {messages[textIndex]}
      </Typography>

      {/* Keyframes for animation */}
      <style>
        {`
           @keyframes moveShip {
      0% {
        left: 100%;
        opacity: 0; /* Fully transparent at the start */
      }
      10% {
        opacity: 1; /* Fade in */
      }
      90% {
        opacity: 1; /* Fully visible */
      }
      100% {
        left: -2px;
        opacity: 0; /* Fade out */
      }
    }
        `}
      </style>
    </Box>
  );
};

export default CreateRepoLoader;
