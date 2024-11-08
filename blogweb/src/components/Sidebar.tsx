import React from 'react';
import { Paper, Toolbar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Notifications, Message, BookmarkBorder, Person, MoreHoriz, PersonAdd } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

const sidebarItems = [
  { text: 'ホーム', icon: <Home />, url: '/' },
  { text: '通知', icon: <Notifications /> },
  { text: 'メッセージ', icon: <Message /> },
  { text: 'ブックマーク', icon: <BookmarkBorder /> },
  { text: 'プロフィール', icon: <Person /> },
  { text: 'サインアップ',icon: <PersonAdd />, url: '/signup'},
  { text: 'ログイン', icon: <LoginIcon /> },
  { text: 'ログアウト', icon: <LogoutIcon /> },
  { text: 'その他', icon: <MoreHoriz /> },
];

const Sidebar: React.FC = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 240,
        flexShrink: 0,
        position: 'fixed',
        height: 'calc(100vh - 64px)', // Subtract AppBar height
        overflowY: 'auto',
      }}
    >
      <Toolbar /> {/* This empty Toolbar acts as a spacer */}
      <List>
        {sidebarItems.map((item, index) => (
          <ListItem key={index} component={Link} to={item.url || ''} style={{ color: 'inherit' }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;