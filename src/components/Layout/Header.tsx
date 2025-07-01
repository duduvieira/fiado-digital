import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccountCircle,
  Store,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Store sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fiado Digital
        </Typography>
        
        {/* Desktop Navigation */}
        {currentUser && !isMobile && (
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => handleNavigation('/dashboard')}
              sx={{
                mx: 1,
                backgroundColor: isActivePage('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<PeopleIcon />}
              onClick={() => handleNavigation('/clients')}
              sx={{
                mx: 1,
                backgroundColor: isActivePage('/clients') ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              Clientes
            </Button>
            <Button
              color="inherit"
              startIcon={<ReceiptIcon />}
              onClick={() => handleNavigation('/debts')}
              sx={{
                mx: 1,
                backgroundColor: isActivePage('/debts') ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              Dívidas
            </Button>
          </Box>
        )}

        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {currentUser.displayName || currentUser.email}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;