'use client';

import React, { useState } from 'react';
import InventoryModal from '../../components/InventoryModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import PurchaseOrderModal from '../../components/PurchaseOrderModal';

const InventoryManagementDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poModalItem, setPoModalItem] = useState<any>(null);

  const openPoModal = (item: any) => {
    setPoModalItem(item);
    setIsPoModalOpen(true);
  };

  const closePoModal = () => {
    setIsPoModalOpen(false);
    setPoModalItem(null);
  };

  const itemsBelowReorderLevel = [
    { name: 'A4 Paper Ream', sku: 'PAP-A4-500', quantity: 10, reorderLevel: 50 },
    { name: 'Legal Pad', sku: 'PAD-LEG-100', quantity: 5, reorderLevel: 20 },
    { name: 'Stapler', sku: 'STL-STD-001', quantity: 8, reorderLevel: 15 },
    { name: 'Ballpoint Pen', sku: 'PEN-BAL-BLK', quantity: 15, reorderLevel: 30 },
    { name: 'Notebook (A5)', sku: 'NOT-A5-LIN', quantity: 20, reorderLevel: 40 },
    { name: 'Highlighter (Yellow)', sku: 'HLT-YEL-001', quantity: 7, reorderLevel: 10 },
  ];

  const outOfStockItems = [
    { name: 'Correction Fluid', sku: 'COR-FLU-001', quantity: 0 },
    { name: 'Gel Pen Blue', sku: 'PEN-GEL-BLU', quantity: 0 },
  ];

  const openModal = (title: string, items: any[]) => {
    setModalTitle(title);
    setModalItems(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalItems([]);
  };

   const data = [
     { name: 'Paper Bundles', value: 500 },
     { name: 'Notebooks', value: 450 },
     { name: 'Cardboard', value: 300 },
     { name: 'Exam Papers', value: 250 },
     { name: 'Other Stationery', value: 100 },
   ];

   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

   return (
     <div className="p-6 bg-white">
       <h1 className="text-2xl font-bold mb-6 text-gray-900">Inventory Management Dashboard</h1>

       {/* Header Section */}
       <div className="mb-6 flex justify-between items-center">
         <div className="flex space-x-4">
           {/* Global Filters: Date Range Selector, Warehouse Selector */}
           <input type="date" className="p-2 border rounded text-gray-900" />
           <div className="p-2 border rounded text-gray-900">Warehouse A</div>
         </div>
         <div className="flex space-x-4">
           {/* Quick Action Buttons: Add New Item, Log Inward Stock, Log Outward Stock, Export to Excel */}
           <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">➕ Add New Item</button>
           <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">⬆️ Log Inward Stock</button>
           <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">⬇️ Log Outward Stock</button>
           <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">📄 Export to Excel</button>
         </div>
       </div>

       {/* KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-blue-100 p-4 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold text-gray-700">Total Inventory Value</h3>
           <p className="text-3xl font-bold text-gray-900">₹2,57,000</p>
         </div>
         <div className="bg-yellow-100 p-4 rounded-lg shadow-md cursor-pointer" onClick={() => openModal('Items Below Reorder Level', itemsBelowReorderLevel)}>
           <h3 className="text-lg font-semibold text-gray-700">Items Below Reorder Level</h3>
           <p className="text-3xl font-bold text-red-600">{itemsBelowReorderLevel.length} Items <span className="text-red-600">⚠️</span></p>
         </div>
         <div className="bg-red-100 p-4 rounded-lg shadow-md cursor-pointer" onClick={() => openModal('Out of Stock Items', outOfStockItems)}>
           <h3 className="text-lg font-semibold text-gray-700">Out of Stock Items</h3>
           <p className="text-3xl font-bold text-red-600">{outOfStockItems.length} Items</p>
         </div>
         <div className="bg-purple-100 p-4 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold text-gray-700">Days Sales of Inventory (DSI)</h3>
           <p className="text-3xl font-bold text-gray-900">45 Days</p>
         </div>
       </div>

       {/* Main Content Area */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Left Column */}
         <div className="lg:col-span-2">
           <div className="bg-white p-4 rounded-lg shadow-md">
             <h3 className="text-lg font-semibold mb-4 text-gray-900">Low Stock Alerts</h3>
             <table className="min-w-full bg-white text-gray-900">
               <thead>
                 <tr>
                   <th className="py-2 px-4 border-b text-left">Item Name</th>
                   <th className="py-2 px-4 border-b text-left">SKU</th>
                   <th className="py-2 px-4 border-b text-left">Quantity on Hand</th>
                   <th className="py-2 px-4 border-b text-left">Reorder Level</th>
                   <th className="py-2 px-4 border-b text-left">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {itemsBelowReorderLevel.map((item, index) => (
                   <tr key={index}>
                     <td className="py-2 px-4 border-b">{item.name}</td>
                     <td className="py-2 px-4 border-b">{item.sku}</td>
                     <td className="py-2 px-4 border-b text-red-600">{item.quantity}</td>
                     <td className="py-2 px-4 border-b">{item.reorderLevel}</td>
                     <td className="py-2 px-4 border-b">
                       <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700" onClick={() => openPoModal(item)}>Create PO</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>

         {/* Right Column */}
         <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-4 rounded-lg shadow-md">
             <h3 className="text-lg font-semibold mb-4 text-gray-900">Inventory by Category</h3>
             <div className="flex items-center justify-center h-96 bg-gray-100 rounded-md">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={data}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     fill="#8884d8"
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {data.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                   <Legend />
                 </PieChart>
               </ResponsiveContainer>
             </div>
           </div>
         </div>
       </div>

       {/* Bottom Section */}
       <div className="bg-white p-4 rounded-lg shadow-md">
         <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Stock Movements</h3>
         <table className="min-w-full bg-white text-gray-900">
           <thead>
             <tr>
               <th className="py-2 px-4 border-b text-left">Date/Time</th>
               <th className="py-2 px-4 border-b text-left">Item Name</th>
               <th className="py-2 px-4 border-b text-left">Type</th>
               <th className="py-2 px-4 border-b text-left">Quantity</th>
               <th className="py-2 px-4 border-b text-left">User</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="py-2 px-4 border-b">2025-09-09 10:30 AM</td>
               <td className="py-2 px-4 border-b">A4 Paper Ream</td>
               <td className="py-2 px-4 border-b text-green-600">IN</td>
               <td className="py-2 px-4 border-b">100</td>
               <td className="py-2 px-4 border-b">Roger Curtis</td>
             </tr>
             <tr>
               <td className="py-2 px-4 border-b">2025-09-08 02:15 PM</td>
               <td className="py-2 px-4 border-b">Legal Pad</td>
               <td className="py-2 px-4 border-b text-red-600">OUT</td>
               <td className="py-2 px-4 border-b">20</td>
               <td className="py-2 px-4 border-b">Bala</td>
             </tr>
             <tr>
               <td className="py-2 px-4 border-b">2025-09-07 09:00 AM</td>
               <td className="py-2 px-4 border-b">Stapler</td>
               <td className="py-2 px-4 border-b text-green-600">IN</td>
               <td className="py-2 px-4 border-b">50</td>
               <td className="py-2 px-4 border-b">Raj</td>
             </tr>
             <tr>
               <td className="py-2 px-4 border-b">2025-09-06 04:30 PM</td>
               <td className="py-2 px-4 border-b">Ballpoint Pen</td>
               <td className="py-2 px-4 border-b text-red-600">OUT</td>
               <td className="py-2 px-4 border-b">30</td>
               <td className="py-2 px-4 border-b">Kamal</td>
             </tr>
             <tr>
               <td className="py-2 px-4 border-b">2025-09-05 11:45 AM</td>
               <td className="py-2 px-4 border-b">Notebook (A5)</td>
               <td className="py-2 px-4 border-b text-green-600">IN</td>
               <td className="py-2 px-4 border-b">75</td>
               <td className="py-2 px-4 border-b">Arun</td>
             </tr>
           </tbody>
         </table>
       </div>
       <InventoryModal
         isOpen={isModalOpen}
         onClose={closeModal}
         title={modalTitle}
         items={modalItems}
       />
       {isPoModalOpen && poModalItem && (
         <PurchaseOrderModal
           isOpen={isPoModalOpen}
           onClose={closePoModal}
           item={poModalItem}
         />
       )}
     </div>
   );
};

export default InventoryManagementDashboard;