import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import ClientCard from '../../components/Clients/ClientCard';
import AddClientDialog from '../../components/Dialogs/AddClientDialog';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useClients } from '../../hooks/useClients';
import { Client } from '../../types';

const Clients: React.FC = () => {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [error, setError] = useState('');

  const handleAddClient = async (data: Omit<Client, 'id' | 'createdAt' | 'totalDebt'>) => {
    try {
      setError('');
      if (editingClient) {
        await updateClient(editingClient.id, data);
        setEditingClient(undefined);
      } else {
        await addClient(data);
      }
    } catch (error) {
      setError('Erro ao salvar cliente. Tente novamente.');
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        setError('Erro ao excluir cliente. Tente novamente.');
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingClient(undefined);
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Carregando clientes..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Clientes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie seus clientes e acompanhe suas dívidas
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {clients.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum cliente cadastrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adicione seu primeiro cliente para começar
            </Typography>
          </Box>
        ) : (
          clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          ))
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 16 },
            right: 16,
          }}
          onClick={() => setDialogOpen(true)}
        >
          <Add />
        </Fab>

        <AddClientDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleAddClient}
          editingClient={editingClient}
        />
      </Container>
    </Layout>
  );
};

export default Clients;