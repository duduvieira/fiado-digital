import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary.main' 
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              color: color,
              mr: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;