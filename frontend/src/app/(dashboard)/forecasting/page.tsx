"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Activity, Target, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FORECAST_DATA = [
  { month: 'Jan', actual: 40000, forecast: 40000 },
  { month: 'Feb', actual: 45000, forecast: 45000 },
  { month: 'Mar', actual: 42000, forecast: 42000 },
  { month: 'Apr', actual: 50000, forecast: 50000 },
  { month: 'May', actual: 55000, forecast: 55000 },
  { month: 'Jun', actual: 53000, forecast: 53000 },
  // Future predictions
  { month: 'Jul', actual: null, forecast: 58000 },
  { month: 'Aug', actual: null, forecast: 62000 },
  { month: 'Sep', actual: null, forecast: 65000 },
];

export default function ForecastingPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#FF6A3D]/10 to-[#3B82F6]/10 rounded-full mb-3">
          <Zap className="w-3.5 h-3.5 text-[#FF6A3D]" />
          <span className="text-xs font-bold text-[#111827]">AI Module</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111827]">Sales Forecasting</h1>
        <p className="text-[#6B7280] mt-1">Machine learning powered predictions based on historical trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-static p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-[#34D399]" />
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">Next Month Projection</p>
          <p className="text-3xl font-extrabold mb-2">₹58,000</p>
          <div className="flex items-center gap-1.5 text-sm text-[#34D399] bg-white/10 w-fit px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" /> +9.4% Growth
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="card-static p-6 border-[#3B82F6]/20 bg-[#3B82F6]/5">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-4">
            <Activity className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <p className="text-[#6B7280] text-sm font-medium mb-1">Model Confidence</p>
          <p className="text-3xl font-extrabold text-[#111827] mb-2">87%</p>
          <p className="text-xs text-[#6B7280]">Based on 6 months historical data</p>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="card-static p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-[#111827]">Revenue Projection Model</h3>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#111827]" /> Actual
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF6A3D]" /> Forecast
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={FORECAST_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${(v/1000)}k`} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              formatter={(val: number) => `₹${val.toLocaleString()}`}
            />
            <Line type="monotone" dataKey="actual" stroke="#111827" strokeWidth={3} dot={{ r: 4, fill: '#111827' }} />
            <Line type="monotone" dataKey="forecast" stroke="#FF6A3D" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#FF6A3D' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
