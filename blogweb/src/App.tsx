import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from './api/auth';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme, Drawer } from '@mui/material';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

interface User {
  name: string;
  avatarUrl?: string;
}

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setUser] = useState<User | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // デフォルトアバター画像のURL
  const defaultAvatarUrl = "https://mui.com/static/images/broken-image.jpg";

  // ユーザー情報を設定する共通関数
  const setUserData = (userData: any) => {
    setUser({
      name: userData.name || userData.email?.split('@')[0],
      avatarUrl: userData.image?.url || defaultAvatarUrl
    });
  };

  const handleLogin = async (userData: User) => {
    setUserData(userData)
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      // ユーザー状態をクリア
      setUser(undefined);
      navigate('/login'); // ログインページにリダイレクト
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };
  // 初期ロード時の処理
  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    if (accessToken && client && uid) {
      // ヘッダーにトークンを設定
      axios.defaults.headers.common['access-token'] = accessToken;
      axios.defaults.headers.common['client'] = client;
      axios.defaults.headers.common['uid'] = uid;

      // ユーザー情報を取得
      const fetchUserData = async () => {
        try {
          const response = await authAPI.validateToken();
          setUserData(response.data.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // エラー時はローカルストレージをクリア
          localStorage.removeItem('access-token');
          localStorage.removeItem('client');
          localStorage.removeItem('uid');
          setUser(undefined);
        }
      };

      fetchUserData();
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="App">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header onMenuClick={handleDrawerToggle} user={user} />
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
            <Sidebar onLogout={handleLogout} />
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
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
