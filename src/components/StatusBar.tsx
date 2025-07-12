import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBarProps {
  status: 'draft' | 'ready' | 'sent' | 'paid';
  invoiceNumber?: string;
  lastSaved?: Date;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  status, 
  invoiceNumber, 
  lastSaved 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Brouillon',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'ready':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Prête à envoyer',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'sent':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Envoyée',
          color: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'paid':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Payée',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Brouillon',
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-white border-b px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.color}`}>
            {statusConfig.icon}
            <span className="text-sm font-medium">{statusConfig.text}</span>
          </div>
          
          {invoiceNumber && (
            <div className="text-sm text-gray-600">
              Facture <span className="font-semibold">{invoiceNumber}</span>
            </div>
          )}
        </div>

        {lastSaved && (
          <div className="text-xs text-gray-500">
            Dernière sauvegarde: {lastSaved.toLocaleTimeString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
};