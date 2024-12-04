import React from 'react';
import { Box, Avatar, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface HeaderProps {
  onMenuClick?: () => void;
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6">
          <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
            ブログアプリ
          </Link>
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">{user.name}</Typography>
            {user.avatarUrl ? (
              <Avatar 
                src={user.avatarUrl}
                alt={user.name}
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <AccountCircleIcon 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  color: 'action.active' 
                }} 
              />
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;