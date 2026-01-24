import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Plus, Search, Edit3, Trash2, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";
import { currencyILS } from "../../utils/format";
import { useCatalogManager } from "../../hooks/useCatalogManager";

const CatalogManager: React.FC = () => {
  const {
    products,
    totalCount,
    loading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
    deleteProduct,
  } = useCatalogManager();

  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const categories = ['All', 'Produce', 'Dairy', 'Bakery', 'Meat', 'Pantry'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Catalog Management</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Master Product Index • {totalCount} SKUs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<UploadCloud size={18} />} onClick={() => setIsBulkOpen(true)}>Bulk Import</Button>
          <Button variant="emerald" icon={<Plus size={18} />} onClick={() => setIsCreateOpen(true)}>New Product</Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/30 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              placeholder="Filter by Name, SKU..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:border-[#006666] outline-none" 
            />
          </div>
          <div className="flex gap-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} className={`transition-all hover:text-[#006666] ${activeFilter === cat ? 'text-[#006666]' : ''}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] text-gray-400 uppercase font-black tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Product Information</th>
              <th className="px-6 py-6">Bin Location</th>
              <th className="px-6 py-6">Status</th>
              <th className="px-6 py-6 text-right">Price</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm font-bold">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-gray-300 animate-pulse uppercase tracking-[0.3em]">Syncing Global Index...</td></tr>
            ) : products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={product.imageUrl || 'https://picsum.photos/seed/p/80/80'} className="w-12 h-12 rounded-xl object-cover border" alt="" />
                    <div><p className="text-gray-900 text-lg leading-tight italic">{product.name}</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">SKU: {product.sku}</p></div>
                  </div>
                </td>
                <td className="px-6 py-6"><Badge color="blue">{product.binLocation || 'A-00'}</Badge></td>
                <td className="px-6 py-6"><Badge color={product.availableQuantity > 50 ? 'emerald' : 'orange'}>{product.availableQuantity > 50 ? 'Steady' : 'Low Stock'}</Badge></td>
                <td className="px-6 py-6 text-right font-black italic text-gray-900">{currencyILS(product.price)}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingProduct(product)} className="p-2 border rounded-lg text-gray-400 hover:text-[#006666]"><Edit3 size={16} /></button>
                    <button onClick={() => setDeletingProduct(product)} className="p-2 border rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registry Modals */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Product Enrollment">
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Product published"); setIsCreateOpen(false); }} className="space-y-6 py-4">
          <input required placeholder="Product Name" className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold" />
          <Button fullWidth size="lg" className="rounded-2xl">Enroll Product</Button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deletingProduct} 
        onClose={() => setDeletingProduct(null)} 
        onConfirm={() => { deleteProduct(deletingProduct.id); setDeletingProduct(null); }}
        variant="danger" title="Remove SKU" message={`Confirm removal of ${deletingProduct?.name}?`}
      />
    </div>
  );
};

export default CatalogManager;
