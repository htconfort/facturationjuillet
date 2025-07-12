import { Invoice } from '../types';

const STORAGE_KEY = 'mycomfort_invoices';

// Sauvegarder les factures dans localStorage
export const saveInvoices = (invoices: Invoice[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
};

// Charger les factures depuis localStorage
export const loadInvoices = (): Invoice[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return [];
  }
};

// Sauvegarder une facture
export const saveInvoice = (invoice: Invoice): boolean => {
  try {
    const invoices = loadInvoices();
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      invoices.push(invoice);
    }
    
    return saveInvoices(invoices);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la facture:', error);
    return false;
  }
};

// Supprimer une facture
export const deleteInvoice = (invoiceId: string): boolean => {
  try {
    const invoices = loadInvoices();
    const filteredInvoices = invoices.filter(inv => inv.id !== invoiceId);
    return saveInvoices(filteredInvoices);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
};

// Obtenir une facture par ID
export const getInvoiceById = (invoiceId: string): Invoice | null => {
  try {
    const invoices = loadInvoices();
    return invoices.find(inv => inv.id === invoiceId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return null;
  }
};

// Vider toutes les factures
export const clearAllInvoices = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
};

// Exporter les données vers un fichier
export const exportToFile = (invoices: Invoice[], filename: string = 'factures_mycomfort.json'): void => {
  try {
    const dataStr = JSON.stringify(invoices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
  }
};

// Importer les données depuis un fichier
export const importFromFile = (file: File): Promise<Invoice[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const invoices = JSON.parse(content);
        
        if (!Array.isArray(invoices)) {
          throw new Error('Le fichier doit contenir un tableau de factures');
        }
        
        resolve(invoices);
      } catch (error) {
        reject(new Error('Format de fichier invalide'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsText(file);
  });
};

// Obtenir les statistiques de stockage
export const getStorageStats = () => {
  try {
    const invoices = loadInvoices();
    const dataSize = new Blob([JSON.stringify(invoices)]).size;
    
    return {
      totalInvoices: invoices.length,
      dataSize: dataSize,
      dataSizeFormatted: formatBytes(dataSize),
      lastModified: invoices.length > 0 ? 
        Math.max(...invoices.map(inv => new Date(inv.updatedAt).getTime())) : null
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    return {
      totalInvoices: 0,
      dataSize: 0,
      dataSizeFormatted: '0 B',
      lastModified: null
    };
  }
};

// Formater la taille en bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};