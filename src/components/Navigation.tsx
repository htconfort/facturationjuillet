import React from 'react';
import { FileText } from 'lucide-react';

interface NavigationProps {
  activeTab: 'form' | 'preview' | 'list';
  onTabChange: (tab: 'form' | 'preview' | 'list') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'form' as const, label: '📝 FORMULAIRE', description: 'Créer une facture' },
    { id: 'preview' as const, label: '👁️ APERÇU', description: 'Prévisualiser' },
    { id: 'list' as const, label: '📋 LISTE', description: 'Toutes les factures' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <FileText className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">MyComfort Facturation</h1>
              <p className="text-xs text-gray-500">Solutions de confort</p>
            </div>
          </div>
          
          {/* Onglets de navigation */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                title={tab.description}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};