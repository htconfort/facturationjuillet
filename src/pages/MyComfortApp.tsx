import React, { useState } from "react";

// ======================
// Types
// ======================
type Client = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  siret?: string;
  lodgingType?: string;
};

// ======================
// Composant Formulaire Client
// ======================
const ClientForm: React.FC<{
  client: Client;
  onChange: (client: Client) => void;
}> = ({ client, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...client, [name]: value });
  };

  return (
    <form className="grid grid-cols-1 gap-4 bg-white p-6 rounded shadow">
      <input
        type="text"
        name="name"
        value={client.name}
        onChange={handleChange}
        placeholder="Nom complet"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="address"
        value={client.address}
        onChange={handleChange}
        placeholder="Adresse"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="postalCode"
        value={client.postalCode}
        onChange={handleChange}
        placeholder="Code postal"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="city"
        value={client.city}
        onChange={handleChange}
        placeholder="Ville"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="tel"
        name="phone"
        value={client.phone}
        onChange={handleChange}
        placeholder="Téléphone"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="email"
        name="email"
        value={client.email}
        onChange={handleChange}
        placeholder="Email"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="siret"
        value={client.siret || ""}
        onChange={handleChange}
        placeholder="SIRET (optionnel)"
        className="border px-3 py-2 rounded"
      />
      <select
        name="lodgingType"
        value={client.lodgingType || ""}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      >
        <option value="">Type de logement</option>
        <option>Appartement</option>
        <option>Maison</option>
        <option>Studio</option>
        <option>Autre</option>
      </select>
    </form>
  );
};

// ======================
// Page Principale
// ======================
const MyComfortApp: React.FC = () => {
  const [client, setClient] = useState<Client>({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    siret: "",
    lodgingType: "",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Formulaire client</h1>
      <ClientForm client={client} onChange={setClient} />
      {/* Aperçu des valeurs remplies */}
      <pre className="mt-8 bg-gray-100 p-4 rounded">
        {JSON.stringify(client, null, 2)}
      </pre>
    </div>
  );
};

export default MyComfortApp;
