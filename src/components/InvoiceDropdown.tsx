import React, { useState } from 'react';
import { ChevronDown, FileText, Plus } from 'lucide-react';
import { Invoice } from '../utils/data';

interface InvoiceDropdownProps {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  onInvoiceSelect: (invoice: Invoice) => void;
  onNewInvoice: () => void;
}

export const InvoiceDropdown: React.FC<InvoiceDropdownProps> = ({
  invoices,
  selectedInvoice,
  onInvoiceSelect,
  onNewInvoice
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Facture
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className={selectedInvoice ? 'text-gray-900' : 'text-gray-500'}>
            {selectedInvoice 
              ? `${selectedInvoice.invoiceNumber} - ${selectedInvoice.clientName}`
              : 'Sélectionner une facture'
            }
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <button
            onClick={() => {
              onNewInvoice();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100"
          >
            <Plus className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Nouvelle facture</span>
          </button>
          
          {invoices.map((invoice) => (
            <button
              key={invoice.id}
              onClick={() => {
                onInvoiceSelect(invoice);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
            >
              <FileText className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                  <span className="text-sm text-gray-500">{formatDate(invoice.date)}</span>
                </div>
                <div className="text-sm text-gray-500">{invoice.clientName}</div>
                <div className="text-sm font-medium text-green-600">{invoice.total.toFixed(2)} €</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};