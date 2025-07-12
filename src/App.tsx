import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Eye, Plus, Trash2, Edit, Mail, Save, ArrowLeft } from 'lucide-react';

// Types TypeScript
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ClientInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Déclaration globale pour html2canvas
declare global {
  interface Window {
    html2canvas: any;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'form' | 'preview'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Invoice>>({});
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Charger les factures depuis localStorage au démarrage
  useEffect(() => {
    const savedInvoices = localStorage.getItem('mycomfort-invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  // Sauvegarder les factures dans localStorage
  const saveInvoices = (newInvoices: Invoice[]) => {
    localStorage.setItem('mycomfort-invoices', JSON.stringify(newInvoices));
    setInvoices(newInvoices);
  };

  // Générer un numéro de facture unique
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .filter(inv => inv.invoiceNumber.startsWith(`${year}-`))
      .map(inv => parseInt(inv.invoiceNumber.split('-')[1]))
      .sort((a, b) => b - a);
    
    const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
    return `${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  // Créer une nouvelle facture
  const createNewInvoice = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toLocaleDateString('fr-FR'),
      client: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }],
      subtotal: 0,
      tax: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFormData(newInvoice);
    setCurrentInvoice(newInvoice);
    setIsEditing(true);
    setActiveTab('form');
  };

  // Éditer une facture existante
  const editInvoice = (invoice: Invoice) => {
    setFormData({ ...invoice });
    setCurrentInvoice(invoice);
    setIsEditing(true);
    setActiveTab('form');
  };

  // Prévisualiser une facture
  const previewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setActiveTab('preview');
  };

  // Sauvegarder la facture
  const saveInvoice = () => {
    if (!formData.client?.name || !formData.items?.length) {
      alert('Veuillez remplir au moins le nom du client et un article');
      return;
    }

    const invoice: Invoice = {
      ...formData as Invoice,
      updatedAt: new Date().toISOString()
    };

    let newInvoices;
    if (isEditing && invoices.find(inv => inv.id === invoice.id)) {
      // Mise à jour
      newInvoices = invoices.map(inv => inv.id === invoice.id ? invoice : inv);
    } else {
      // Nouvelle facture
      if (!invoice.id) {
        invoice.id = Date.now().toString();
        invoice.createdAt = new Date().toISOString();
      }
      newInvoices = [...invoices, invoice];
    }

    saveInvoices(newInvoices);
    setCurrentInvoice(invoice);
    setIsEditing(false);
    setActiveTab('preview');
    alert('✅ Facture sauvegardée avec succès !');
  };

  // Supprimer une facture
  const deleteInvoice = (invoiceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      const newInvoices = invoices.filter(inv => inv.id !== invoiceId);
      saveInvoices(newInvoices);
      if (currentInvoice?.id === invoiceId) {
        setCurrentInvoice(null);
        setActiveTab('invoices');
      }
    }
  };

  // Calculer les totaux
  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.20; // TVA 20%
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Mettre à jour un article
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    const totals = calculateTotals(newItems);
    setFormData({ ...formData, items: newItems, ...totals });
  };

  // Ajouter un article
  const addItem = () => {
    const newItems = [...(formData.items || []), {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];
    setFormData({ ...formData, items: newItems });
  };

  // Supprimer un article
  const removeItem = (index: number) => {
    const newItems = (formData.items || []).filter((_, i) => i !== index);
    const totals = calculateTotals(newItems);
    setFormData({ ...formData, items: newItems, ...totals });
  };

  // Capture PNG
  const capturePNG = async (invoice?: Invoice) => {
    const targetInvoice = invoice || currentInvoice;
    if (!invoiceRef.current || !window.html2canvas || !targetInvoice) {
      alert('❌ Impossible de capturer la facture');
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
      link.download = `Facture_${targetInvoice.invoiceNumber}_${targetInvoice.client.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      console.log('✅ PNG téléchargé avec succès');
    } catch (error) {
      console.error('❌ Erreur capture PNG:', error);
      alert('Erreur lors de la capture PNG');
    }
  };

  // Générer PDF (simulation)
  const generatePDF = (invoice: Invoice) => {
    alert(`🔄 Génération PDF pour la facture ${invoice.invoiceNumber}\n(Fonctionnalité à implémenter avec jsPDF)`);
  };

  // Envoyer par email (simulation)
  const sendByEmail = (invoice: Invoice) => {
    const email = invoice.client.email || prompt('Adresse email du destinataire:');
    if (email) {
      alert(`📧 Envoi par email à ${email}\nFacture: ${invoice.invoiceNumber}\n(Fonctionnalité à implémenter avec EmailJS)`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-800">MyComfort Facturation</h1>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'invoices'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 FACTURES
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'form'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📝 FORMULAIRE
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                👁️ APERÇU
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto p-6">
        
        {/* ONGLET FACTURES */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Mes Factures</h2>
              <button
                onClick={createNewInvoice}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle Facture</span>
              </button>
            </div>

            {invoices.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune facture</h3>
                <p className="text-gray-500 mb-4">Créez votre première facture pour commencer</p>
                <button
                  onClick={createNewInvoice}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Créer une facture
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facture
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{invoice.client.name}</div>
                          <div className="text-sm text-gray-500">{invoice.client.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-green-600">
                            {invoice.total.toFixed(2)} €
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => previewInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Voir"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => editInvoice(invoice)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => generatePDF(invoice)}
                              className="text-purple-600 hover:text-purple-800 p-1"
                              title="PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => sendByEmail(invoice)}
                              className="text-orange-600 hover:text-orange-800 p-1"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ONGLET FORMULAIRE */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Modifier la facture' : 'Créer une facture'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                <button
                  onClick={saveInvoice}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Informations facture */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations facture</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de facture
                    </label>
                    <input
                      type="text"
                      value={formData.invoiceNumber || ''}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date ? new Date(formData.date.split('/').reverse().join('-')).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toLocaleDateString('fr-FR') })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Informations client */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations client</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du client *
                    </label>
                    <input
                      type="text"
                      value={formData.client?.name || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        client: { ...formData.client!, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <textarea
                      value={formData.client?.address || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        client: { ...formData.client!, address: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.client?.phone || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        client: { ...formData.client!, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.client?.email || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        client: { ...formData.client!, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Articles</h3>
                <button
                  onClick={addItem}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.items || []).map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm font-semibold text-gray-700">
                        {item.total.toFixed(2)} €
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="mt-6 flex justify-end">
                <div className="w-80 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total HT:</span>
                      <span className="font-semibold">{(formData.subtotal || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (20%):</span>
                      <span className="font-semibold">{(formData.tax || 0).toFixed(2)} €</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold text-green-600">
                        <span>TOTAL TTC:</span>
                        <span>{(formData.total || 0).toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET APERÇU */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {!currentInvoice ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune facture sélectionnée</h3>
                <p className="text-gray-500">Sélectionnez une facture pour la prévisualiser</p>
              </div>
            ) : (
              <>
                {/* Boutons d'action */}
                <div className="flex justify-center space-x-4 no-print">
                  <button
                    onClick={() => capturePNG(currentInvoice)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => generatePDF(currentInvoice)}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => sendByEmail(currentInvoice)}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => editInvoice(currentInvoice)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Modifier</span>
                  </button>
                </div>

                {/* Facture */}
                <div 
                  ref={invoiceRef}
                  className="bg-white mx-auto shadow-lg"
                  style={{ width: '794px', minHeight: '1123px', padding: '40px' }}
                >
                  {/* En-tête */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">MC</span>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800">MyComfort</h1>
                        <p className="text-gray-600">Solutions de confort</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-4xl font-bold text-green-600 mb-2">FACTURE</h2>
                      <div className="text-gray-700">
                        <p className="font-semibold">N° {currentInvoice.invoiceNumber}</p>
                        <p>Date: {currentInvoice.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg border-b-2 border-green-600 pb-1">
                        ÉMETTEUR
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <p className="font-semibold">MyComfort SARL</p>
                        <p>123 Rue de la Paix</p>
                        <p>75001 Paris</p>
                        <p>Tél: 01 23 45 67 89</p>
                        <p>Email: contact@mycomfort.fr</p>
                        <p>SIRET: 123 456 789 00012</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg border-b-2 border-green-600 pb-1">
                        FACTURÉ À
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <p className="font-semibold">{currentInvoice.client.name}</p>
                        {currentInvoice.client.address.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                        {currentInvoice.client.phone && <p>Tél: {currentInvoice.client.phone}</p>}
                        {currentInvoice.client.email && <p>Email: {currentInvoice.client.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Tableau */}
                  <div className="mb-8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-600 text-white">
                          <th className="border border-green-700 px-4 py-3 text-left font-semibold">
                            Description
                          </th>
                          <th className="border border-green-700 px-4 py-3 text-center font-semibold w-20">
                            Qté
                          </th>
                          <th className="border border-green-700 px-4 py-3 text-right font-semibold w-32">
                            Prix unitaire
                          </th>
                          <th className="border border-green-700 px-4 py-3 text-right font-semibold w-32">
                            Total HT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border border-gray-300 px-4 py-3 text-gray-800">
                              {item.description}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                              {item.quantity}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                              {item.unitPrice.toFixed(2)} €
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">
                              {item.total.toFixed(2)} €
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totaux */}
                  <div className="flex justify-end mb-8">
                    <div className="w-80">
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <div className="space-y-3">
                          <div className="flex justify-between text-gray-700">
                            <span>Sous-total HT:</span>
                            <span className="font-semibold">{currentInvoice.subtotal.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>TVA (20%):</span>
                            <span className="font-semibold">{currentInvoice.tax.toFixed(2)} €</span>
                          </div>
                          <div className="border-t-2 border-green-600 pt-3">
                            <div className="flex justify-between text-xl font-bold text-green-600">
                              <span>TOTAL TTC:</span>
                              <span>{currentInvoice.total.toFixed(2)} €</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pied de page */}
                  <div className="border-t border-gray-300 pt-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">
                      Facture acquittée - Merci de votre confiance
                    </p>
                    <p className="text-xs text-gray-400">
                      SIRET: 123 456 789 00012 - TVA non applicable, art. 293 B du CGI
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;