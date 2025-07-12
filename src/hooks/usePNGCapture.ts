import { useCallback } from 'react';
import { Invoice } from '../types';

// Déclaration globale pour html2canvas
declare global {
  interface Window {
    html2canvas: any;
  }
}

interface CaptureOptions {
  scale?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

export const usePNGCapture = () => {
  const captureElement = useCallback(async (
    element: HTMLElement,
    filename: string,
    options: CaptureOptions = {}
  ): Promise<boolean> => {
    if (!window.html2canvas) {
      throw new Error('html2canvas non disponible');
    }

    try {
      const defaultOptions = {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        useCORS: true,
        allowTaint: true,
        ...options
      };

      console.log('📸 Début capture PNG...');
      
      const canvas = await window.html2canvas(element, defaultOptions);
      
      // Créer le lien de téléchargement
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      console.log('✅ PNG téléchargé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur capture PNG:', error);
      throw error;
    }
  }, []);

  const captureInvoice = useCallback(async (
    invoiceRef: React.RefObject<HTMLElement>,
    invoice: Invoice,
    options?: CaptureOptions
  ): Promise<boolean> => {
    if (!invoiceRef.current) {
      throw new Error('Référence de la facture non disponible');
    }

    const filename = `Facture_${invoice.invoiceNumber}_${invoice.client.name.replace(/\s+/g, '_')}.png`;
    return captureElement(invoiceRef.current, filename, options);
  }, [captureElement]);

  const captureWithCustomName = useCallback(async (
    element: HTMLElement,
    customName: string,
    options?: CaptureOptions
  ): Promise<boolean> => {
    const filename = `${customName}.png`;
    return captureElement(element, filename, options);
  }, [captureElement]);

  return {
    captureElement,
    captureInvoice,
    captureWithCustomName
  };
};