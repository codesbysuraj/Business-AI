"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  Package,
  Users,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  MessageSquare,
  Target,
  LineChart,
  UserX,
  Network,
} from "lucide-react";

// ── Animation Variants ────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── AI Visualization Component ────────────────
function AIVisualization() {
  const nodes = [
    { x: 50, y: 30, label: "Intent", delay: 0 },
    { x: 20, y: 60, label: "Inventory", delay: 0.5 },
    { x: 40, y: 70, label: "Sales", delay: 1 },
    { x: 60, y: 70, label: "Customer", delay: 1.5 },
    { x: 80, y: 60, label: "Forecast", delay: 2 },
    { x: 50, y: 90, label: "Response", delay: 2.5 },
  ];

  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A3D]/5 via-transparent to-[#3B82F6]/5 rounded-[32px]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-[#FF6A3D]/10 to-transparent blur-3xl"
        style={{ top: "10%", left: "20%" }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-[#3B82F6]/10 to-transparent blur-3xl"
        style={{ bottom: "20%", right: "15%" }}
        animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6A3D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Connect nodes */}
        <motion.line x1="50" y1="30" x2="20" y2="60" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.3 }} />
        <motion.line x1="50" y1="30" x2="40" y2="70" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
        <motion.line x1="50" y1="30" x2="60" y2="70" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.7 }} />
        <motion.line x1="50" y1="30" x2="80" y2="60" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.9 }} />
        <motion.line x1="20" y1="60" x2="50" y2="90" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.2 }} />
        <motion.line x1="40" y1="70" x2="50" y2="90" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.4 }} />
        <motion.line x1="60" y1="70" x2="50" y2="90" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.6 }} />
        <motion.line x1="80" y1="60" x2="50" y2="90" stroke="url(#lineGrad)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.8 }} />
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: node.delay * 0.3 + 0.5 }}
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg flex flex-col items-center justify-center gap-1"
            whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(255,106,61,0.2)" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-[#111827]">{node.label}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Feature Card ──────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div variants={fadeUp} className="card p-6 md:p-8 group cursor-default">
      <div
        className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-[#111827] mb-2">{title}</h3>
      <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── AI Module Card ────────────────────────────
function AIModuleCard({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: any;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      className="relative card p-6 md:p-8 overflow-hidden group cursor-default"
    >
      <div className="absolute top-0 right-0 px-3 py-1 bg-[#FF6A3D]/10 text-[#FF6A3D] text-xs font-semibold rounded-bl-xl">
        {badge}
      </div>
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#111827] to-[#374151] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-[#111827] mb-2">{title}</h3>
      <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Main Landing Page ─────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F9F7F4] overflow-x-hidden">
      {/* ── Navbar ─────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#111827]">BusinessOS <span className="text-[#FF6A3D]">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Features</a>
            <a href="#ai-modules" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">AI Modules</a>
            <a href="#workflow" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Workflow</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm !py-2.5 !px-5">Sign In</Link>
            <Link href="/register" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A3D]/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#FF6A3D]" />
              <span className="text-sm font-semibold text-[#FF6A3D]">AI-Powered Business Intelligence</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-[#111827] leading-[1.1] tracking-tight mb-6">
              Business Intelligence,{" "}
              <span className="gradient-text">Powered by AI.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-[#6B7280] leading-relaxed mb-10 max-w-lg">
              One AI Operating System to manage inventory, analyze sales, predict business growth, and automate daily operations.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary text-base !py-3.5 !px-8">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-base !py-3.5 !px-8">
                Watch Demo <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white" />
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-[#111827]">500+ businesses</div>
                <div className="text-xs text-[#6B7280]">trust BusinessOS AI</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <AIVisualization />
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────── */}
      <section id="features" className="py-20 md:py-32 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827]/5 rounded-full mb-4">
              <Zap className="w-4 h-4 text-[#111827]" />
              <span className="text-sm font-semibold text-[#111827]">Core Features</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4">
              Everything your business needs
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              A complete suite of tools to manage, analyze, and grow your business with AI-powered insights.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={BarChart3} title="Smart Dashboard" description="Real-time overview of revenue, orders, inventory, and customer analytics with interactive charts." gradient="bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B]" />
            <FeatureCard icon={Package} title="Inventory Management" description="Track stock levels, get low-stock alerts, manage categories, and automate reorder points." gradient="bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]" />
            <FeatureCard icon={Users} title="Customer Intelligence" description="360° customer profiles with purchase history, spending analytics, and behavior tracking." gradient="bg-gradient-to-br from-[#10B981] to-[#34D399]" />
            <FeatureCard icon={TrendingUp} title="Sales Analytics" description="Track daily, weekly, monthly revenue with trend analysis and performance metrics." gradient="bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]" />
            <FeatureCard icon={FileText} title="Document Intelligence" description="Upload business documents and query them with natural language using RAG technology." gradient="bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]" />
            <FeatureCard icon={Shield} title="AI-Powered Security" description="Smart anomaly detection, fraud alerts, and automated business health monitoring." gradient="bg-gradient-to-br from-[#EF4444] to-[#F87171]" />
          </motion.div>
        </div>
      </section>

      {/* ── AI Modules ─────────────────────── */}
      <section id="ai-modules" className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A3D]/10 rounded-full mb-4">
              <Brain className="w-4 h-4 text-[#FF6A3D]" />
              <span className="text-sm font-semibold text-[#FF6A3D]">AI Modules</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4">
              Four AI modules. One platform.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Advanced AI capabilities built on LangGraph, RAG, and Machine Learning for intelligent business operations.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid md:grid-cols-2 gap-6">
            <AIModuleCard icon={MessageSquare} title="AI Chat Assistant" description="Ask questions in natural language. Get answers grounded in your real business data — not hallucinations." badge="LangGraph" />
            <AIModuleCard icon={FileText} title="RAG Document Q&A" description="Upload policies, invoices, catalogs. Ask questions and get answers retrieved from your actual documents." badge="FAISS + Embeddings" />
            <AIModuleCard icon={LineChart} title="Sales Forecasting" description="Predict next week and next month sales with trend analysis, confidence scores, and visual projections." badge="Scikit-learn" />
            <AIModuleCard icon={UserX} title="Churn Prediction" description="Identify customers at risk of leaving with ML-powered risk scores, reasons, and retention strategies." badge="ML Pipeline" />
          </motion.div>
        </div>
      </section>

      {/* ── LangGraph Workflow ─────────────── */}
      <section id="workflow" className="py-20 md:py-32 px-6 bg-[#111827]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <Network className="w-4 h-4 text-[#FF6A3D]" />
              <span className="text-sm font-semibold text-white/80">Under the Hood</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              LangGraph Multi-Agent Workflow
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-white/60 max-w-2xl mx-auto">
              Your query flows through an intelligent graph of specialized AI agents, each with access to real business tools.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-4">
            {[
              { icon: MessageSquare, label: "User Query", desc: "Natural language question from the business owner" },
              { icon: Brain, label: "Intent Detection", desc: "LangGraph classifies intent and routes to the right agent" },
              { icon: Target, label: "Agent Selection", desc: "Inventory · Sales · Customer · Document · Marketing · Forecast" },
              { icon: Zap, label: "Tool Calling", desc: "Agent calls real database tools — no fake data or hallucination" },
              { icon: Sparkles, label: "LLM Reasoning", desc: "Gemini generates a natural language response from real data" },
              { icon: Bot, label: "Final Response", desc: "Formatted, actionable answer delivered to the user" },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base">{step.label}</h4>
                  <p className="text-white/50 text-sm">{step.desc}</p>
                </div>
                {i < 5 && <ChevronRight className="w-5 h-5 text-white/30 hidden md:block" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section className="py-20 md:py-32 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold text-[#111827] mb-6">
            Ready to transform your business?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-[#6B7280] mb-10 max-w-2xl mx-auto">
            Join hundreds of small businesses already using AI to grow smarter. Start free today.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg !py-4 !px-10">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer className="py-12 px-6 border-t border-[rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#111827]">BusinessOS AI</span>
          </div>
          <p className="text-sm text-[#6B7280]">© 2025 BusinessOS AI. Built with LangGraph, FastAPI & Next.js.</p>
        </div>
      </footer>
    </main>
  );
}
