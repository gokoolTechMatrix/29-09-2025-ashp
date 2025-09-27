import React, { useState } from 'react';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: { name: string; sku: string; quantity: number; reorderLevel: number };
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ isOpen, onClose, item }) => {
  const [quantityToOrder, setQuantityToOrder] = useState(item ? item.reorderLevel - item.quantity : 0);
  const [supplier, setSupplier] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  if (!isOpen || !item) return null;

  const handleDownload = () => {
    alert('Download PO for ' + item.name);
    // Implement actual download logic here
  };

  const handlePrint = () => {
    alert('Print PO for ' + item.name);
    // Implement actual print logic here
  };

  const handleSubmit = () => {
    // Logic to create PO
    alert(`Creating PO for ${item.name}: Quantity - ${quantityToOrder}, Supplier - ${supplier}, Delivery - ${expectedDeliveryDate}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Create Purchase Order</h2>
        <div className="mb-4 text-gray-900">
          <p><strong>Item Name:</strong> {item.name}</p>
          <p><strong>SKU:</strong> {item.sku}</p>
          <p><strong>Quantity on Hand:</strong> {item.quantity}</p>
          <p><strong>Reorder Level:</strong> {item.reorderLevel}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity to Order:</label>
          <input
            type="number"
            id="quantity"
            value={quantityToOrder}
            onChange={(e) => setQuantityToOrder(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="supplier" className="block text-gray-700 text-sm font-bold mb-2">Supplier:</label>
          <input
            type="text"
            id="supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="deliveryDate" className="block text-gray-700 text-sm font-bold mb-2">Expected Delivery Date:</label>
          <input
            type="date"
            id="deliveryDate"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Print
          </button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Create PO
          </button>
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;