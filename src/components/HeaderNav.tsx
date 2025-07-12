import React from 'react';
import { FileText, Users, Send, Cloud } from 'lucide-react';

const HeaderNav = ({
  tabs,
  activeTab,
  setActiveTab,
  showClientDropdown,
  setShowClientDropdown,
  showInvoiceDropdown,
  setShowInvoiceDropdown,
  sendInvoiceByEmail,
  saveToGoogleDrive,
}) => (
  <div style={{ backgroundColor: '#477A0C' }} className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <FileText className="w-6 h-6 text-white" />
        <div className="text-white">
          <div className="font-bold text-lg">MYCONFORT</div>
          <div className="text-sm opacity-90">Facturation</div>
        </div>
      </div>
      {/* ... la suite du code du header et des onglets ici ... */}
    </div>
  </div>
);

export default HeaderNav;
