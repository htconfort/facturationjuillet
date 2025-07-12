import React, { useState, useRef } from 'react';
import { Save, Download, Users, Package, Phone, Mail, FileText, Eye } from 'lucide-react';

function App() {
  // ⭐ REF pour PNG
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  // États pour l'application
  const [currentView, setCurrentView] = useState<'form' | 'preview'>('form');
  const [currentInvoice, setCurrentInvoice] = useState({
    number: '2025-866',
    date: '2025-07-11',
    items: [
      { id: '1', name: 'MATELAS BAMBOU 140 x 190', category: 'Matelas', quantity: 1, priceTTC: 1800 },
      { id: '2', name: 'SURMATELAS BAMBOU 140 x 190', category: 'Sur-matelas', quantity: 1, priceTTC: 450 }
    ],
    eventLocation: 'Salon de l\'habitat Paris'
  });
  
  const [clientInfo, setClientInfo] = useState({
    name: 'Johan Priem',
    address: '123 Rue de la République',
    postalCode: '34000',
    city: 'Montpellier',
    phone: '06 12 34 56 78',
    email: 'johan.priem@email.com',
    siret: '12345678901234'
  });

  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const calculatePriceHT = (priceTTC: number) => Math.round((priceTTC / 1.2) * 100) / 100;
  const calculateTotal = () => currentInvoice.items.reduce((total, item) => total + (item.priceTTC * item.quantity), 0);

  // ⭐ FONCTION PNG
  const generatePNG = async () => {
    try {
      showNotification('🎨 Génération PNG...');
      
      const element = invoiceRef.current;
      if (!element) {
        showNotification('❌ Erreur: Facture introuvable');
        return;
      }

      // Vérifier que html2canvas est disponible
      if (!(window as any).html2canvas) {
        showNotification('❌ Erreur: html2canvas non chargé');
        return;
      }

      const canvas = await (window as any).html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      canvas.toBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Facture_${currentInvoice.number}_${clientInfo.name.replace(/\s+/g, '_')}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('✅ PNG téléchargé avec succès !');
      }, 'image/png');

    } catch (error) {
      showNotification('❌ Erreur génération PNG');
      console.error('Erreur:', error);
    }
  };

  const saveInvoice = () => {
    showNotification('💾 Facture sauvegardée...');
    
    // Génération PNG automatique
    setTimeout(() => {
      generatePNG();
    }, 500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#477A0C' }}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="p-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">MYCOMFORT</h1>
        <p className="text-lg opacity-90">Facturation avec génération PNG</p>
      </div>

      {/* Navigation */}
      <div className="p-6 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentView('form')}
          className={`px-6 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all ${
            currentView === 'form' 
              ? 'bg-white text-green-800' 
              : 'bg-green-700 text-white hover:bg-green-600'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>FORMULAIRE</span>
        </button>
        
        <button
          onClick={() => setCurrentView('preview')}
          className={`px-6 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all ${
            currentView === 'preview' 
              ? 'bg-white text-green-800' 
              : 'bg-green-700 text-white hover:bg-green-600'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span>APERÇU</span>
        </button>
      </div>

      {/* Boutons d'action */}
      {currentView === 'preview' && (
        <div className="p-6 flex justify-center space-x-4">
          <button
            onClick={generatePNG}
            className="px-6 py-3 bg-white text-green-800 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>TEST PNG</span>
          </button>
          
          <button
            onClick={saveInvoice}
            className="px-6 py-3 text-white rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: '#14281D' }}
          >
            <Save className="w-5 h-5" />
            <span>SAUVER + PNG</span>
          </button>
        </div>
      )}

      {/* Contenu principal */}
      <div className="p-6">
        {currentView === 'form' ? (
          // Vue formulaire
          <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#477A0C' }}>
              Créer une facture
            </h2>
            <div className="text-center text-gray-600 py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Formulaire de création de facture</p>
              <p className="text-sm mt-2">À implémenter dans la prochaine étape</p>
              <button
                onClick={() => setCurrentView('preview')}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Voir l'aperçu avec données test
              </button>
            </div>
          </div>
        ) : (
          // ⭐ FACTURE À CAPTURER
          <div 
            ref={invoiceRef}
            className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden"
            style={{ width: '794px', minHeight: '1000px' }}
          >
            {/* En-tête */}
            <div className="p-8 text-white" style={{ backgroundColor: '#477A0C' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold mb-2">MYCOMFORT</h1>
                  <p className="text-lg opacity-90">Spécialiste en literie de qualité</p>
                </div>
                <div className="text-right text-sm space-y-1">
                  <div>88 Avenue des Ternes</div>
                  <div>75017 Paris, France</div>
                  <div>SIRET: 824 313 530 00027</div>
                  <div>Tél: 04 68 50 41 45</div>
                  <div>Email: myconfort@gmail.com</div>
                  <div>Site: https://www.htconfort.com</div>
                </div>
              </div>
            </div>

            {/* Contenu facture */}
            <div className="p-8 space-y-8">
              {/* Titre */}
              <div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#477A0C' }}>FACTURE</h2>
                <div className="space-y-2">
                  <div><strong>Facture n°:</strong> {currentInvoice.number}</div>
                  <div><strong>Date:</strong> {new Date(currentInvoice.date).toLocaleDateString('fr-FR')}</div>
                  <div><strong>Lieu:</strong> {currentInvoice.eventLocation}</div>
                </div>
              </div>

              {/* Client */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#F2EFE2' }}>
                <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#477A0C' }}>
                  <Users className="w-5 h-5 mr-2" />
                  FACTURER À:
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-bold text-lg">{clientInfo.name}</div>
                    <div>{clientInfo.address}</div>
                    <div>{clientInfo.postalCode} {clientInfo.city}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {clientInfo.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {clientInfo.email}
                    </div>
                    <div className="text-sm mt-2 bg-blue-100 px-2 py-1 rounded inline-block">
                      SIRET: {clientInfo.siret}
                    </div>
                  </div>
                </div>
              </div>

              {/* Produits */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#477A0C' }}>
                  <Package className="w-5 h-5 mr-2" />
                  PRODUITS
                </h3>
                
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr style={{ backgroundColor: '#477A0C' }} className="text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left">Désignation</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Qté</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Prix unit.</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.category}</div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {item.priceTTC.toLocaleString()}€
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-bold" style={{ color: '#477A0C' }}>
                          {(item.priceTTC * item.quantity).toLocaleString()}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="grid grid-cols-2 gap-8">
                <div></div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Montant HT:</span>
                    <span className="font-medium">{calculatePriceHT(calculateTotal()).toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>TVA (20%):</span>
                    <span className="font-medium">{(calculateTotal() - calculatePriceHT(calculateTotal())).toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 rounded-lg font-bold text-lg" style={{ backgroundColor: '#477A0C', color: 'white' }}>
                    <span>TOTAL TTC:</span>
                    <span>{calculateTotal().toLocaleString()}€</span>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h3 className="font-bold mb-4" style={{ color: '#477A0C' }}>CONDITIONS DE RÈGLEMENT</h3>
                <div className="text-sm space-y-1">
                  <div>Mode de paiement: Chèque à venir</div>
                  <div>Conseiller(e): sylvie</div>
                  <div>CGV acceptées par le client</div>
                  <div>Date de génération: {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="border-b-2 pb-2 mb-2" style={{ borderColor: '#477A0C', height: '60px' }}></div>
                  <div className="text-sm text-center">Signature du client</div>
                </div>
                <div>
                  <div className="border-b-2 pb-2 mb-2" style={{ borderColor: '#477A0C', height: '60px' }}></div>
                  <div className="text-sm text-center">Signature MYCOMFORT</div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 pt-4">
                MYCOMFORT - Spécialiste en literie de qualité - SIRET: 824 313 530 00027
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;