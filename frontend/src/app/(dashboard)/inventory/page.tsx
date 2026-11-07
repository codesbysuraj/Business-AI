"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Warehouse,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { inventoryAPI } from "@/lib/api";
import type { InventoryItem } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DEMO_INVENTORY: InventoryItem[] = [
  { id: 1, product_id: 1, product_name: "Wireless Earbuds Pro", product_sku: "WEB-001", quantity: 45, low_stock_threshold: 20, is_low_stock: false },
  { id: 2, product_id: 2, product_name: "Smart Watch Ultra", product_sku: "SWU-002", quantity: 12, low_stock_threshold: 15, is_low_stock: true },
  { id: 3, product_id: 3, product_name: "Cotton T-Shirt", product_sku: "CTS-006", quantity: 120, low_stock_threshold: 50, is_low_stock: false },
  { id: 4, product_id: 4, product_name: "Air Fryer 5L", product_sku: "AFR-011", quantity: 3, low_stock_threshold: 10, is_low_stock: true },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(DEMO_INVENTORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await inventoryAPI.list();
        if (res.data && res.data.length > 0) {
          setInventory(res.data);
        }
      } catch (e) {
        // Use demo
      }
    };
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(i => {
    const matchesSearch = (i.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (i.product_sku || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = filterLowStock ? (i.quantity <= i.low_stock_threshold) : true;
    return matchesSearch && matchesLowStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Inventory</h1>
          <p className="text-[#6B7280] mt-1">Track stock levels and manage reordering.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`btn-secondary !px-4 !py-2 ${filterLowStock ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' : ''}`}
          >
            <AlertTriangle className="w-4 h-4" /> 
            {filterLowStock ? 'Clear Filter' : 'Low Stock Only'}
          </button>
          <button className="btn-primary !px-6 bg-[#3B82F6] hover:bg-[#2563EB]">
            <RefreshCw className="w-4 h-4" /> Update Stock
          </button>
        </div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="card-static overflow-hidden">
        <div className="p-4 border-b border-[rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#F9F7F4]/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search inventory by product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#3B82F6]/30 focus:ring-2 focus:ring-[#3B82F6]/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F7F4]/80 border-b border-[rgba(0,0,0,0.06)]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Product</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">SKU</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">In Stock</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Threshold</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Status</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)]">
              {filteredInventory.map((item) => {
                const isLow = item.quantity <= item.low_stock_threshold;
                const percent = Math.min(100, Math.max(0, (item.quantity / (item.low_stock_threshold * 3)) * 100));
                
                return (
                  <tr key={item.id} className="hover:bg-[#F9F7F4]/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-[#111827] group-hover:text-[#3B82F6] transition-colors">{item.product_name}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#6B7280] font-mono">{item.product_sku}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-sm font-bold ${isLow ? 'text-[#EF4444]' : 'text-[#111827]'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-[#6B7280]">{item.low_stock_threshold}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          isLow ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#10B981]/10 text-[#10B981]'
                        }`}>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isLow ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
