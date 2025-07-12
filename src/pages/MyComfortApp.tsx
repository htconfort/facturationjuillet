import React, { useState, useEffect } from "react";

// Import des utilitaires PDF
import { downloadPDF as generatePDF } from '../utils/pdfGenerator';
import { Invoice } from '../utils/data';

export default function MyComfortApp() {
  // === Formulaire client ===
  const [client, setClient] = useState({
    nom: "",
    adresse: "",
    ville: "",
    codePostal: "",
    telephone: "",
    email: "",
    siret: "",
  });

  // === Bibliothèque produits ===
  const produitsCatalogue = [
    { categorie: "Matelas", taille: "70 x 190", nom: "MATELAS BAMBOU 70 x 190", prix: 900 },
    { categorie: "Matelas", taille: "80 x 200", nom: "MATELAS BAMBOU 80 x 200", prix: 1050 },
    { categorie: "Matelas", taille: "90 x 190", nom: "MATELAS BAMBOU 90 x 190", prix: 1110 },
    { categorie: "Matelas", taille: "90 x 200", nom: "MATELAS BAMBOU 90 x 200", prix: 1150 },
    { categorie: "Matelas", taille: "120 x 190", nom: "MATELAS BAMBOU 120 x 190", prix: 1600 },
    { categorie: "Matelas", taille: "140 x 190", nom: "MATELAS BAMBOU 140 x 190", prix: 1800 },
    { categorie: "Matelas", taille: "140 x 200", nom: "MATELAS BAMBOU 140 x 200", prix: 1880 },
    { categorie: "Matelas", taille: "160 x 200", nom: "MATELAS BAMBOU 160 x 200", prix: 2100 },
    { categorie: "Matelas", taille: "180 x 200", nom: "MATELAS BAMBOU 180 x 200", prix: 2200 },
    { categorie: "Matelas", taille: "200 x 200", nom: "MATELAS BAMBOU 200 x 200", prix: 2300 },
    { categorie: "Oreiller", taille: "60 x 40", nom: "OREILLER BAMBOU 60 x 40", prix: 80 },
    { categorie: "Couette", taille: "220 x 240", nom: "COUETTE BAMBOU 220 x 240", prix: 210 },
    { categorie: "Couette", taille: "240 x 260", nom: "COUETTE BAMBOU 240 x 260", prix: 270 }
  ];

  const [catSel, setCatSel] = useState("");
  const [tailleSel, setTailleSel] = useState("");
  const [qteSel, setQteSel] = useState(1);
  const [produitTrouve, setProduitTrouve] = useState(null);
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    if (catSel && tailleSel) {
      const prod = produitsCatalogue.find(p => p.categorie === catSel && p.taille === tailleSel);
      setProduitTrouve(prod || null);
    } else {
      setProduitTrouve(null);
    }
  }, [catSel, tailleSel]);

  const taillesDispo = catSel
    ? [...new Set(produitsCatalogue.filter(p => p.categorie === catSel).map(p => p.taille))]
    : [];

  const supprimerProduit = idx => {
    setProduits(produits.filter((_, i) => i !== idx));
  };

  const total = produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);

  // Fonction de sauvegarde locale améliorée
  const saveLocal = () => {
    try {
      // Créer l'objet facture
      const facture = {
        id: `FAC-${Date.now()}`,
        invoiceNumber: `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        date: new Date().toLocaleDateString('fr-FR'),
        clientName: client.nom,
        clientAddress: `${client.adresse}\n${client.codePostal} ${client.ville}`,
        clientPhone: client.telephone,
        clientEmail: client.email,
        items: produits.map(p => ({
          id: Date.now().toString() + Math.random(),
          description: p.nom,
          quantity: p.quantite,
          unitPrice: p.prix,
          total: p.prix * p.quantite
        })),
        subtotal: total / 1.2, // Prix HT (en supposant TVA 20%)
        tax: total - (total / 1.2), // TVA
        total: total
      };

      // Récupérer les factures existantes
      const facturesExistantes = JSON.parse(localStorage.getItem("factures") || "[]");
      
      // Ajouter la nouvelle facture
      facturesExistantes.push(facture);
      
      // Sauvegarder le tableau mis à jour
      localStorage.setItem("factures", JSON.stringify(facturesExistantes));
      
      alert(`✅ Facture ${facture.invoiceNumber} enregistrée ! Total: ${facturesExistantes.length} facture(s) sauvegardée(s).`);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("❌ Erreur lors de la sauvegarde");
    }
  };

  // Fonction de téléchargement PDF
  const downloadPDF = async () => {
    try {
      // Créer l'objet facture pour le PDF
      const invoiceForPDF: Invoice = {
        id: `FAC-${Date.now()}`,
        invoiceNumber: `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        date: new Date().toLocaleDateString('fr-FR'),
        clientName: client.nom,
        clientAddress: `${client.adresse}\n${client.codePostal} ${client.ville}`,
        clientPhone: client.telephone,
        clientEmail: client.email,
        items: produits.map(p => ({
          id: Date.now().toString() + Math.random(),
          description: p.nom,
          quantity: p.quantite,
          unitPrice: p.prix,
          total: p.prix * p.quantite
        })),
        subtotal: total / 1.2,
        tax: total - (total / 1.2),
        total: total
      };

      await generatePDF(invoiceForPDF);
      alert("✅ PDF téléchargé avec succès !");
    } catch (error) {
      console.error('Erreur PDF:', error);
      alert("❌ Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#f7f8f5] min-h-screen">
      {/* FORMULAIRE CLIENT */}
      <div className="bg-white rounded-xl shadow p-7 mb-6 border">
        <h2 className="text-2xl font-bold mb-5 text-[#477A0C]">INFORMATIONS CLIENT</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Nom complet*</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="text"
              value={client.nom}
              onChange={e => setClient({ ...client, nom: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Adresse*</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="text"
              value={client.adresse}
              onChange={e => setClient({ ...client, adresse: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ville*</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="text"
              value={client.ville}
              onChange={e => setClient({ ...client, ville: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Code postal*</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="text"
              value={client.codePostal}
              onChange={e => setClient({ ...client, codePostal: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Téléphone*</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="tel"
              value={client.telephone}
              onChange={e => setClient({ ...client, telephone: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email*</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="email"
              value={client.email}
              onChange={e => setClient({ ...client, email: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">SIRET</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="text"
              value={client.siret}
              onChange={e => setClient({ ...client, siret: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* PRODUITS INTERACTIFS */}
      <div className="bg-white rounded-xl shadow p-7 mb-6 border">
        <div className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">🛒</span> AJOUTER UN PRODUIT À LA FACTURE
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          {/* Catégorie */}
          <div>
            <label className="font-semibold">Catégorie</label>
            <select
              className="border rounded px-2 py-1"
              value={catSel}
              onChange={e => { setCatSel(e.target.value); setTailleSel(""); }}
            >
              <option value="">Sélectionner</option>
              {[...new Set(produitsCatalogue.map(p => p.categorie))].map(c =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>
          {/* Taille */}
          <div>
            <label className="font-semibold">Taille</label>
            <select
              className="border rounded px-2 py-1"
              value={tailleSel}
              onChange={e => setTailleSel(e.target.value)}
              disabled={!catSel}
            >
              <option value="">Toutes les tailles</option>
              {taillesDispo.map(taille =>
                <option key={taille} value={taille}>{taille}</option>
              )}
            </select>
          </div>
          {/* Quantité */}
          <div>
            <label className="font-semibold">Quantité</label>
            <select
              className="border rounded px-2 py-1"
              value={qteSel}
              onChange={e => setQteSel(Number(e.target.value))}
              disabled={!produitTrouve}
            >
              {[...Array(10).keys()].map(q => <option key={q+1} value={q+1}>{q+1} unité</option>)}
            </select>
          </div>
          {/* Prix total */}
          <div>
            <label className="font-semibold">Prix total</label>
            <div className="border rounded px-4 py-2 bg-gray-100 min-w-[100px]">
              {produitTrouve ? (produitTrouve.prix * qteSel) + " €" : "Sélectionnez un produit"}
            </div>
          </div>
          {/* Bouton sélectionner */}
          <button
            className="bg-green-700 text-white px-4 py-2 rounded ml-4"
            disabled={!produitTrouve}
            onClick={() => {
              if (produitTrouve) {
                setProduits([
                  ...produits,
                  { ...produitTrouve, quantite: qteSel }
                ]);
              }
            }}
          >
            + SÉLECTIONNER
          </button>
        </div>
        {/* Affichage cartes produits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {produitsCatalogue.filter(p =>
            (!catSel || p.categorie === catSel) &&
            (!tailleSel || p.taille === tailleSel)
          ).map((p, idx) =>
            <div key={idx} className="rounded-lg border p-3 bg-[#f9fdf5] shadow hover:shadow-md">
              <div className="font-bold">{p.nom}</div>
              <div className="text-sm">{p.taille}</div>
              <div className="text-green-700 font-bold text-xl">{p.prix} €</div>
              <div className="text-xs text-gray-600">{p.categorie}</div>
            </div>
          )}
        </div>
        {/* Tableau des produits ajoutés */}
        <div className="mt-5">
          <table className="w-full border mt-2">
            <thead className="bg-[#d0e7be]">
              <tr>
                <th>Produit</th>
                <th>Qté</th>
                <th>PU TTC</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p, i) => (
                <tr key={i}>
                  <td>{p.nom} <span className="text-xs">({p.taille})</span></td>
                  <td>{p.quantite}</td>
                  <td>{p.prix} €</td>
                  <td>{p.prix * p.quantite} €</td>
                  <td>
                    <button className="text-red-500" onClick={() => supprimerProduit(i)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {produits.length === 0 &&
                <tr><td colSpan={5} className="text-center text-gray-400 py-3">Aucun produit ajouté</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* RÉCAPITULATIF */}
      <div className="bg-white rounded-xl shadow p-7 mb-6 border">
        <h2 className="text-xl font-bold mb-4 text-[#477A0C]">RÉCAPITULATIF FACTURE</h2>
        <div className="mb-2"><span className="font-semibold">Client :</span> {client.nom || <span className="text-gray-400">Non renseigné</span>}</div>
        <div className="mb-2"><span className="font-semibold">Adresse :</span> {client.adresse || <span className="text-gray-400">Non renseigné</span>}</div>
        <div className="mb-2"><span className="font-semibold">Produits :</span> {produits.length} sélectionné(s)</div>
        <div className="mb-2"><span className="font-semibold">Total TTC :</span> <span className="text-xl text-green-700 font-bold">{total} €</span></div>
        
        {/* Boutons d'action */}
        <div className="flex gap-3 mt-6">
          <button
            className="bg-blue-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors"
            onClick={saveLocal}
            disabled={!client.nom || produits.length === 0}
          >
            <Save className="w-4 h-4" />
            💾 Enregistrer localement
          </button>
          <button
            className="bg-green-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-green-800 transition-colors"
            onClick={downloadPDF}
            disabled={!client.nom || produits.length === 0}
          >
            <Download className="w-4 h-4" />
            🖨️ Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}
