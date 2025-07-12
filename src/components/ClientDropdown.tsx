import React, { useState } from 'react';
import { ChevronDown, Plus, User } from 'lucide-react';
import { ClientInfo } from '../utils/data';

interface ClientDropdownProps {
  clients: ClientInfo[];
  selectedClient: ClientInfo | null;
  onClientSelect: (client: ClientInfo) => void;
  onNewClient: () => void;
}

export const ClientDropdown: React.FC<ClientDropdownProps> = ({
  clients,
  selectedClient,
  onClientSelect,
  onNewClient
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Client
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <span className={selectedClient ? 'text-gray-900' : 'text-gray-500'}>
            {selectedClient ? selectedClient.name : 'Sélectionner un client'}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <button
            onClick={() => {
              onNewClient();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100"
          >
            <Plus className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Nouveau client</span>
          </button>
          
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                onClientSelect(client);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
            >
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">{client.name}</div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};