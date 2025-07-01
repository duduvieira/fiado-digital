import React from 'react';
import { 
  BottomNavigation as MuiBottomNavigation, 
  BottomNavigationAction,
  Paper
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getValue = () => {
    if (location.pathname === '/dashboard') return 0;
    if (location.pathname === '/clients') return 1;
    if (location.pathname === '/debts') return 2;
    return 0;
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/clients');
        break;
      case 2:
        navigate('/debts');
        break;
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <MuiBottomNavigation
        value={getValue()}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label="Clientes"
          icon={<PeopleIcon />}
        />
        <BottomNavigationAction
          label="Dívidas"
          icon={<ReceiptIcon />}
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;