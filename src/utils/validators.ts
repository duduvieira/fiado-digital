import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
});

export const debtSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  amount: z.number().min(0.01, 'Valor deve ser maior que R$ 0,00'),
  description: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Valor deve ser maior que R$ 0,00'),
  description: z.string().optional(),
});

export const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});