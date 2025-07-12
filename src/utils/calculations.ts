// Fonctions utilitaires de calcul

export function calculatePriceHT(ttc: number) {
  return +(ttc / 1.2).toFixed(2);
}

export function calculateDiscountAmount(item) {
  // Implémente ta logique de remise
  return 0;
}

// ...autres fonctions

export function calculateTotals(items: any[]) {
  // Exemple de logique simple à adapter selon ton besoin
  const total = items.reduce((acc, item) => acc + (item.priceTTC * item.quantity), 0);
  const totalHT = total / 1.2; // Si TVA 20%
  const tva = total - totalHT;
  return {
    totalTTC: total,
    totalHT,
    tva,
  };
}