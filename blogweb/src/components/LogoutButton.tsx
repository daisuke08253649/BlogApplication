import React, { useState } from 'react';
import { Button } from '@mui/material';
import ConfirmDialog from './dialog/ConfirmDialog';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    onLogout(); // ログアウト処理を実行
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleLogoutClick}
        aria-label="ログアウト"
      >
        <LogoutIcon />
      </Button>
      <ConfirmDialog
        open={dialogOpen}
        title="ログアウト確認"
        message="ログアウトしますか？"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default LogoutButton;
