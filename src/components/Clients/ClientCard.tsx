import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  WhatsApp,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Client } from '../../types';
import { generateWhatsAppMessage, sendWhatsAppMessage } from '../../utils/whatsapp';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  const handleWhatsApp = () => {
    if (client.totalDebt > 0) {
      const message = generateWhatsAppMessage(client.name, client.totalDebt);
      sendWhatsAppMessage(client.phone, message);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {client.name}
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onEdit(client)}
              color="primary"
            >
              <Edit />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(client.id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {client.phone}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={`R$ ${client.totalDebt.toFixed(2).replace('.', ',')}`}
            color={client.totalDebt > 0 ? 'error' : 'success'}
            variant="outlined"
          />
          
          {client.totalDebt > 0 && (
            <IconButton
              color="success"
              onClick={handleWhatsApp}
              sx={{ ml: 1 }}
            >
              <WhatsApp />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClientCard;