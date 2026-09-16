'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { productApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'SOLEVA Core',
    category: 'Sneakers',
    gender: 'unisex' as 'men' | 'women' | 'unisex' | 'kids',
    description: '',
    price: 150,
    compareAtPrice: 180,
    stock: 20,
    sku: '',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    sizes: [7, 8, 9, 10, 11],
    colors: [{ name: 'Crimson Ember', hex: '#E63946' }],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({ limit: 50 });
      if (res.data?.data?.products) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'SOLEVA Core',
      category: 'Sneakers',
      gender: 'unisex',
      description: '',
      price: 150,
      compareAtPrice: 180,
      stock: 20,
      sku: `SLV-${Math.floor(1000 + Math.random() * 9000)}`,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      sizes: [7, 8, 9, 10, 11],
      colors: [{ name: 'Black', hex: '#000000' }],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      gender: prod.gender || 'unisex',
      description: prod.description,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || prod.price,
      stock: prod.stock,
      sku: prod.sku,
      images: prod.images,
      sizes: prod.sizes,
      colors: prod.colors,
      isFeatured: prod.isFeatured,
      isNewArrival: prod.isNewArrival,
      isBestSeller: prod.isBestSeller,
      isActive: prod.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain you wish to delete this footwear product?')) return;
    try {
      await productApi.deleteProduct(id);
      showToast({ type: 'info', title: 'Product Deleted', message: 'Footwear removed from catalog.' });
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete product.' });
    }
  };

  const handleToggleActive = async (prod: Product) => {
    try {
      const res = await productApi.updateProduct(prod._id, { isActive: !prod.isActive });
      if (res.data?.data?.product) {
        showToast({
          type: 'success',
          title: 'Status Updated',
          message: `Product is now ${!prod.isActive ? 'Active' : 'Inactive'}`,
        });
        setProducts(products.map((p) => (p._id === prod._id ? res.data.data.product : p)));
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Could not update status.' });
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingProduct) {
        const res = await productApi.updateProduct(editingProduct._id, formData);
        if (res.data?.data?.product) {
          showToast({ type: 'success', title: 'Product Updated', message: 'Changes saved successfully.' });
          setProducts(products.map((p) => (p._id === editingProduct._id ? res.data.data.product : p)));
          setIsModalOpen(false);
        }
      } else {
        const res = await productApi.createProduct(formData);
        if (res.data?.data?.product) {
          showToast({ type: 'success', title: 'Product Created', message: 'New model added to catalog.' });
          setProducts([res.data.data.product, ...products]);
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err.response?.data?.message || 'Failed to save product.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 font-display">
            Footwear Inventory ({products.length})
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-brand-500/25 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name, brand, category, or SKU..."
          className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Badges</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    Loading inventory catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    No products matching &quot;{search}&quot; found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
                          <Image src={prod.images?.[0] || '/products/apexlab/orange_profile.jpg'} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-950 line-clamp-1">{prod.name}</p>
                          <p className="text-[11px] text-brand-600 uppercase font-bold tracking-wider">{prod.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-zinc-900">{prod.category}</td>
                    <td className="py-3.5 px-6">
                      <span className="font-extrabold text-zinc-950">{formatCurrency(prod.price)}</span>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="text-[10px] text-zinc-400 line-through ml-1.5">
                          {formatCurrency(prod.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`font-bold ${
                          prod.stock <= 5 ? 'text-red-600 flex items-center gap-1' : 'text-zinc-800'
                        }`}
                      >
                        {prod.stock <= 5 && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[11px] font-bold text-zinc-600">{prod.sku}</td>
                    <td className="py-3.5 px-6">
                      <div className="flex gap-1 flex-wrap">
                        {prod.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Featured
                          </span>
                        )}
                        {prod.isNewArrival && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            New
                          </span>
                        )}
                        {prod.isBestSeller && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          prod.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-100"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-zinc-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-950">
                {editingProduct ? `Edit Footwear: ${editingProduct.name}` : 'Add New Footwear Model'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Running">Running</option>
                    <option value="Casual">Casual</option>
                    <option value="Sports">Sports</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Basketball">Basketball</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Compare At / Strike Price ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Image URL(s) comma separated *</label>
                <input
                  type="text"
                  required
                  value={formData.images.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value.split(',').map((u) => u.trim()).filter(Boolean),
                    })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900"
                />
              </div>

              {/* Promotional Flags */}
              <div className="pt-2 grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-zinc-800 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brand-500"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-800 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-brand-500"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-800 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-brand-500"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
