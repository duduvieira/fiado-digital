import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Debt } from '../types';

export const useDebts = (clientId?: string) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setDebts([]);
      setLoading(false);
      return;
    }

    let q;
    if (clientId) {
      q = query(
        collection(db, 'users', currentUser.uid, 'debts'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'users', currentUser.uid, 'debts'),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const debtsData: Debt[] = [];
      snapshot.forEach((doc) => {
        debtsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          paidAt: doc.data().paidAt?.toDate(),
        } as Debt);
      });
      setDebts(debtsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, clientId]);

  const addDebt = async (debt: Omit<Debt, 'id' | 'createdAt' | 'isPaid'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    await addDoc(collection(db, 'users', currentUser.uid, 'debts'), {
      ...debt,
      createdAt: new Date(),
      isPaid: false,
    });
  };

  const markAsPaid = async (debtId: string, paidAmount?: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const debtRef = doc(db, 'users', currentUser.uid, 'debts', debtId);
    await updateDoc(debtRef, {
      isPaid: true,
      paidAt: new Date(),
      paidAmount: paidAmount,
    });
  };

  return {
    debts,
    loading,
    addDebt,
    markAsPaid,
  };
};