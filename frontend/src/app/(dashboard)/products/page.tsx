"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Tag,
  DollarSign
} from "lucide-react";
import { productsAPI } from "@/lib/api";
import type { Product, Category } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Demo data fallback
const DEMO_PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Earbuds Pro", sku: "WEB-001", price: 2999, cost: 1500, category_name: "Electronics", business_id: 1, is_active: true, created_at: "", updated_at: "" },
  { id: 2, name: "Smart Watch Ultra", sku: "SWU-002", price: 8499, cost: 4200, category_name: "Electronics", business_id: 1, is_active: true, created_at: "", updated_at: "" },
  { id: 3, name: "Cotton T-Shirt", sku: "CTS-006", price: 599, cost: 200, category_name: "Clothing", business_id: 1, is_active: true, created_at: "", updated_at: "" },
  { id: 4, name: "Air Fryer 5L", sku: "AFR-011", price: 5999, cost: 2800, category_name: "Home & Kitchen", business_id: 1, is_active: true, created_at: "", updated_at: "" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.list();
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch (e) {
        // use demo
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Products</h1>
          <p className="text-[#6B7280] mt-1">Manage your product catalog and pricing.</p>
        </div>
        <button className="btn-primary !px-6">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="card-static overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#F9F7F4]/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF6A3D]/30 focus:ring-2 focus:ring-[#FF6A3D]/10 transition-all"
            />
          </div>
          <button className="btn-secondary !py-2.5">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F7F4]/80 border-b border-[rgba(0,0,0,0.06)]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Product Details</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">SKU</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Category</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Price</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Cost</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#F9F7F4]/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex items-center justify-center shrink-0 border border-[rgba(0,0,0,0.05)]">
                        <Package className="w-5 h-5 text-[#9CA3AF]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827] group-hover:text-[#FF6A3D] transition-colors">{product.name}</p>
                        <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${product.is_active ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6B7280] font-mono">{product.sku}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                      <Tag className="w-3.5 h-3.5" />
                      {product.category_name || "Uncategorized"}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-[#111827]">₹{product.price.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#6B7280]">₹{product.cost.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
