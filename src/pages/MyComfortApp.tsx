import React, { useState } from "react";

// Types
interface ClientInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

// Formulaire Client
const ClientForm: React.FC<{
  client: ClientInfo;
  onChange: (client: ClientInfo) => void;
}> = ({ client, onChange }) => (
  <div style={{ background: "#F2EFE2", borderRadius: 12, padding: 24, marginBottom: 24 }}>
    <h2 style={{ fontWeight: "bold", marginBottom: 12, color: "#477A0C" }}>Informations client</h2>
    <div style={{ display: "grid", gap: 12 }}>
      <input
        type="text"
        placeholder="Nom complet"
        value={client.name}
        onChange={e => onChange({ ...client, name: e.target.value })}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #B9D871" }}
      />
      <input
        type="text"
        placeholder="Adresse"
        value={client.address}
        onChange={e => onChange({ ...client, address: e.target.value })}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #B9D871" }}
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={client.phone}
        onChange={e => onChange({ ...client, phone: e.target.value })}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #B9D871" }}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={client.email}
        onChange={e => onChange({ ...client, email: e.target.value })}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #B9D871" }}
      />
    </div>
  </div>
);

// Page principale
const MyComfortApp: React.FC = () => {
  const [client, setClient] = useState<ClientInfo>({
    name: "",
    address: "",
    phone: "",
    email: ""
  });

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#477A0C", marginBottom: 24 }}>
        Formulaire de Facture - MyConfort
      </h1>
      <ClientForm client={client} onChange={setClient} />
      <pre style={{
        background: "#F2EFE2",
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
        fontSize: 14,
        color: "#333",
        fontFamily: "monospace"
      }}>
        {JSON.stringify(client, null, 2)}
      </pre>
    </div>
  );
};

export default MyComfortApp;
