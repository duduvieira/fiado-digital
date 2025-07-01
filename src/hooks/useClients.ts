import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Client } from '../types';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setClients([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', currentUser.uid, 'clients'),
      orderBy('name')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const clientsData: Client[] = [];
      
      for (const clientDoc of snapshot.docs) {
        const clientData = {
          id: clientDoc.id,
          ...clientDoc.data(),
          createdAt: clientDoc.data().createdAt?.toDate() || new Date(),
        } as Client;

        // Calculate total debt for this client
        const debtsQuery = query(
          collection(db, 'users', currentUser.uid, 'debts'),
          where('clientId', '==', clientDoc.id),
          where('isPaid', '==', false)
        );
        
        const debtsSnapshot = await getDocs(debtsQuery);
        const totalDebt = debtsSnapshot.docs.reduce((sum, debtDoc) => {
          return sum + (debtDoc.data().amount || 0);
        }, 0);

        clientData.totalDebt = totalDebt;
        clientsData.push(clientData);
      }
      
      setClients(clientsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'totalDebt'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    await addDoc(collection(db, 'users', currentUser.uid, 'clients'), {
      ...client,
      createdAt: new Date(),
      totalDebt: 0,
    });
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const clientRef = doc(db, 'users', currentUser.uid, 'clients', clientId);
    await updateDoc(clientRef, updates);
  };

  const deleteClient = async (clientId: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const clientRef = doc(db, 'users', currentUser.uid, 'clients', clientId);
    await deleteDoc(clientRef);
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
  };
};