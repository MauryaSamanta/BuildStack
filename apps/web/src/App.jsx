import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import { createMuiTheme, createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import MainPageMobile from './pages/MainPageMobile';

const App = () => {
  const theme = createTheme({
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "*::-webkit-scrollbar": {
            width: "5px"
          },
          "*::-webkit-scrollbar-track": {
            background: "#635acc"
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#1D388F61",
            borderRadius: "2px"
          }
        }
      }
    }
  });
  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Media query for phones and tablets

  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
     
     <CssBaseline />

      <Routes>
        <Route path="/" element={!isSmallScreen?<MainPage />:<MainPageMobile/>} />
        {/* Add more routes as needed */}
      </Routes>
      </ThemeProvider>
  </BrowserRouter>
  );
};

export default App;
