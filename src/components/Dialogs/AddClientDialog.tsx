import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from '../../utils/validators';
import { Client } from '../../types';

interface AddClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, 'id' | 'createdAt' | 'totalDebt'>) => Promise<void>;
  editingClient?: Client;
}

interface FormData {
  name: string;
  phone: string;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingClient,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: editingClient?.name || '',
      phone: editingClient?.phone || '',
    },
  });

  React.useEffect(() => {
    if (editingClient) {
      reset({
        name: editingClient.name,
        phone: editingClient.phone,
      });
    } else {
      reset({
        name: '',
        phone: '',
      });
    }
  }, [editingClient, reset]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="WhatsApp"
                  placeholder="(11) 99999-9999"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
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
            {editingClient ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddClientDialog;