export interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  totalDebt: number;
}

export interface Debt {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt?: Date;
  paidAmount?: number;
}

export interface Payment {
  id: string;
  clientId: string;
  debtId: string;
  amount: number;
  createdAt: Date;
  description?: string;
}

export interface DashboardStats {
  totalReceivable: number;
  monthlyReceived: number;
  totalClients: number;
  totalDebts: number;
}