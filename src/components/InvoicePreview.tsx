import React from 'react';
import { Invoice } from '../utils/invoiceStorage';

interface InvoicePreviewProps {
  invoice: Invoice;
  className?: string;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
  invoice, 
  className = "" 
}) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto shadow-lg ${className}`}>
      {/* En-tête avec logo et titre */}
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
            <p className="font-semibold">N° {invoice.invoiceNumber}</p>
            <p>Date: {invoice.date}</p>
          </div>
        </div>
      </div>

      {/* Informations entreprise et client */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Informations entreprise */}
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

        {/* Informations client */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 text-lg border-b-2 border-green-600 pb-1">
            FACTURÉ À
          </h3>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{invoice.clientName}</p>
            {invoice.clientAddress.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            {invoice.clientPhone && <p>Tél: {invoice.clientPhone}</p>}
            {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
          </div>
        </div>
      </div>

      {/* Tableau des produits/services */}
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
            {invoice.items.map((item, index) => (
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
                <span className="font-semibold">{invoice.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>TVA (20%):</span>
                <span className="font-semibold">{invoice.tax.toFixed(2)} €</span>
              </div>
              <div className="border-t-2 border-green-600 pt-3">
                <div className="flex justify-between text-xl font-bold text-green-600">
                  <span>TOTAL TTC:</span>
                  <span>{invoice.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature et mentions légales */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Conditions de paiement:</h4>
          <p className="text-sm text-gray-600">
            Paiement à 30 jours fin de mois<br/>
            Aucun escompte pour paiement anticipé
          </p>
        </div>
        <div className="text-right">
          <div className="inline-block">
            <p className="text-sm text-gray-600 mb-2">Signature électronique</p>
            <div className="w-32 h-16 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-xs">MyComfort</span>
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
  );
};