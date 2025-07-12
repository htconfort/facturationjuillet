import React, { useRef, useState } from 'react';
import { PenTool, RotateCcw, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  signature?: string | null;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  signature
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!signature);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#374151';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setHasSignature(true);
    
    // Sauvegarder la signature
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  const validateSignature = () => {
    if (hasSignature) {
      alert('✅ Signature validée !');
    } else {
      alert('⚠️ Veuillez d\'abord signer');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <PenTool className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Signature électronique</h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={clearSignature}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Effacer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Effacer</span>
          </button>
          
          <button
            onClick={validateSignature}
            disabled={!hasSignature}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              hasSignature
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Valider"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm">Valider</span>
          </button>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-32 bg-white border border-gray-200 rounded cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
        
        {!hasSignature && (
          <p className="text-center text-gray-500 text-sm mt-2">
            Cliquez et glissez pour signer
          </p>
        )}
      </div>

      {hasSignature && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Signature capturée</span>
          </div>
        </div>
      )}
    </div>
  );
};