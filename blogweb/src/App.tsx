import React, { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme, Drawer } from '@mui/material';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="App">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header onMenuClick={handleDrawerToggle} />
        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* モバイル用のドロワー */}
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={isMobile ? handleDrawerToggle : undefined}
            ModalProps={{
              keepMounted: true, // モバイルでのパフォーマンス向上のため
            }}
            sx={{
              display: { xs: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box',
                width: 240,
                ...(!isMobile && {
                  position: 'relative',
                }),
              },
            }}
          >
            <Sidebar />
          </Drawer>
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${240}px)` },
            }}
          >
            <Toolbar /> {/* ヘッダーの下のスペーサー */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
