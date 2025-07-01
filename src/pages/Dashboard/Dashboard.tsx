import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Receipt,
  AttachMoney,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import DashboardCard from '../../components/Dashboard/DashboardCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Carregando dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visão geral do seu negócio
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total a Receber"
              value={`R$ ${stats.totalReceivable.toFixed(2).replace('.', ',')}`}
              icon={<TrendingUp />}
              color="error.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Recebido no Mês"
              value={`R$ ${stats.monthlyReceived.toFixed(2).replace('.', ',')}`}
              icon={<AttachMoney />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total de Clientes"
              value={stats.totalClients.toString()}
              icon={<People />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total de Dívidas"
              value={stats.totalDebts.toString()}
              icon={<Receipt />}
              color="warning.main"
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;