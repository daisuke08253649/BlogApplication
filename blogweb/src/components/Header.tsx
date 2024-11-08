import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6">
          <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
            ブログアプリ
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;