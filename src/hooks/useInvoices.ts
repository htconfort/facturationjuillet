import { useState, useEffect, useCallback } from 'react';
import { Invoice, InvoiceFormData } from '../types';
import { 
  loadInvoices, 
  saveInvoice as saveInvoiceToStorage, 
  deleteInvoice as deleteInvoiceFromStorage 
} from '../utils/storageUtils';
import { createInvoiceFromFormData } from '../utils/invoiceUtils';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les factures au démarrage
  useEffect(() => {
    try {
      const loadedInvoices = loadInvoices();
      setInvoices(loadedInvoices);
    } catch (err) {
      setError('Erreur lors du chargement des factures');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer une nouvelle facture
  const createInvoice = useCallback(async (formData: InvoiceFormData): Promise<Invoice> => {
    try {
      setError(null);
      const newInvoice = createInvoiceFromFormData(formData, invoices);
      
      const success = saveInvoiceToStorage(newInvoice);
      if (!success) {
        throw new Error('Erreur lors de la sauvegarde');
      }
      
      setInvoices(prev => [...prev, newInvoice]);
      return newInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [invoices]);

  // Mettre à jour une facture
  const updateInvoice = useCallback(async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    try {
      setError(null);
      const existingInvoice = invoices.find(inv => inv.id === id);
      if (!existingInvoice) {
        throw new Error('Facture non trouvée');
      }

      const updatedInvoice = {
        ...existingInvoice,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const success = saveInvoiceToStorage(updatedInvoice);
      if (!success) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      return updatedInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [invoices]);

  // Supprimer une facture
  const deleteInvoice = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = deleteInvoiceFromStorage(id);
      if (!success) {
        throw new Error('Erreur lors de la suppression');
      }

      setInvoices(prev => prev.filter(inv => inv.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      return false;
    }
  }, []);

  // Obtenir une facture par ID
  const getInvoice = useCallback((id: string): Invoice | null => {
    return invoices.find(inv => inv.id === id) || null;
  }, [invoices]);

  // Recharger les factures
  const refreshInvoices = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedInvoices = loadInvoices();
      setInvoices(loadedInvoices);
    } catch (err) {
      setError('Erreur lors du rechargement');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    invoices,
    isLoading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    refreshInvoices
  };
};