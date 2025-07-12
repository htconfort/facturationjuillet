import { Invoice, InvoiceFormData, InvoiceItem } from '../types';

// Générer un ID unique
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Générer un numéro de facture
export const generateInvoiceNumber = (existingInvoices: Invoice[]): string => {
  const currentYear = new Date().getFullYear();
  const yearInvoices = existingInvoices.filter(invoice => 
    invoice.invoiceNumber.startsWith(currentYear.toString())
  );
  const nextNumber = yearInvoices.length + 1;
  return `${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
};

// Calculer les totaux d'une facture
export const calculateInvoiceTotals = (
  items: Omit<InvoiceItem, 'id' | 'total'>[],
  taxRate: number
) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

// Créer une facture à partir des données du formulaire
export const createInvoiceFromFormData = (
  formData: InvoiceFormData,
  existingInvoices: Invoice[]
): Invoice => {
  const { subtotal, tax, total } = calculateInvoiceTotals(formData.items, formData.taxRate);
  
  const items: InvoiceItem[] = formData.items.map(item => ({
    ...item,
    id: generateId(),
    total: item.quantity * item.unitPrice
  }));

  return {
    id: generateId(),
    invoiceNumber: generateInvoiceNumber(existingInvoices),
    date: new Date().toLocaleDateString('fr-FR'),
    client: formData.client,
    items,
    subtotal,
    tax,
    total,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Valider les données d'une facture
export const validateInvoice = (invoice: Partial<Invoice>): string[] => {
  const errors: string[] = [];

  if (!invoice.client?.name?.trim()) {
    errors.push('Le nom du client est requis');
  }

  if (!invoice.client?.address?.trim()) {
    errors.push('L\'adresse du client est requise');
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.push('Au moins un article est requis');
  }

  if (invoice.items) {
    invoice.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Description requise pour l'article ${index + 1}`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Quantité invalide pour l'article ${index + 1}`);
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        errors.push(`Prix unitaire invalide pour l'article ${index + 1}`);
      }
    });
  }

  return errors;
};

// Formater un montant en euros
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Formater une date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR');
};

// Calculer l'âge d'une facture en jours
export const getInvoiceAge = (invoiceDate: string): number => {
  const date = new Date(invoiceDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Déterminer si une facture est en retard
export const isInvoiceOverdue = (invoice: Invoice, dueDays: number = 30): boolean => {
  if (invoice.status === 'paid') return false;
  return getInvoiceAge(invoice.date) > dueDays;
};

// Filtrer les factures
export const filterInvoices = (
  invoices: Invoice[],
  filters: {
    status?: Invoice['status'];
    clientName?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Invoice[] => {
  return invoices.filter(invoice => {
    if (filters.status && invoice.status !== filters.status) {
      return false;
    }

    if (filters.clientName && !invoice.client.name.toLowerCase().includes(filters.clientName.toLowerCase())) {
      return false;
    }

    if (filters.dateFrom && new Date(invoice.date) < new Date(filters.dateFrom)) {
      return false;
    }

    if (filters.dateTo && new Date(invoice.date) > new Date(filters.dateTo)) {
      return false;
    }

    return true;
  });
};

// Trier les factures
export const sortInvoices = (
  invoices: Invoice[],
  sortBy: keyof Invoice,
  order: 'asc' | 'desc' = 'desc'
): Invoice[] => {
  return [...invoices].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Gestion spéciale pour les dates
    if (sortBy === 'date' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    // Gestion spéciale pour les montants
    if (sortBy === 'total' || sortBy === 'subtotal' || sortBy === 'tax') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Exporter les données en JSON
export const exportInvoicesToJSON = (invoices: Invoice[]): string => {
  return JSON.stringify(invoices, null, 2);
};

// Importer les données depuis JSON
export const importInvoicesFromJSON = (jsonString: string): Invoice[] => {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error('Le fichier doit contenir un tableau de factures');
    }
    return data;
  } catch (error) {
    throw new Error('Format JSON invalide');
  }
};