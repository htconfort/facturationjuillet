import React, { useState } from "react";

// 👤 Typage client simple
const emptyClient = {
  nom: "",
  adresse: "",
  cp: "",
  ville: "",
  tel: "",
  email: "",
  logement: "",
  codeEtage: "",
  siret: ""
};

const produitsCatalogue = [
  { categorie: "Matelas", nom: "MATELAS BAMBOU 140x190", prix: 1600 },
  { categorie: "Matelas", nom: "MATELAS BAMBOU 90x200", prix: 1150 },
  { categorie: "Oreiller", nom: "OREILLER BAMBOU 60x40", prix: 80 },
  // Ajoute tous tes produits ici !
];

const methodesPaiement = [
  "Chèque à venir",
  "Carte bancaire",
  "Virement",
  "Espèces",
  "PayPal",
  "Autre"
];

export default function App() {
  // --- ÉTAT ---
  const [client, setClient] = useState({ ...emptyClient });
  const [produit, setProduit] = useState({ categorie: "", nom: "", prix: 0, quantite: 1 });
  const [produits, setProduits] = useState([]);
  const [date, setDate] = useState("");
  const [lieu, setLieu] = useState("");
  const [modePaiement, setModePaiement] = useState("");
  const [conseiller, setConseiller] = useState("");
  const [cgvOk, setCgvOk] = useState(false);
  const [remarques, setRemarques] = useState("");
  const [acompte, setAcompte] = useState(0);
  const [signature, setSignature] = useState("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  // --- HANDLERS ---
  const handleProduitSelect = (e) => {
    const prod = produitsCatalogue.find(p => p.nom === e.target.value);
    setProduit({ ...produit, nom: prod?.nom || "", prix: prod?.prix || 0, categorie: prod?.categorie || "" });
  };

  const ajouterProduit = () => {
    if (produit.nom && produit.quantite > 0) {
      setProduits([...produits, { ...produit }]);
      setProduit({ categorie: "", nom: "", prix: 0, quantite: 1 });
    }
  };

  const supprimerProduit = (idx) => {
    setProduits(produits.filter((_, i) => i !== idx));
  };

  const totalHT = produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);
  const TVA = Math.round(totalHT * 0.2 * 100) / 100;
  const totalTTC = totalHT + TVA;

  // --- SIGNATURE PAD MINIMAL (texte pour démo, remplace par vrai pad si tu veux) ---
  function SignaturePad() {
    return (
      <div style={{ border: "2px dashed #888", minHeight: 80, background: "#fff", padding: 8 }}>
        <input
          type="text"
          placeholder="Simulez une signature (tapez votre nom)"
          className="w-full"
          value={signature}
          onChange={e => setSignature(e.target.value)}
        />
        <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded" onClick={() => setShowSignaturePad(false)}>
          Valider
        </button>
      </div>
    );
  }

  // --- RENDU ---
  return (
    <div className="min-h-screen bg-[#f2fef2] font-[Manrope] text-[#214b10] p-0 m-0">
      {/* HEADER */}
      <div className="flex px-4 py-2 bg-[#4a7a0c] items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛏️</span>
          <span className="text-3xl font-bold">MYCONFORT</span>
          <span className="ml-4 text-xl font-light">Facturation</span>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#ede9c7] text-[#214b10] px-5 py-2 rounded font-bold">💾 Enregistrer</button>
          <button className="bg-[#99c8fd] px-5 py-2 rounded">📄 Factures</button>
          <button className="bg-[#ffe58d] px-5 py-2 rounded">📦 Produits</button>
          <button className="bg-[#e9a5ec] px-5 py-2 rounded">👤 Client</button>
          <button className="bg-[#ef5942] text-white px-5 py-2 rounded">✈️ Envoyer</button>
          <button className="bg-[#4399fc] text-white px-5 py-2 rounded">💾 Google Drive</button>
        </div>
      </div>

      {/* INFOS ENTREPRISE + FACTURE */}
      <div className="max-w-6xl mx-auto mt-8 mb-4 bg-white rounded-xl shadow p-7">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">MYCONFORT</h1>
            <p className="font-semibold">88 Avenue des Ternes</p>
            <p>75017 Paris, France</p>
            <p>SIRET: 824 313 530 00027</p>
            <p>Tél: 04 68 50 41 45</p>
            <p>Email: service_y...@gmail.com</p>
            <p>Site web: https://www.htconfort.com</p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div>
              <span className="font-semibold">Facture n°:</span>{" "}
              <span className="font-mono text-lg text-[#214b10]">2025-866</span>
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              <input
                type="date"
                className="border rounded px-2"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div>
              <span className="font-semibold">Lieu de l'événement:</span>{" "}
              <input
                type="text"
                placeholder="ex: Salon de l'habitat Paris"
                className="border rounded px-2"
                value={lieu}
                onChange={e => setLieu(e.target.value)}
                style={{ minWidth: 160 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* INFOS CLIENT */}
      <div className="max-w-6xl mx-auto bg-[#ecf8e6] rounded-xl shadow p-7 mb-4 border">
        <div className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span> INFORMATIONS CLIENT
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Nom complet*</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.nom}
              onChange={e => setClient({ ...client, nom: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">Adresse*</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.adresse}
              onChange={e => setClient({ ...client, adresse: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">Code postal*</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.cp}
              onChange={e => setClient({ ...client, cp: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">Ville*</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.ville}
              onChange={e => setClient({ ...client, ville: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">Type de logement</label>
            <select
              className="w-full border rounded px-3 py-1"
              value={client.logement}
              onChange={e => setClient({ ...client, logement: e.target.value })}
            >
              <option value="">Sélectionner</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Code porte / étage</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.codeEtage}
              onChange={e => setClient({ ...client, codeEtage: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">Téléphone*</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.tel}
              onChange={e => setClient({ ...client, tel: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">Email*</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.email}
              onChange={e => setClient({ ...client, email: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold">SIRET (si applicable)</label>
            <input
              className="w-full border rounded px-3 py-1"
              value={client.siret}
              onChange={e => setClient({ ...client, siret: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* PRODUITS */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-7 mb-4 border">
        <div className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">🛒</span> AJOUTER UN PRODUIT À LA FACTURE
        </div>
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="font-semibold">Catégorie</label>
            <select
              className="border rounded px-2 py-1"
              value={produit.categorie}
              onChange={e => setProduit({ ...produit, categorie: e.target.value })}
            >
              <option value="">Sélectionner</option>
              {[...new Set(produitsCatalogue.map(p => p.categorie))].map(c =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>
          <div>
            <label className="font-semibold">Produit</label>
            <select
              className="border rounded px-2 py-1"
              value={produit.nom}
              onChange={handleProduitSelect}
              disabled={!produit.categorie}
            >
              <option value="">Sélectionner une catégorie d'abord</option>
              {produitsCatalogue.filter(p => p.categorie === produit.categorie).map(p =>
                <option key={p.nom} value={p.nom}>{p.nom}</option>
              )}
            </select>
          </div>
          <div>
            <label className="font-semibold">Quantité</label>
            <input
              type="number"
              min={1}
              value={produit.quantite}
              onChange={e => setProduit({ ...produit, quantite: Number(e.target.value) })}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <div>
            <label className="font-semibold">Prix unitaire TTC</label>
            <input
              value={produit.prix}
              readOnly
              className="border rounded px-2 py-1 w-24 bg-gray-100"
            />
          </div>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded ml-4"
            onClick={ajouterProduit}
            disabled={!produit.nom}
          >
            + Ajouter
          </button>
        </div>
        {/* Table produits */}
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
                  <td>{p.nom}</td>
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

      {/* REMARQUES / ACCOMPTE / MODES DE RÈGLEMENT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Remarques */}
        <div className="bg-[#f7f5f1] rounded-xl p-4 border">
          <div className="font-bold mb-1">📝 REMARQUES</div>
          <textarea
            className="w-full min-h-[60px] border rounded p-2"
            placeholder="Notes ou remarques sur la facture..."
            value={remarques}
            onChange={e => setRemarques(e.target.value)}
          />
        </div>
        {/* Totaux */}
        <div className="bg-[#e7f7e7] rounded-xl p-4 border">
          <div className="font-bold mb-1">💶 TOTAUX & ACOMPTE</div>
          <div>Total HT : <span className="font-semibold">{totalHT.toFixed(2)} €</span></div>
          <div>TVA (20%) : <span className="font-semibold">{TVA.toFixed(2)} €</span></div>
          <div className="text-lg mt-2">Total TTC : <span className="font-bold text-green-700">{totalTTC.toFixed(2)} €</span></div>
          <div className="mt-2">
            <label>Acompte versé (€) </label>
            <input
              type="number"
              min={0}
              value={acompte}
              onChange={e => setAcompte(Number(e.target.value))}
              className="border rounded px-2 py-1 w-24 ml-2"
            />
          </div>
        </div>
        {/* Paiement */}
        <div className="bg-[#f5f8e7] rounded-xl p-4 border">
          <div className="font-bold mb-1">💳 MODE DE RÈGLEMENT</div>
          <select
            className="w-full border rounded px-2 py-1 mb-2"
            value={modePaiement}
            onChange={e => setModePaiement(e.target.value)}
          >
            <option value="">Sélectionner obligatoirement</option>
            {methodesPaiement.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            className="w-full border rounded px-2 py-1 mb-2"
            placeholder="Nom du conseiller(e)"
            value={conseiller}
            onChange={e => setConseiller(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={cgvOk} onChange={e => setCgvOk(e.target.checked)} />
            <span className="text-sm">J'ai lu et j'accepte les conditions générales de vente *</span>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1">Signature client</div>
            {signature
              ? <div className="border rounded bg-white p-2">{signature} <button className="ml-2 text-red-500" onClick={() => setSignature("")}>Effacer</button></div>
              : <button className="bg-[#d2e897] px-3 py-1 rounded" onClick={() => setShowSignaturePad(true)}>🖊️ Cliquer pour signer électroniquement</button>
            }
            {showSignaturePad && <SignaturePad />}
          </div>
          {/* Champs obligatoires manquants */}
          {(!modePaiement || !cgvOk) &&
            <div className="text-red-600 text-xs mt-2">⚠️ Champs obligatoires manquants : Méthode de paiement et/ou acceptation des CGV</div>
          }
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 pb-10">
        <button className="bg-[#214b10] text-white px-7 py-4 rounded-xl flex-1 text-lg font-bold mr-2 mb-2">💾 ENREGISTRER & UPLOADER</button>
        <button className="bg-[#82b734] text-white px-7 py-4 rounded-xl flex-1 text-lg font-bold mr-2 mb-2">⟳ NOUVELLE FACTURE</button>
      </div>
    </div>
  );
}
