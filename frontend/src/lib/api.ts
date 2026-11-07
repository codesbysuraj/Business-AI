import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("businessos_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("businessos_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────
export const authAPI = {
  register: (data: { email: string; password: string; name: string; business_name: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ── Products ─────────────────────────────────
export const productsAPI = {
  list: (params?: { page?: number; search?: string; category_id?: number }) =>
    api.get("/products/", { params }),
  get: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post("/products/", data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  categories: () => api.get("/products/categories"),
  createCategory: (data: { name: string; description?: string }) =>
    api.post("/products/categories", data),
};

// ── Inventory ────────────────────────────────
export const inventoryAPI = {
  list: (lowStockOnly?: boolean) =>
    api.get("/inventory/", { params: { low_stock_only: lowStockOnly } }),
  updateStock: (productId: number, data: { quantity: number; low_stock_threshold?: number }) =>
    api.put(`/inventory/${productId}`, data),
};

// ── Customers ────────────────────────────────
export const customersAPI = {
  list: (params?: { page?: number; search?: string }) =>
    api.get("/customers/", { params }),
  get: (id: number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post("/customers/", data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// ── Sales ────────────────────────────────────
export const salesAPI = {
  list: (params?: { page?: number }) =>
    api.get("/sales/", { params }),
  create: (data: any) => api.post("/sales/", data),
  revenue: () => api.get("/sales/revenue"),
};

// ── Dashboard ────────────────────────────────
export const dashboardAPI = {
  stats: () => api.get("/dashboard/stats"),
  salesChart: (days?: number) =>
    api.get("/dashboard/charts/sales", { params: { days } }),
  recentOrders: (limit?: number) =>
    api.get("/dashboard/recent-orders", { params: { limit } }),
};

// ── Documents ────────────────────────────────
export const documentsAPI = {
  list: () => api.get("/documents/"),
  upload: (file: File, docType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_type", docType);
    return api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: number) => api.delete(`/documents/${id}`),
};

// ── AI ───────────────────────────────────────
export const aiAPI = {
  chat: (message: string) => api.post("/ai/chat", { message }),
  history: () => api.get("/ai/history"),
};
