// Types TypeScript pour MyComfort Facturation

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ClientInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  logo?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFormData {
  client: ClientInfo;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  taxRate: number;
}

// Types pour les hooks et utilitaires
export interface UseInvoiceReturn {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  createInvoice: (data: InvoiceFormData) => Promise<Invoice>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<boolean>;
  getInvoice: (id: string) => Invoice | null;
}

// Types pour la capture PNG
export interface CaptureOptions {
  scale: number;
  backgroundColor: string;
  width: number;
  height: number;
}

// Types pour l'export PDF
export interface PDFOptions {
  format: 'A4' | 'letter';
  orientation: 'portrait' | 'landscape';
  margin: number;
}

// Types pour l'envoi d'email
export interface EmailOptions {
  to: string;
  subject: string;
  message: string;
  attachPDF: boolean;
}

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// Types pour les paramètres de l'application
export interface AppSettings {
  company: CompanyInfo;
  defaultTaxRate: number;
  currency: string;
  locale: string;
  autoSave: boolean;
  theme: 'light' | 'dark';
}

// Types pour les statistiques
export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
}

// Types pour les filtres
export interface InvoiceFilters {
  status?: Invoice['status'];
  dateFrom?: string;
  dateTo?: string;
  clientName?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Types pour la pagination
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: keyof Invoice;
  sortOrder: 'asc' | 'desc';
}

// Types pour les actions de formulaire
export type FormAction = 'create' | 'edit' | 'view';

// Types pour les états de chargement
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Types pour les modales
export interface ModalState {
  isOpen: boolean;
  type: 'delete' | 'email' | 'settings' | null;
  data?: any;
}

// Export des constantes
export const TAX_RATES = {
  STANDARD: 0.20,
  REDUCED: 0.10,
  SUPER_REDUCED: 0.055,
  ZERO: 0
} as const;

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue'
} as const;

export const CURRENCIES = {
  EUR: '€',
  USD: '$',
  GBP: '£'
} as const;