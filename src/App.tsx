import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import { Invoice, InvoiceFormData } from './types';
import { Navigation, InvoiceForm, InvoicePreview, InvoiceList } from './components';
import { useInvoices, usePNGCapture } from './hooks';

function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'list'>('preview');
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Hooks personnalisés
  const { invoices, createInvoice, updateInvoice, deleteInvoice, isLoading } = useInvoices();
  const { captureInvoice } = usePNGCapture();

  // Données de test pour l'aperçu
  const testInvoice: Invoice = {
    id: 'test-001',
    invoiceNumber: '2024-001',
    date: new Date().toLocaleDateString('fr-FR'),
    client: {
      name: 'Hôtel Le Grand Confort',
      address: '45 Avenue des Champs\n75008 Paris',
      phone: '01 42 56 78 90',
      email: 'contact@legrandconfort.fr'
    },
    items: [
      {
        id: '1',
        description: 'Matelas MyComfort Premium 160x200',
        quantity: 12,
        unitPrice: 150.00,
        total: 1800.00
      },
      {
        id: '2',
        description: 'Oreillers ergonomiques MyComfort',
        quantity: 24,
        unitPrice: 25.00,
        total: 600.00
      }
    ],
    subtotal: 2400.00,
    tax: 480.00,
    total: 2880.00,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Gestionnaires d'événements
  const handleCreateInvoice = async (formData: InvoiceFormData) => {
    try {
      const newInvoice = await createInvoice(formData);
      setCurrentInvoice(newInvoice);
      setActiveTab('preview');
    } catch (error) {
      console.error('Erreur création facture:', error);
      alert('Erreur lors de la création de la facture');
    }
  };

  const handleCapturePNG = async () => {
    try {
      const invoice = currentInvoice || testInvoice;
      await captureInvoice(invoiceRef, invoice);
    } catch (error) {
      console.error('Erreur capture PNG:', error);
      alert('Erreur lors de la capture PNG');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setActiveTab('preview');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setActiveTab('form');
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await deleteInvoice(invoiceId);
        if (currentInvoice?.id === invoiceId) {
          setCurrentInvoice(null);
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setActiveTab('preview');
    // Attendre que le composant soit rendu avant de capturer
    setTimeout(async () => {
      try {
        await captureInvoice(invoiceRef, invoice);
      } catch (error) {
        console.error('Erreur téléchargement:', error);
        alert('Erreur lors du téléchargement');
      }
    }, 100);
  };

  const handleEmailInvoice = (invoice: Invoice) => {
    // TODO: Implémenter l'envoi par email
    alert(`Envoi par email de la facture ${invoice.invoiceNumber} (à implémenter)`);
  };

  const displayInvoice = currentInvoice || testInvoice;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'form' && (
          <InvoiceForm
            onSubmit={handleCreateInvoice}
            isLoading={isLoading}
            initialData={currentInvoice ? {
              client: currentInvoice.client,
              items: currentInvoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
              })),
              taxRate: currentInvoice.tax / currentInvoice.subtotal
            } : undefined}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Boutons d'action */}
            <div className="flex justify-center space-x-4 no-print">
              <button
                onClick={handleCapturePNG}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>TEST PNG</span>
              </button>
              <button
                onClick={handleCapturePNG}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>SAUVER + PNG</span>
              </button>
            </div>

            {/* Facture */}
            <div 
              ref={invoiceRef}
              className="bg-white mx-auto shadow-lg"
              style={{ width: '794px', minHeight: '1123px', padding: '40px' }}
            >
              <InvoicePreview invoice={displayInvoice} />
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <InvoiceList
            invoices={invoices}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onDownload={handleDownloadInvoice}
            onEmail={handleEmailInvoice}
          />
        )}
      </main>
    </div>
  );
}

export default App;