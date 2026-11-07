"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      setAuth(res.data.user, res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F7F4] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">BusinessOS <span className="text-[#FF6A3D]">AI</span></span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#111827] mb-2">Welcome back</h1>
          <p className="text-[#6B7280]">Sign in to your business dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-static p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@businessos.ai"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input !pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-5 h-5" />
          </button>

          <div className="text-center text-sm text-[#6B7280]">
            Demo: <code className="text-[#FF6A3D] font-mono text-xs">admin@businessos.ai</code> / <code className="text-[#FF6A3D] font-mono text-xs">admin123</code>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#FF6A3D] font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </main>
  );
}
