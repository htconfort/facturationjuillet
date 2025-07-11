import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Mail, 
  Cloud, 
  Trash2, 
  Edit, 
  Eye,
  Calculator,
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
import { downloadInvoicePDF } from './utils/pdfGenerator';
import { sendPDFByEmail, initializeEmailJS } from './utils/emailService';
import { saveInvoiceToGoogleDrive, authenticateGoogleDrive } from './utils/googleDriveService';

// Interface pour les items de facture
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Interface pour les notifications
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const MyComfortApp: React.FC = () => {
  // États principaux
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // États du formulaire
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  // Initialisation
  useEffect(() => {
    loadInvoices();
    initializeEmailJS();
  }, []);

  // Charger les factures
  const loadInvoices = () => {
    const savedInvoices = getAllInvoices();
    setInvoices(savedInvoices);
  };

  // Afficher une notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Calculer le total d'un item
  const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    return Math.round(quantity * unitPrice * 100) / 100;
  };

  // Calculer les totaux de la facture
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.2 * 100) / 100; // TVA 20%
    const total = Math.round((subtotal + tax) * 100) / 100;
    
    return { subtotal, tax, total };
  };

  // Ajouter un item
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Supprimer un item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Mettre à jour un item
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculer le total si quantité ou prix change
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = calculateItemTotal(
        newItems[index].quantity, 
        newItems[index].unitPrice
      );
    }
    
    setItems(newItems);
  };

  // Créer une nouvelle facture
  const createNewInvoice = () => {
    setIsCreating(true);
    setCurrentInvoice(null);
    setClientName('');
    setClientAddress('');
    setClientPhone('');
    setClientEmail('');
    setItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Sauvegarder la facture
  const saveInvoice = () => {
    if (!clientName.trim()) {
      showNotification('Le nom du client est requis', 'error');
      return;
    }

    if (items.some(item => !item.description.trim())) {
      showNotification('Toutes les descriptions d\'articles sont requises', 'error');
      return;
    }

    const totals = calculateTotals();
    const invoice: Invoice = {
      id: currentInvoice?.id || Date.now().toString(),
      clientName: clientName.trim(),
      clientAddress: clientAddress.trim(),
      clientPhone: clientPhone.trim() || undefined,
      clientEmail: clientEmail.trim() || undefined,
      items: items.map(item => ({
        description: item.description.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      date: new Date().toISOString(),
      invoiceNumber: currentInvoice?.invoiceNumber || generateInvoiceNumber()
    };

    const success = saveInvoiceToFile(invoice);
    if (success) {
      showNotification(`Facture ${invoice.invoiceNumber} sauvegardée avec succès !`, 'success');
      loadInvoices();
      setIsCreating(false);
    } else {
      showNotification('Erreur lors de la sauvegarde', 'error');
    }
  };

  // Télécharger une facture en PDF
  const downloadInvoice = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice);
      showNotification(`Facture PDF ${invoice.invoiceNumber} téléchargée avec succès !`, 'success');
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      showNotification('Erreur lors de la génération du PDF', 'error');
    }
  };

  // Envoyer par email
  const sendByEmail = async (invoice: Invoice) => {
    try {
      if (!invoice.clientEmail) {
        showNotification('Adresse email du client manquante', 'error');
        return;
      }
      
      await sendPDFByEmail(invoice);
      showNotification(`Facture ${invoice.invoiceNumber} envoyée par email !`, 'success');
    } catch (error) {
      console.error('Erreur envoi email:', error);
      showNotification('Erreur lors de l\'envoi par email', 'error');
    }
  };

  // Sauvegarder sur Google Drive
  const saveToCloud = async (invoice: Invoice) => {
    try {
      const result = await saveInvoiceToGoogleDrive(invoice);
      showNotification(`Facture ${invoice.invoiceNumber} sauvegardée sur Google Drive !`, 'success');
    } catch (error) {
      console.error('Erreur Google Drive:', error);
      showNotification('Erreur lors de la sauvegarde cloud', 'error');
    }
  };

  // Supprimer une facture
  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      const success = deleteInvoice(invoiceId);
      if (success) {
        showNotification('Facture supprimée avec succès', 'success');
        loadInvoices();
      } else {
        showNotification('Erreur lors de la suppression', 'error');
      }
    }
  };

  // Éditer une facture
  const editInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsCreating(true);
    setClientName(invoice.clientName);
    setClientAddress(invoice.clientAddress);
    setClientPhone(invoice.clientPhone || '');
    setClientEmail(invoice.clientEmail || '');
    setItems(invoice.items);
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* En-tête */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MyComfort</h1>
                <p className="text-sm text-gray-600">Application de Facturation</p>
              </div>
            </div>
            
            {!isCreating && (
              <button
                onClick={createNewInvoice}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle Facture</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreating ? (
          /* Formulaire de création/édition */
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentInvoice ? 'Modifier la Facture' : 'Nouvelle Facture'}
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Informations client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Informations Client
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom complet ou entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Adresse
                  </label>
                  <textarea
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Numéro de téléphone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <AtSign className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="adresse@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-green-600" />
                  Articles
                </h3>
                <button
                  onClick={addItem}
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="Description de l'article"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
                        {item.total.toFixed(2)}€
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totaux */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Sous-total HT:</span>
                <span className="font-medium">{totals.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">TVA (20%):</span>
                <span className="font-medium">{totals.tax.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-green-700 pt-2 border-t border-green-200">
                <span>Total TTC:</span>
                <span>{totals.total.toFixed(2)}€</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveInvoice}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {currentInvoice ? 'Mettre à jour' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        ) : (
          /* Liste des factures */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Factures ({invoices.length})
              </h2>
            </div>

            {invoices.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune facture
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez par créer votre première facture
                </p>
                <button
                  onClick={createNewInvoice}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Créer une facture</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Facture {invoice.invoiceNumber}
                          </h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {invoice.total.toFixed(2)}€
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Client:</span> {invoice.clientName}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(invoice.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div>
                            <span className="font-medium">Articles:</span> {invoice.items.length}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => downloadInvoice(invoice)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Télécharger PDF"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        
                        {invoice.clientEmail && (
                          <button
                            onClick={() => sendByEmail(invoice)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Envoyer par email"
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => saveToCloud(invoice)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Sauvegarder sur Google Drive"
                        >
                          <Cloud className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => editInvoice(invoice)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyComfortApp;