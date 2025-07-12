import React from 'react';

const SignaturePad = ({ signatureMode, signaturePaths, typedSignature, setTypedSignature, clearSignature }) => (
  <div>
    {signatureMode === 'draw' ? (
      <div className="border-2 border-dashed rounded-lg p-4 bg-white">
        {/* Ici tu ajoutes la logique de dessin */}
        <div>(Zone dessin signature à implémenter)</div>
        <button onClick={clearSignature}>Effacer</button>
      </div>
    ) : (
      <div className="border-2 border-dashed rounded-lg p-4 bg-white">
        <input type="text" value={typedSignature} onChange={e => setTypedSignature(e.target.value)} placeholder="Tapez votre nom" />
        <button onClick={clearSignature}>Effacer</button>
      </div>
    )}
  </div>
);
export default SignaturePad;
