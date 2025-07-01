import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats, Debt } from '../types';
import { startOfMonth, endOfMonth } from 'date-fns';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReceivable: 0,
    monthlyReceived: 0,
    totalClients: 0,
    totalDebts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Listen to debts changes
    const debtsQuery = query(collection(db, 'users', currentUser.uid, 'debts'));
    const clientsQuery = query(collection(db, 'users', currentUser.uid, 'clients'));

    const unsubscribeDebts = onSnapshot(debtsQuery, (snapshot) => {
      const debts: Debt[] = [];
      snapshot.forEach((doc) => {
        debts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          paidAt: doc.data().paidAt?.toDate(),
        } as Debt);
      });

      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const totalReceivable = debts
        .filter(debt => !debt.isPaid)
        .reduce((sum, debt) => sum + debt.amount, 0);

      const monthlyReceived = debts
        .filter(debt => 
          debt.isPaid && 
          debt.paidAt && 
          debt.paidAt >= monthStart && 
          debt.paidAt <= monthEnd
        )
        .reduce((sum, debt) => sum + (debt.paidAmount || debt.amount), 0);

      const totalDebts = debts.length;

      setStats(prev => ({
        ...prev,
        totalReceivable,
        monthlyReceived,
        totalDebts,
      }));
    });

    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      setStats(prev => ({
        ...prev,
        totalClients: snapshot.size,
      }));
      setLoading(false);
    });

    return () => {
      unsubscribeDebts();
      unsubscribeClients();
    };
  }, [currentUser]);

  return { stats, loading };
};