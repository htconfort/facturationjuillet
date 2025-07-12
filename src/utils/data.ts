// Types de données
export interface ClientInfo {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientAddress: string;
  clientPhone?: string;
  clientEmail?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Données de test - Clients
export const mockClients: ClientInfo[] = [
  {
    id: '1',
    name: 'Hôtel Le Grand Confort',
    address: '45 Avenue des Champs\n75008 Paris',
    phone: '01 42 56 78 90',
    email: 'contact@legrandconfort.fr'
  },
  {
    id: '2',
    name: 'Résidence Les Jardins',
    address: '12 Rue de la Paix\n69001 Lyon',
    phone: '04 78 90 12 34',
    email: 'gestion@lesjardins.fr'
  },
  {
    id: '3',
    name: 'Maison de Retraite Soleil',
    address: '8 Boulevard du Midi\n13001 Marseille',
    phone: '04 91 23 45 67',
    email: 'direction@soleil-retraite.fr'
  }
];

// Données de test - Produits/Services
export const mockProducts = [
  {
    id: 'p1',
    description: 'Matelas MyComfort Premium 160x200',
    defaultPrice: 150.00
  },
  {
    id: 'p2',
    description: 'Oreillers ergonomiques MyComfort',
    defaultPrice: 25.00
  },
  {
    id: 'p3',
    description: 'Surmatelas mémoire de forme 140x190',
    defaultPrice: 80.00
  },
  {
    id: 'p4',
    description: 'Protège-matelas imperméable',
    defaultPrice: 35.00
  },
  {
    id: 'p5',
    description: 'Installation et mise en service',
    defaultPrice: 50.00
  }
];

// Données de test - Factures
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: '2024-001',
    date: new Date().toLocaleDateString('fr-FR'),
    clientName: 'Hôtel Le Grand Confort',
    clientAddress: '45 Avenue des Champs\n75008 Paris',
    clientPhone: '01 42 56 78 90',
    clientEmail: 'contact@legrandconfort.fr',
    items: [
      {
        id: 'i1',
        description: 'Matelas MyComfort Premium 160x200',
        quantity: 12,
        unitPrice: 150.00,
        total: 1800.00
      },
      {
        id: 'i2',
        description: 'Oreillers ergonomiques MyComfort',
        quantity: 24,
        unitPrice: 25.00,
        total: 600.00
      }
    ],
    subtotal: 2400.00,
    tax: 480.00,
    total: 2880.00
  },
  {
    id: '2',
    invoiceNumber: '2024-002',
    date: new Date(Date.now() - 86400000).toLocaleDateString('fr-FR'), // Hier
    clientName: 'Résidence Les Jardins',
    clientAddress: '12 Rue de la Paix\n69001 Lyon',
    clientPhone: '04 78 90 12 34',
    clientEmail: 'gestion@lesjardins.fr',
    items: [
      {
        id: 'i3',
        description: 'Surmatelas mémoire de forme 140x190',
        quantity: 8,
        unitPrice: 80.00,
        total: 640.00
      },
      {
        id: 'i4',
        description: 'Installation et mise en service',
        quantity: 1,
        unitPrice: 50.00,
        total: 50.00
      }
    ],
    subtotal: 690.00,
    tax: 138.00,
    total: 828.00
  }
];

// Fonctions utilitaires
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const existingNumbers = mockInvoices
    .map(inv => inv.invoiceNumber)
    .filter(num => num.startsWith(`${year}-`))
    .map(num => parseInt(num.split('-')[1]))
    .sort((a, b) => b - a);
  
  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
  return `${year}-${nextNumber.toString().padStart(3, '0')}`;
};

export const createNewInvoice = (): Invoice => {
  return {
    id: Date.now().toString(),
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toLocaleDateString('fr-FR'),
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
  };
};

export const findClientById = (id: string): ClientInfo | undefined => {
  return mockClients.find(client => client.id === id);
};

export const findInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find(invoice => invoice.id === id);
};