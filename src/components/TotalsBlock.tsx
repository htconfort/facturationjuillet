import React from 'react';
import { Calculator } from 'lucide-react';

interface TotalsBlockProps {
  subtotal: number;
  taxRate?: number;
  tax: number;
  total: number;
  className?: string;
}

export const TotalsBlock: React.FC<TotalsBlockProps> = ({
  subtotal,
  taxRate = 20,
  tax,
  total,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Calculator className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Totaux</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Sous-total HT:</span>
          <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">TVA ({taxRate}%):</span>
          <span className="font-semibold text-gray-900">{tax.toFixed(2)} €</span>
        </div>
        
        <div className="border-t-2 border-green-600 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-600">TOTAL TTC:</span>
            <span className="text-xl font-bold text-green-600">{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Paiement à 30 jours fin de mois</p>
          <p>• Aucun escompte pour paiement anticipé</p>
          <p>• TVA non applicable, art. 293 B du CGI</p>
        </div>
      </div>
    </div>
  );
};