import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, Broker } from '../types';
import * as propertyService from '../lib/services/propertyService';

interface PropertyContextType {
  properties: Property[];
  brokers: Broker[];
  loading: boolean;
  error: string | null;
  addProperty: (property: Omit<Property, 'id' | 'date'>) => Promise<void>;
  updateProperty: (id: number, updatedData: Partial<Property>) => Promise<void>;
  deleteProperty: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
  toggleRecommended: (id: number) => Promise<void>;
  getProperty: (id: number) => Property | undefined;
  addBroker: (broker: Omit<Broker, 'id'>) => Promise<void>;
  updateBroker: (id: number, updatedData: Partial<Broker>) => Promise<void>;
  deleteBroker: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [propertiesData, brokersData] = await Promise.all([
        propertyService.fetchProperties(),
        propertyService.fetchBrokers()
      ]);
      
      setProperties(propertiesData);
      setBrokers(brokersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Грешка при зареждане на данните. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const addProperty = async (data: Omit<Property, 'id' | 'date'>) => {
    try {
      const newProperty = await propertyService.createProperty(data);
      setProperties(prev => [newProperty, ...prev]);
    } catch (err) {
      console.error('Error adding property:', err);
      throw new Error('Грешка при добавяне на имот');
    }
  };

  const updateProperty = async (id: number, updatedData: Partial<Property>) => {
    try {
      const updatedProperty = await propertyService.updateProperty(id, updatedData);
      setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
    } catch (err) {
      console.error('Error updating property:', err);
      throw new Error('Грешка при редактиране на имот');
    }
  };

  const deleteProperty = async (id: number) => {
    try {
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      throw new Error('Грешка при изтриване на имот');
    }
  };

  const toggleStatus = async (id: number) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    try {
      const updatedProperty = await propertyService.togglePropertyStatus(id, property.status);
      setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
    } catch (err) {
      console.error('Error toggling property status:', err);
      throw new Error('Грешка при промяна на статуса');
    }
  };

  const toggleRecommended = async (id: number) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    try {
      const updatedProperty = await propertyService.togglePropertyRecommended(id, property.isRecommended || false);
      setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
    } catch (err) {
      console.error('Error toggling recommended:', err);
      throw new Error('Грешка при промяна на препоръчан статус');
    }
  };

  const getProperty = (id: number) => properties.find(p => p.id === id);

  const addBroker = async (data: Omit<Broker, 'id'>) => {
    try {
      const newBroker = await propertyService.createBroker(data);
      setBrokers(prev => [...prev, newBroker]);
    } catch (err) {
      console.error('Error adding broker:', err);
      throw new Error('Грешка при добавяне на брокер');
    }
  };

  const updateBroker = async (id: number, updatedData: Partial<Broker>) => {
    try {
      const updatedBroker = await propertyService.updateBroker(id, updatedData);
      setBrokers(prev => prev.map(b => b.id === id ? updatedBroker : b));
    } catch (err) {
      console.error('Error updating broker:', err);
      throw new Error('Грешка при редактиране на брокер');
    }
  };

  const deleteBroker = async (id: number) => {
    try {
      await propertyService.deleteBroker(id);
      setBrokers(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting broker:', err);
      throw new Error('Грешка при изтриване на брокер');
    }
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      brokers,
      loading,
      error,
      addProperty, 
      updateProperty, 
      deleteProperty, 
      toggleStatus, 
      toggleRecommended,
      getProperty,
      addBroker,
      updateBroker,
      deleteBroker,
      refreshData
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
