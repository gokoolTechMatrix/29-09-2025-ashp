import React from 'react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: { name: string; sku: string; quantity: number; reorderLevel?: number }[];
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, title, items }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
        <div className="max-h-80 overflow-y-auto">
          <table className="min-w-full bg-white text-gray-900">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Item Name</th>
                <th className="py-2 px-4 border-b text-left">SKU</th>
                <th className="py-2 px-4 border-b text-left">Quantity</th>
                {title === 'Items Below Reorder Level' && <th className="py-2 px-4 border-b text-left">Reorder Level</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.sku}</td>
                  <td className="py-2 px-4 border-b text-red-600">{item.quantity}</td>
                  {title === 'Items Below Reorder Level' && <td className="py-2 px-4 border-b">{item.reorderLevel}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;