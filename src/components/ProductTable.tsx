import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import { InvoiceItem } from '../utils/data';

interface ProductTableProps {
  items: InvoiceItem[];
  onEditItem: (item: InvoiceItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  items,
  onEditItem,
  onDeleteItem
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2">📦</div>
        <p className="text-gray-500">Aucun produit ajouté</p>
        <p className="text-sm text-gray-400">Utilisez le formulaire ci-dessus pour ajouter des produits</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Produits et services</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Description</th>
              <th className="px-6 py-3 text-center font-semibold w-24">Qté</th>
              <th className="px-6 py-3 text-right font-semibold w-32">Prix unitaire</th>
              <th className="px-6 py-3 text-right font-semibold w-32">Total HT</th>
              <th className="px-6 py-3 text-center font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr 
                key={item.id} 
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition-colors`}
              >
                <td className="px-6 py-4 text-gray-800">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-center text-gray-800">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-right text-gray-800">
                  {item.unitPrice.toFixed(2)} €
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">
                  {item.total.toFixed(2)} €
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};