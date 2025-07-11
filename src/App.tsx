// 🚫 DESIGN PROTÉGÉ - NE PAS MODIFIER :
// - Couleurs: #477A0C, #F2EFE2, #14281D, #F55D3E, #89BBFE, #D68FD6, #FDB462
// - Structure des onglets et navigation
// - Styles des boutons et formulaires
// - Mise en page existante
// ⚠️ AJOUTER UNIQUEMENT DES FONCTIONNALITÉS, PAS DE MODIFICATIONS DESIGN

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Mail, 
  Cloud, 
  Eye,
  Save,
  User,
  MapPin,
  Phone,
  AtSign
} from 'lucide-react';
import { 
  Invoice, 
  saveInvoiceToFile, 
  getAllInvoices, 
  deleteInvoice, 
  generateInvoiceNumber 
} from './utils/invoiceStorage';
import { 
  downloadPDF, 
  previewPDF, 
  sendPDFByEmail, 
  savePDFToGoogleDrive 
} from './utils/pdfGenerator';
import { initializeEmailJS } from './utils/emailService';

function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showPDFOptions, setShowPDFOptions] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  
  // États du formulaire
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  // Initialisation
  useEffect(() => {
    setInvoices(getAllInvoices());
    initializeEmailJS();
  }, []);

  // Calculs automatiques
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  // Ajouter un article
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Supprimer un article
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Mettre à jour un article
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  // Créer une facture
  const createInvoice = (): Invoice => {
    return {
      id: Date.now().toString(),
      clientName,
      clientAddress,
      clientPhone,
      clientEmail,
      items: items.filter(item => item.description.trim() !== ''),
      subtotal,
      tax,
      total,
      date: new Date().toLocaleDateString('fr-FR'),
      invoiceNumber: generateInvoiceNumber()
    };
  };

  // Enregistrer la facture
  const handleSave = () => {
    if (!clientName.trim()) {
      alert('Veuillez saisir le nom du client');
      return;
    }

    const invoice = createInvoice();
    setCurrentInvoice(invoice);
    setShowPDFOptions(true);
  };

  // Enregistrer et générer PDF
  const handleSaveWithPDF = async (action: 'download' | 'email' | 'drive' | 'preview') => {
    if (!currentInvoice) return;

    try {
      // Sauvegarder la facture
      saveInvoiceToFile(currentInvoice);
      setInvoices(getAllInvoices());

      // Action PDF
      switch (action) {
        case 'download':
          await downloadPDF(currentInvoice);
          alert('✅ Facture sauvegardée et PDF téléchargé !');
          break;
        case 'email':
          await sendPDFByEmail(currentInvoice);
          alert('✅ Facture sauvegardée et envoyée par email !');
          break;
        case 'drive':
          await savePDFToGoogleDrive(currentInvoice);
          alert('✅ Facture sauvegardée sur Google Drive !');
          break;
        case 'preview':
          const pdfUrl = await previewPDF(currentInvoice);
          window.open(pdfUrl, '_blank');
          break;
      }

      // Réinitialiser le formulaire
      resetForm();
      setShowPDFOptions(false);
      setCurrentInvoice(null);

    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la génération du PDF');
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setClientName('');
    setClientAddress('');
    setClientPhone('');
    setClientEmail('');
    setItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Supprimer une facture
  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteInvoice(invoiceId);
      setInvoices(getAllInvoices());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* En-tête */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">MyComfort</h1>
              <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                Facturation Pro
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nouvelle Facture
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'list'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Mes Factures ({invoices.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'create' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <Plus className="w-6 h-6 mr-3 text-green-600" />
              Créer une nouvelle facture
            </h2>

            {/* Informations client */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Informations Client
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom complet ou entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Adresse
                  </label>
                  <textarea
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AtSign className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="client@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Articles / Services</h3>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Description du produit/service"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix unitaire
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total
                      </label>
                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded text-green-700 font-medium">
                        {item.total.toFixed(2)} €
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <button
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un article
              </button>
            </div>

            {/* Totaux */}
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center text-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total HT:</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%):</span>
                    <span className="font-medium">{tax.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-green-700 border-t pt-2">
                    <span>Total TTC:</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton Enregistrer */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-lg font-medium"
              >
                <Save className="w-5 h-5 mr-2" />
                Enregistrer et Générer PDF
              </button>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              Mes Factures ({invoices.length})
            </h2>

            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucune facture créée</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Créer ma première facture
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Facture {invoice.invoiceNumber}
                        </h3>
                        <p className="text-gray-600">{invoice.clientName}</p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {invoice.total.toFixed(2)} €
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => downloadPDF(invoice)}
                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            title="Télécharger PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => sendPDFByEmail(invoice)}
                            className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                            title="Envoyer par email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => savePDFToGoogleDrive(invoice)}
                            className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                            title="Sauvegarder sur Google Drive"
                          >
                            <Cloud className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Options PDF */}
      {showPDFOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              📄 Options de génération PDF
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={() => handleSaveWithPDF('download')}
                className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center justify-center transition-colors"
              >
                <Download className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium text-blue-700">Télécharger PDF</span>
              </button>

              <button
                onClick={() => handleSaveWithPDF('preview')}
                className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 flex items-center justify-center transition-colors"
              >
                <Eye className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-medium text-green-700">Prévisualiser PDF</span>
              </button>

              <button
                onClick={() => handleSaveWithPDF('email')}
                className="w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5 mr-3 text-orange-600" />
                <span className="font-medium text-orange-700">Envoyer par Email</span>
              </button>

              <button
                onClick={() => handleSaveWithPDF('drive')}
                className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 flex items-center justify-center transition-colors"
              >
                <Cloud className="w-5 h-5 mr-3 text-purple-600" />
                <span className="font-medium text-purple-700">Sauver sur Google Drive</span>
              </button>
            </div>

            <button
              onClick={() => {
                setShowPDFOptions(false);
                setCurrentInvoice(null);
              }}
              className="w-full mt-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;