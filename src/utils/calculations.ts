import { InvoiceItem } from './data';

// Interface pour les totaux
export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
}

// Taux de TVA par défaut
export const DEFAULT_TAX_RATE = 0.20; // 20%

/**
 * Calcule les totaux d'une facture
 */
export const calculateTotals = (
  items: InvoiceItem[], 
  taxRate: number = DEFAULT_TAX_RATE
): InvoiceTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    taxRate: taxRate * 100 // Retourner en pourcentage
  };
};

/**
 * Calcule le total d'un item
 */
export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return Math.round(quantity * unitPrice * 100) / 100;
};

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

/**
 * Calcule la remise
 */
export const calculateDiscount = (
  subtotal: number, 
  discountRate: number
): number => {
  return Math.round(subtotal * discountRate * 100) / 100;
};

/**
 * Applique une remise aux totaux
 */
export const applyDiscount = (
  totals: InvoiceTotals, 
  discountRate: number
): InvoiceTotals => {
  const discount = calculateDiscount(totals.subtotal, discountRate);
  const newSubtotal = totals.subtotal - discount;
  const newTax = newSubtotal * (totals.taxRate / 100);
  const newTotal = newSubtotal + newTax;

  return {
    subtotal: Math.round(newSubtotal * 100) / 100,
    tax: Math.round(newTax * 100) / 100,
    total: Math.round(newTotal * 100) / 100,
    taxRate: totals.taxRate
  };
};

/**
 * Valide les données numériques
 */
export const validateNumericInput = (value: string): number => {
  const num = parseFloat(value);
  return isNaN(num) || num < 0 ? 0 : Math.round(num * 100) / 100;
};

/**
 * Calcule le prix unitaire à partir du total et de la quantité
 */
export const calculateUnitPrice = (total: number, quantity: number): number => {
  if (quantity <= 0) return 0;
  return Math.round((total / quantity) * 100) / 100;
};

/**
 * Convertit un taux de pourcentage en décimal
 */
export const percentageToDecimal = (percentage: number): number => {
  return percentage / 100;
};

/**
 * Convertit un décimal en pourcentage
 */
export const decimalToPercentage = (decimal: number): number => {
  return decimal * 100;
};