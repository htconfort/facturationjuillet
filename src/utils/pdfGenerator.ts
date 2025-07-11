import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from './invoiceStorage';

// Fonction de génération PDF
export const generatePDF = async (invoice: Invoice): Promise<jsPDF> => {
  try {
    const element = document.getElementById('pdf-template');
    
    if (!element) {
      throw new Error('Élément PDF template non trouvé');
    }

    console.log('🎯 Génération du PDF pour la facture:', invoice.invoiceNumber);
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Si l'image est plus haute qu'une page, on peut gérer la pagination
    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight;
      let position = 0;
      
      // Première page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Pages supplémentaires si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } else {
      // Image tient sur une page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }
    
    console.log('✅ PDF généré avec succès');
    return pdf;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

// Fonction pour télécharger le PDF
export const downloadPDF = async (invoice: Invoice): Promise<void> => {
  try {
    const pdf = await generatePDF(invoice);
    const filename = `Facture_${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(filename);
    console.log('📥 PDF téléchargé:', filename);
  } catch (error) {
    console.error('❌ Erreur lors du téléchargement:', error);
    throw error;
  }
};

// Fonction pour prévisualiser le PDF
export const previewPDF = async (invoice: Invoice): Promise<string> => {
  try {
    const pdf = await generatePDF(invoice);
    const pdfBlob = pdf.output('blob');
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error('❌ Erreur lors de la prévisualisation:', error);
    throw error;
  }
};

// Fonction pour envoyer le PDF par email (si intégration email disponible)
export const getPDFBlob = async (invoice: Invoice): Promise<Blob> => {
  try {
    const pdf = await generatePDF(invoice);
    return pdf.output('blob');
  } catch (error) {
    console.error('❌ Erreur lors de la création du blob PDF:', error);
    throw error;
  }
};

// Fonction pour envoyer le PDF par email
export const sendPDFByEmail = async (
  invoice: Invoice, 
  recipientEmail?: string,
  customMessage?: string
): Promise<boolean> => {
  try {
    // Import dynamique pour éviter les dépendances circulaires
    const { sendPDFByEmail: emailSender } = await import('./emailService');
    return await emailSender(invoice, recipientEmail, customMessage);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi email:', error);
    throw error;
  }
};

// Fonction pour sauvegarder le PDF sur Google Drive
export const savePDFToGoogleDrive = async (
  invoice: Invoice,
  customFilename?: string
): Promise<any> => {
  try {
    // Import dynamique pour éviter les dépendances circulaires
    const { saveInvoiceToGoogleDrive } = await import('./googleDriveService');
    return await saveInvoiceToGoogleDrive(invoice, customFilename);
  } catch (error) {
    console.error('❌ Erreur sauvegarde Google Drive:', error);
    throw error;
  }
};