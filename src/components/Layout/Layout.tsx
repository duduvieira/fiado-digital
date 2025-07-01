import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          pb: { xs: 10, sm: 2 }, // Add bottom padding on mobile for navigation
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <BottomNavigation />
      </Box>
    </Box>
  );
};

export default Layout;