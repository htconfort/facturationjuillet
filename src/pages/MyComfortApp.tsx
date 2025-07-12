import React, { useState, useRef } from 'react';
import { Download, Send, Save, FileText, Eye } from 'lucide-react';

// Components
import HeaderNav from '../components/HeaderNav';
import StatusBar from '../components/StatusBar';
import ClientDropdown from '../components/ClientDropdown';
import InvoiceDropdown from '../components/InvoiceDropdown';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import TotalsBlock from '../components/TotalsBlock';
import SignaturePad from '../components/SignaturePad';
import InvoicePreview from '../components/InvoicePreview';

// Utils
import { 
  ClientInfo, 
  Invoice, 
  InvoiceItem, 
  mockClients, 
  mockInvoices,
  createNewInvoice 
} from '../utils/data';
import { calculateTotals } from '../utils/calculations';

// Types
interface AppState {
  activeTab: 'form' | 'preview';
  selectedClient: ClientInfo | null;
  selectedInvoice: Invoice | null;
  currentItems: InvoiceItem[];
  signature: string | null;
  lastSaved: Date | null;
}

// Déclaration globale pour html2canvas
declare global {
  interface Window {
    html2canvas: any;
  }
}

export const MyComfortApp: React.FC = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [state, setState] = useState<AppState>({
    activeTab: 'preview',
    selectedClient: mockClients[0],
    selectedInvoice: mockInvoices[0],
    currentItems: mockInvoices[0].items,
    signature: null,
    lastSaved: new Date()
  });

  // Configuration des onglets pour HeaderNav
  const tabs = [
    {
      id: 'form' as const,
      label: '📝 FORMULAIRE',
      bgColor: 'bg-green-600',
      color: 'text-white',
      icon: FileText
    },
    {
      id: 'preview' as const,
      label: '👁️ APERÇU',
      bgColor: 'bg-green-600',
      color: 'text-white',
      icon: Eye
    }
  ];

  // Handlers
  const handleTabChange = (tab: 'form' | 'preview') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const handleClientSelect = (client: ClientInfo) => {
    setState(prev => ({ ...prev, selectedClient: client }));
  };

  const handleNewClient = () => {
    alert('🚧 Fonctionnalité "Nouveau client" à développer');
  };

  const handleInvoiceSelect = (invoice: Invoice) => {
    setState(prev => ({
      ...prev,
      selectedInvoice: invoice,
      currentItems: invoice.items,
      selectedClient: mockClients.find(c => c.name === invoice.clientName) || null
    }));
  };

  const handleNewInvoice = () => {
    const newInvoice = createNewInvoice();
    setState(prev => ({
      ...prev,
      selectedInvoice: newInvoice,
      currentItems: [],
      selectedClient: null
    }));
  };

  const handleAddProduct = (product: InvoiceItem) => {
    setState(prev => ({
      ...prev,
      currentItems: [...prev.currentItems, product],
      lastSaved: new Date()
    }));
  };

  const handleEditItem = (item: InvoiceItem) => {
    alert(`🚧 Édition de: ${item.description}`);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Supprimer ce produit ?')) {
      setState(prev => ({
        ...prev,
        currentItems: prev.currentItems.filter(item => item.id !== itemId),
        lastSaved: new Date()
      }));
    }
  };

  const handleSignatureChange = (signature: string | null) => {
    setState(prev => ({ ...prev, signature }));
  };

  // Actions
  const saveInvoice = () => {
    setState(prev => ({ ...prev, lastSaved: new Date() }));
    alert('💾 Facture sauvegardée !');
  };

  const sendInvoice = () => {
    if (!state.selectedClient) {
      alert('⚠️ Veuillez sélectionner un client');
      return;
    }
    alert(`📧 Envoi à ${state.selectedClient.email}`);
  };

  const capturePNG = async () => {
    if (!invoiceRef.current || !window.html2canvas) {
      alert('❌ html2canvas non disponible');
      return;
    }

    try {
      console.log('📸 Début capture PNG...');
      
      const canvas = await window.html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });

      const link = document.createElement('a');
      link.download = `Facture_${state.selectedInvoice?.invoiceNumber || 'DRAFT'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      console.log('✅ PNG téléchargé avec succès');
    } catch (error) {
      console.error('❌ Erreur capture PNG:', error);
      alert('Erreur lors de la capture PNG');
    }
  };

  // Calculs
  const totals = calculateTotals(state.currentItems);

  // Création de la facture pour l'aperçu
  const previewInvoice: Invoice = {
    id: state.selectedInvoice?.id || 'new',
    invoiceNumber: state.selectedInvoice?.invoiceNumber || 'DRAFT-001',
    date: state.selectedInvoice?.date || new Date().toLocaleDateString('fr-FR'),
    clientName: state.selectedClient?.name || 'Client non sélectionné',
    clientAddress: state.selectedClient?.address || '',
    clientPhone: state.selectedClient?.phone,
    clientEmail: state.selectedClient?.email,
    items: state.currentItems,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <HeaderNav 
        tabs={tabs}
        activeTab={state.activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Barre de statut */}
      <StatusBar 
        status="draft"
        invoiceNumber={state.selectedInvoice?.invoiceNumber}
        lastSaved={state.lastSaved}
      />

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto p-6">
        {state.activeTab === 'form' && (
          <div className="space-y-6">
            {/* Sélection client et facture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientDropdown
                clients={mockClients}
                selectedClient={state.selectedClient}
                onClientSelect={handleClientSelect}
                onNewClient={handleNewClient}
              />
              
              <InvoiceDropdown
                invoices={mockInvoices}
                selectedInvoice={state.selectedInvoice}
                onInvoiceSelect={handleInvoiceSelect}
                onNewInvoice={handleNewInvoice}
              />
            </div>

            {/* Formulaire produit */}
            <ProductForm onAddProduct={handleAddProduct} />

            {/* Tableau des produits */}
            <ProductTable
              items={state.currentItems}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />

            {/* Totaux et signature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TotalsBlock
                subtotal={totals.subtotal}
                tax={totals.tax}
                total={totals.total}
              />
              
              <SignaturePad
                signature={state.signature}
                onSignatureChange={handleSignatureChange}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={saveInvoice}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Sauvegarder</span>
              </button>
              
              <button
                onClick={sendInvoice}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Envoyer</span>
              </button>
            </div>
          </div>
        )}

        {state.activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Boutons d'action */}
            <div className="flex justify-center space-x-4 no-print">
              <button
                onClick={capturePNG}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Télécharger PNG</span>
              </button>
              
              <button
                onClick={sendInvoice}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Envoyer par email</span>
              </button>
            </div>

            {/* Aperçu de la facture */}
            <InvoicePreview 
              ref={invoiceRef}
              invoice={previewInvoice}
            />
          </div>
        )}
      </main>
    </div>
  );
};