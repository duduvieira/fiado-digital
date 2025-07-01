import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debtSchema } from '../../utils/validators';
import { Client } from '../../types';

interface AddDebtDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { clientId: string; amount: number; description: string }) => Promise<void>;
  clients: Client[];
}

interface FormData {
  clientId: string;
  amount: number;
  description: string;
}

const AddDebtDialog: React.FC<AddDebtDialogProps> = ({
  open,
  onClose,
  onSubmit,
  clients,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      clientId: '',
      amount: 0,
      description: '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar dívida:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Dívida</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.clientId}>
                  <InputLabel>Cliente</InputLabel>
                  <Select {...field} label="Cliente">
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Valor"
                  type="number"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição (opcional)"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isSubmitting}
          >
            Adicionar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDebtDialog;