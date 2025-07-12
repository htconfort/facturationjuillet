import React from 'react';
import { FileText } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'form' | 'preview';
  onTabChange: (tab: 'form' | 'preview') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <FileText className="w-8 h-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">MyComfort Facturation</h1>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('form')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'form'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📝 FORMULAIRE
            </button>
            <button
              onClick={() => onTabChange('preview')}
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
  );
};