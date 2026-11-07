"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { dashboardAPI } from "@/lib/api";
import type { DashboardStats, ChartDataPoint, RecentOrder } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const COLORS = ["#FF6A3D", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

// Demo data for when backend isn't available
const DEMO_STATS: DashboardStats = {
  today_revenue: 45280,
  monthly_revenue: 847500,
  product_count: 25,
  customer_count: 15,
  inventory_count: 1247,
  low_stock_count: 4,
  total_orders: 342,
};

const DEMO_CHART: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
  revenue: 15000 + Math.random() * 30000,
  orders: 5 + Math.floor(Math.random() * 15),
}));

const DEMO_ORDERS: RecentOrder[] = [
  { id: 1, customer_name: "Rahul Sharma", total_amount: 8499, status: "completed", created_at: new Date().toISOString() },
  { id: 2, customer_name: "Priya Patel", total_amount: 4598, status: "completed", created_at: new Date().toISOString() },
  { id: 3, customer_name: "Amit Kumar", total_amount: 12997, status: "completed", created_at: new Date().toISOString() },
  { id: 4, customer_name: "Sneha Reddy", total_amount: 3499, status: "completed", created_at: new Date().toISOString() },
  { id: 5, customer_name: "Vikram Singh", total_amount: 6998, status: "pending", created_at: new Date().toISOString() },
];

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  accent: string;
}) {
  return (
    <motion.div variants={fadeUp} className={`card-static p-6 ${accent}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-[#F9F7F4] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#6B7280]" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
            positive ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
          }`}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-extrabold text-[#111827] mb-1">{value}</p>
      <p className="text-sm text-[#6B7280]">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(DEMO_STATS);
  const [chartData, setChartData] = useState<ChartDataPoint[]>(DEMO_CHART);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(DEMO_ORDERS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes, ordersRes] = await Promise.all([
          dashboardAPI.stats(),
          dashboardAPI.salesChart(30),
          dashboardAPI.recentOrders(5),
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
        setRecentOrders(ordersRes.data);
      } catch {
        // Use demo data
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Home", value: 20 },
    { name: "Health", value: 12 },
    { name: "Sports", value: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#111827]">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Stats Grid */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Today's Revenue" value={`₹${stats.today_revenue.toLocaleString()}`} change="+12.5%" positive accent="stat-accent-orange" />
        <StatCard icon={TrendingUp} label="Monthly Revenue" value={`₹${stats.monthly_revenue.toLocaleString()}`} change="+8.2%" positive accent="stat-accent-green" />
        <StatCard icon={Package} label="Products" value={stats.product_count.toString()} accent="stat-accent-blue" />
        <StatCard icon={Users} label="Customers" value={stats.customer_count.toString()} change="+3" positive accent="stat-accent-yellow" />
      </motion.div>

      {/* Secondary Stats */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.total_orders.toString()} accent="stat-accent-blue" />
        <StatCard icon={Package} label="Inventory Units" value={stats.inventory_count.toLocaleString()} accent="stat-accent-green" />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats.low_stock_count.toString()} change="Action needed" positive={false} accent="stat-accent-red" />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 card-static p-6">
          <h3 className="text-lg font-bold text-[#111827] mb-6">Sales Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6A3D" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF6A3D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF6A3D" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-static p-6">
          <h3 className="text-lg font-bold text-[#111827] mb-6">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-[#6B7280]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#111827]">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-static p-6">
        <h3 className="text-lg font-bold text-[#111827] mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)]">
                <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider pb-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider pb-3">Customer</th>
                <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider pb-3">Amount</th>
                <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F9F7F4]/50 transition-colors">
                  <td className="py-3.5 text-sm font-medium text-[#111827]">#{order.id.toString().padStart(4, "0")}</td>
                  <td className="py-3.5 text-sm text-[#6B7280]">{order.customer_name}</td>
                  <td className="py-3.5 text-sm font-semibold text-[#111827]">₹{order.total_amount.toLocaleString()}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      order.status === "completed"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : order.status === "pending"
                        ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                        : "bg-[#6B7280]/10 text-[#6B7280]"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
