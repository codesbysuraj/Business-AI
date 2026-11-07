// ── Product Types ─────────────────────────────
export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  category_id?: number;
  category_name?: string;
  business_id: number;
  is_active: boolean;
  image_url?: string;
  stock_quantity?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

// ── Inventory Types ──────────────────────────
export interface InventoryItem {
  id: number;
  product_id: number;
  product_name?: string;
  product_sku?: string;
  quantity: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  last_restocked?: string;
  updated_at?: string;
}

// ── Customer Types ───────────────────────────
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  total_spending: number;
  purchase_count: number;
  avg_order_value: number;
  last_purchase?: string;
  created_at: string;
}

// ── Sale Types ───────────────────────────────
export interface SaleItem {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Sale {
  id: number;
  customer_id?: number;
  customer_name?: string;
  total_amount: number;
  status: string;
  notes?: string;
  items: SaleItem[];
  created_at: string;
}

// ── Dashboard Types ──────────────────────────
export interface DashboardStats {
  today_revenue: number;
  monthly_revenue: number;
  product_count: number;
  customer_count: number;
  inventory_count: number;
  low_stock_count: number;
  total_orders: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// ── AI Types ─────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  tools_called?: string[];
  data?: any;
  timestamp: Date;
}

// ── User Types ───────────────────────────────
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  business_id?: number;
  created_at: string;
}

// ── Document Types ───────────────────────────
export interface Document {
  id: number;
  filename: string;
  original_filename: string;
  doc_type: string;
  file_size?: number;
  chunk_count: number;
  created_at: string;
}

// ── Churn Types ──────────────────────────────
export interface ChurnPrediction {
  customer_name: string;
  risk_score: number;
  risk_level: string;
  reasons: string[];
  recommended_actions: string[];
}
