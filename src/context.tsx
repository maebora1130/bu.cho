import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductionOrder, Terminology } from './types';
import { mockOrders as initialOrders, mockDictionary as initialDictionary } from './data/mockData';

interface AppContextType {
  orders: ProductionOrder[];
  setOrders: React.Dispatch<React.SetStateAction<ProductionOrder[]>>;
  addOrders: (newOrders: ProductionOrder[]) => void;
  dictionary: Terminology[];
  addTerm: (newTerm: Terminology) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<ProductionOrder[]>(initialOrders);
  const [dictionary, setDictionary] = useState<Terminology[]>(initialDictionary);

  const addOrders = (newOrders: ProductionOrder[]) => {
    setOrders(prev => [...newOrders, ...prev]);
  };

  const addTerm = (newTerm: Terminology) => {
    setDictionary(prev => [newTerm, ...prev]);
  };

  return (
    <AppContext.Provider value={{ orders, setOrders, addOrders, dictionary, addTerm }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
