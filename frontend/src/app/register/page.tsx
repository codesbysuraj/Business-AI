"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", business_name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.register(form);
      setAuth(res.data.user, res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-[#F9F7F4] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">BusinessOS <span className="text-[#FF6A3D]">AI</span></span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#111827] mb-2">Create your account</h1>
          <p className="text-[#6B7280]">Start managing your business with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="card-static p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="input" placeholder="Your name" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Business Name</label>
            <input type="text" value={form.business_name} onChange={(e) => updateField("business_name", e.target.value)} className="input" placeholder="Your Business" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateField("password", e.target.value)} className="input !pr-12" placeholder="Min 6 characters" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Creating..." : "Create Account"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6A3D] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
