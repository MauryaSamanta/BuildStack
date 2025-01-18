import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import { createMuiTheme, createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import MainPageMobile from './pages/MainPageMobile';
import {useSelector} from 'react-redux';
import AuthPage from './pages/AuthPage';
import PrivacyPolicyPage from './pages/Privacy';
import Callback from './components/Callback';
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
  const user=useSelector(state=>state.user);
  const token=useSelector(state=>state.token);
  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
     
     <CssBaseline />

      <Routes>
        <Route path="/" element={user && token?(!isSmallScreen?<MainPage />:<MainPageMobile/>):(<AuthPage/>)} />
        <Route path="/home" element={!isSmallScreen && user && token?(<MainPage />):(isSmallScreen && user && token ?(<MainPageMobile/>):(<AuthPage/>))} />
        <Route path="/callback" element={<Callback/>} />
      </Routes>
      </ThemeProvider>
  </BrowserRouter>
  );
};

export default App;
