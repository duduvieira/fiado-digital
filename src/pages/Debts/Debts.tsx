import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import { Add, CheckCircle } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import AddDebtDialog from '../../components/Dialogs/AddDebtDialog';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useDebts } from '../../hooks/useDebts';
import { useClients } from '../../hooks/useClients';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Debts: React.FC = () => {
  const { debts, loading: debtsLoading, addDebt, markAsPaid } = useDebts();
  const { clients, loading: clientsLoading } = useClients();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const handleAddDebt = async (data: { clientId: string; amount: number; description: string }) => {
    try {
      setError('');
      await addDebt(data);
    } catch (error) {
      setError('Erro ao adicionar dívida. Tente novamente.');
    }
  };

  const handleMarkAsPaid = async (debtId: string) => {
    if (window.confirm('Marcar esta dívida como paga?')) {
      try {
        await markAsPaid(debtId);
      } catch (error) {
        setError('Erro ao marcar como pago. Tente novamente.');
      }
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  if (debtsLoading || clientsLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Carregando dívidas..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dívidas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Controle todas as dívidas dos seus clientes
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {debts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma dívida registrada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adicione a primeira dívida para começar o controle
            </Typography>
          </Box>
        ) : (
          debts.map((debt) => (
            <Card key={debt.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {getClientName(debt.clientId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(debt.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`R$ ${debt.amount.toFixed(2).replace('.', ',')}`}
                      color={debt.isPaid ? 'success' : 'error'}
                      variant="outlined"
                    />
                    {!debt.isPaid && (
                      <IconButton
                        color="success"
                        onClick={() => handleMarkAsPaid(debt.id)}
                        size="small"
                      >
                        <CheckCircle />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                
                {debt.description && (
                  <Typography variant="body2" color="text.secondary">
                    {debt.description}
                  </Typography>
                )}

                {debt.isPaid && debt.paidAt && (
                  <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
                    Pago em {format(debt.paidAt, 'dd/MM/yyyy', { locale: ptBR })}
                  </Typography>
                )}
              </CardContent>
            </Card>
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

        <AddDebtDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleAddDebt}
          clients={clients}
        />
      </Container>
    </Layout>
  );
};

export default Debts;