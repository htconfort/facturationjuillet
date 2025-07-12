import React from 'react';

const InvoicePreview = React.forwardRef(({ currentInvoice, clientInfo, ...props }, ref) => (
  <div ref={ref} className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
    <div className="p-8 text-white" style={{ backgroundColor: '#477A0C' }}>
      <h1 className="text-4xl font-bold mb-2">MYCONFORT</h1>
      {/* ... autres infos */}
    </div>
    {/* ... reste du preview */}
  </div>
));
export default InvoicePreview;
