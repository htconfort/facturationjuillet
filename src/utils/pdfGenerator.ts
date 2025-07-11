import jsPDF from 'jspdf';
import { Invoice } from './invoiceStorage';

// Couleurs de la charte graphique MyComfort
const colors = {
  primary: [71, 122, 12] as [number, number, number],     // #477A0C
  dark: [20, 40, 29] as [number, number, number],         // #14281D  
  beige: [242, 239, 226] as [number, number, number],     // #F2EFE2
  red: [245, 93, 62] as [number, number, number],         // #F55D3E
  gray: [107, 114, 128] as [number, number, number]       // Gris texte
};

// Interface pour les items de facture
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discount?: number;
  discountType?: 'percentage' | 'amount';
  customDiscountAmount?: number;
}

// Fonction principale de génération PDF
export const generateInvoicePDF = (invoice: Invoice): jsPDF => {
  const doc = new jsPDF();
  
  // === EN-TÊTE ENTREPRISE ===
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('MYCONFORT', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('88 Avenue des Ternes, 75017 Paris', 20, 32);
  doc.text('SIRET: 824 313 530 00027 • Tél: 04 68 50 41 45', 20, 37);

  // === INFORMATIONS FACTURE ===
  doc.setTextColor(...colors.dark);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`FACTURE ${invoice.invoiceNumber}`, 130, 25);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, 130, 32);
  doc.text(`Statut: Émise`, 130, 37);

  // === INFORMATIONS CLIENT ===
  doc.setFillColor(...colors.beige);
  doc.rect(15, 50, 90, 35, 'F');
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('FACTURÉ À:', 20, 60);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(invoice.clientName, 20, 68);
  
  // Diviser l'adresse en lignes si nécessaire
  const addressLines = invoice.clientAddress.split('\n');
  let yPos = 74;
  addressLines.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });

  // === TABLEAU PRODUITS ===
  let yPosition = 95;
  
  // En-tête tableau
  doc.setFillColor(...colors.primary);
  doc.rect(15, yPosition, 180, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('DÉSIGNATION', 20, yPosition + 7);
  doc.text('QTÉ', 120, yPosition + 7);
  doc.text('PRIX UNIT.', 140, yPosition + 7);
  doc.text('TOTAL', 180, yPosition + 7);
  
  yPosition += 12;

  // Lignes produits
  invoice.items.forEach((item, index) => {
    // Couleur alternée
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
      doc.rect(15, yPosition - 2, 180, 8, 'F');
    }
    
    doc.setTextColor(...colors.dark);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    
    // Nom produit (limité à 35 caractères)
    const productName = item.description.length > 35 ? 
      item.description.substring(0, 35) + '...' : item.description;
    doc.text(productName, 20, yPosition + 4);
    
    // Quantité
    doc.text(item.quantity.toString(), 125, yPosition + 4);
    
    // Prix unitaire
    doc.text(`${item.unitPrice.toFixed(2)}€`, 145, yPosition + 4);
    
    // Total ligne
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text(`${item.total.toFixed(2)}€`, 185, yPosition + 4);
    
    yPosition += 8;
  });

  // === TOTAUX ===
  yPosition += 10;
  
  // Calculs
  const montantHT = Math.round((invoice.subtotal) * 100) / 100;
  const tva = Math.round((invoice.tax) * 100) / 100;
  const totalTTC = Math.round((invoice.total) * 100) / 100;

  // Encadré totaux
  doc.setFillColor(...colors.beige);
  doc.rect(120, yPosition, 75, 25, 'F');
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(1);
  doc.rect(120, yPosition, 75, 25);
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  // Lignes de totaux
  doc.text('Montant HT:', 125, yPosition + 8);
  doc.text(`${montantHT.toFixed(2)}€`, 185, yPosition + 8, { align: 'right' });
  
  doc.text('TVA 20%:', 125, yPosition + 14);
  doc.text(`${tva.toFixed(2)}€`, 185, yPosition + 14, { align: 'right' });
  
  // Total TTC mis en valeur
  doc.setFillColor(...colors.primary);
  doc.rect(125, yPosition + 16, 65, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL TTC:', 127, yPosition + 20);
  doc.text(`${totalTTC.toFixed(2)}€`, 185, yPosition + 20, { align: 'right' });

  // === PIED DE PAGE ===
  doc.setTextColor(...colors.gray);
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Email: myconfort@gmail.com • Site: https://www.htconfort.com', 105, 280, { align: 'center' });
  doc.text(`Facture générée le ${new Date().toLocaleDateString('fr-FR')}`, 105, 285, { align: 'center' });

  return doc;
};

// Fonction pour télécharger le PDF
export const downloadInvoicePDF = (invoice: Invoice): void => {
  try {
    const doc = generateInvoicePDF(invoice);
    doc.save(`MYCONFORT_Facture_${invoice.invoiceNumber}.pdf`);
    console.log(`✅ PDF téléchargé: Facture ${invoice.invoiceNumber}`);
  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    throw error;
  }
};

// Fonction pour obtenir le blob PDF (pour email/cloud)
export const getPDFBlob = async (invoice: Invoice): Promise<Blob> => {
  try {
    const doc = generateInvoicePDF(invoice);
    return doc.output('blob');
  } catch (error) {
    console.error('❌ Erreur création blob PDF:', error);
    throw error;
  }
};

// Fonction pour prévisualiser le PDF
export const previewInvoicePDF = (invoice: Invoice): string => {
  try {
    const doc = generateInvoicePDF(invoice);
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error('❌ Erreur prévisualisation PDF:', error);
    throw error;
  }
};

// Fonction de génération PDF avec fallback JSON
export const generatePDF = async (invoice: Invoice): Promise<jsPDF> => {
  return generateInvoicePDF(invoice);
};

// Fonction de téléchargement avec fallback
export const downloadPDF = async (invoice: Invoice): Promise<void> => {
  return downloadInvoicePDF(invoice);
};