import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <Toolbar /> {/* ヘッダーの下のスペーサー */}
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}

export default App;
