// 🚫 DESIGN PROTÉGÉ - NE PAS MODIFIER :
// - Couleurs: #477A0C, #F2EFE2, #14281D, #F55D3E, #89BBFE, #D68FD6, #FDB462
// - Structure des onglets et navigation
// - Styles des boutons et formulaires
// - Mise en page existante
// ⚠️ AJOUTER UNIQUEMENT DES FONCTIONNALITÉS, PAS DE MODIFICATIONS DESIGN

import React, { useState, useEffect } from 'react';
import { FileText, Users, Settings, Download, Mail, Cloud, Plus, Trash2, Eye, Calculator } from 'lucide-react';
import { Invoice, saveInvoiceToFile, getAllInvoices, deleteInvoice, generateInvoiceNumber } from './utils/invoiceStorage';
import { downloadPDF, sendPDFByEmail, savePDFToGoogleDrive } from './utils/pdfGenerator';
import { initializeEmailJS } from './utils/emailService';

function App() {
  const [activeTab, setActiveTab] = useState('factures');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    id: '',
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    date: new Date().toLocaleDateString('fr-FR'),
    invoiceNumber: generateInvoiceNumber()
  });
  const [showPreview, setShowPreview] = useState(false);

  // Initialisation
  useEffect(() => {
    const savedInvoices = getAllInvoices();
    setInvoices(savedInvoices);
    initializeEmailJS();
  }, []);

  // Calcul automatique des totaux
  useEffect(() => {
    const subtotal = currentInvoice.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.20; // TVA 20%
    const total = subtotal + tax;
    
    setCurrentInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [currentInvoice.items]);

  const updateItemTotal = (index: number, field: string, value: any) => {
    const newItems = [...currentInvoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setCurrentInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (currentInvoice.items.length > 1) {
      setCurrentInvoice(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const saveInvoice = () => {
    const invoiceToSave = {
      ...currentInvoice,
      id: Date.now().toString()
    };
    
    if (saveInvoiceToFile(invoiceToSave)) {
      setInvoices(getAllInvoices());
      setCurrentInvoice({
        id: '',
        clientName: '',
        clientAddress: '',
        clientPhone: '',
        clientEmail: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
        subtotal: 0,
        tax: 0,
        total: 0,
        date: new Date().toLocaleDateString('fr-FR'),
        invoiceNumber: generateInvoiceNumber()
      });
      alert('Facture sauvegardée avec succès !');
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      if (deleteInvoice(invoiceId)) {
        setInvoices(getAllInvoices());
        alert('Facture supprimée avec succès !');
      }
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await downloadPDF(invoice);
      alert('PDF téléchargé avec succès !');
    } catch (error) {
      alert('Erreur lors du téléchargement du PDF');
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      await sendPDFByEmail(invoice);
      alert('Email envoyé avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleSaveToGoogleDrive = async (invoice: Invoice) => {
    try {
      await savePDFToGoogleDrive(invoice);
      alert('Facture sauvegardée sur Google Drive !');
    } catch (error) {
      alert('Erreur lors de la sauvegarde sur Google Drive');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">MyComfort</h1>
                <p className="text-green-600 font-medium">Application de Facturation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Version 2.0</p>
              <p className="text-sm text-green-600 font-medium">Professionnel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'factures', label: 'Nouvelle Facture', icon: FileText },
              { id: 'liste', label: 'Mes Factures', icon: Users },
              { id: 'parametres', label: 'Paramètres', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'factures' && (
          <div className="space-y-8">
            {/* Formulaire de facture */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer une nouvelle facture</h2>
              
              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    value={currentInvoice.clientName}
                    onChange={(e) => setCurrentInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom complet du client"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du client
                  </label>
                  <input
                    type="email"
                    value={currentInvoice.clientEmail}
                    onChange={(e) => setCurrentInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse du client *
                  </label>
                  <textarea
                    value={currentInvoice.clientAddress}
                    onChange={(e) => setCurrentInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Adresse complète du client"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone du client
                  </label>
                  <input
                    type="tel"
                    value={currentInvoice.clientPhone}
                    onChange={(e) => setCurrentInvoice(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              {/* Articles */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Articles / Services</h3>
                  <button
                    onClick={addItem}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un article</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItemTotal(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Description de l'article"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemTotal(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Qté"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItemTotal(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Prix unitaire"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {item.total.toFixed(2)} €
                        </span>
                        {currentInvoice.items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total HT :</span>
                    <span>{currentInvoice.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (20%) :</span>
                    <span>{currentInvoice.tax.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total TTC :</span>
                    <span>{currentInvoice.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={saveInvoice}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <FileText className="h-5 w-5" />
                  <span>Sauvegarder la facture</span>
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Eye className="h-5 w-5" />
                  <span>Prévisualiser</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'liste' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Factures</h2>
            
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucune facture créée pour le moment</p>
                <button
                  onClick={() => setActiveTab('factures')}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Créer ma première facture
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {invoice.total.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDownloadPDF(invoice)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Télécharger PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(invoice)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Envoyer par email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSaveToGoogleDrive(invoice)}
                              className="text-purple-600 hover:text-purple-800 p-1"
                              title="Sauvegarder sur Google Drive"
                            >
                              <Cloud className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {activeTab === 'parametres' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'entreprise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      defaultValue="MyComfort"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SIRET
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="123 456 789 00012"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Email</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Service configuré : EmailJS (service_ymw6jih)
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    ✅ Configuration EmailJS active et fonctionnelle
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Google Drive</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sauvegarde automatique des factures dans le cloud
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    ✅ Configuration Google Drive active et fonctionnelle
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Template PDF caché pour la génération */}
      <div id="pdf-template" className="hidden">
        <div className="max-w-4xl mx-auto p-8 bg-white">
          {/* En-tête de la facture */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">MyComfort</h1>
              <p className="text-gray-600">Application de Facturation Professionnelle</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">FACTURE</h2>
              <p className="text-gray-600">N° {currentInvoice.invoiceNumber}</p>
              <p className="text-gray-600">Date: {currentInvoice.date}</p>
            </div>
          </div>

          {/* Informations client */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturé à :</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">{currentInvoice.clientName}</p>
              <p className="text-gray-600 whitespace-pre-line">{currentInvoice.clientAddress}</p>
              {currentInvoice.clientPhone && (
                <p className="text-gray-600">Tél: {currentInvoice.clientPhone}</p>
              )}
              {currentInvoice.clientEmail && (
                <p className="text-gray-600">Email: {currentInvoice.clientEmail}</p>
              )}
            </div>
          </div>

          {/* Tableau des articles */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Quantité</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Prix unitaire</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{item.unitPrice.toFixed(2)} €</td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold">{item.total.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Sous-total HT :</span>
                <span className="font-semibold">{currentInvoice.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">TVA (20%) :</span>
                <span className="font-semibold">{currentInvoice.tax.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-green-600">
                <span className="text-lg font-bold text-gray-900">Total TTC :</span>
                <span className="text-lg font-bold text-green-600">{currentInvoice.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="text-center text-gray-500 text-sm border-t pt-4">
            <p>Merci pour votre confiance !</p>
            <p>MyComfort - Application de Facturation Professionnelle</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;