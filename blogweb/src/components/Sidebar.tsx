import React from 'react';
import { Box, Toolbar, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Home, Notifications, Message, BookmarkBorder, Person, MoreHoriz, PersonAdd } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

const sidebarItems = [
  { text: 'ホーム', icon: <Home />, url: '/' },
  { text: '通知', icon: <Notifications />, url: '/notification'},
  { text: 'メッセージ', icon: <Message />, url: '/message'},
  { text: 'ブックマーク', icon: <BookmarkBorder />, url: '/bookmark'},
  { text: 'プロフィール', icon: <Person />, url: '/profile'},
  { text: 'サインアップ',icon: <PersonAdd />, url: '/signup'},
  { text: 'ログイン', icon: <LoginIcon />, url: '/login'},
  { text: 'ログアウト', icon: <LogoutIcon />, url: '/logout'},
  { text: 'その他', icon: <MoreHoriz />, url: '/other'},
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuList = (
    <List>
      {sidebarItems.map((item, index) => (
        <ListItem
          key={index}
          component={Link}
          to={item.url || ''}
          sx={{
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText 
            primary={item.text} 
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: isMobile ? '0.9rem' : '1rem',
              },
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box
      sx={{
        width: 240,
        ...(isMobile ? {
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        } : {
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
        }),
      }}
    >
      <Toolbar /> {/* ヘッダーの下のスペーサー */}
      {menuList}
    </Box>
  );
};

export default Sidebar;