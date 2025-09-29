"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("Attempting login with:", { email, password });
    try {
      // Implement actual authentication logic here
      if (email === "admin@gmail.com" && password === "admin123") {
        console.log("Login successful. Redirecting to /factory-dashboard");
        router.push("/factory-dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Redirection failed:", err);
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(99, 102, 241, 0.20) 40%, rgba(236, 72, 153, 0.18) 100%), url('/Background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main Login Card */}
      <main className="grid min-h-screen place-items-center px-4">
        <div className={`w-full max-w-md transition-all duration-700 ease-out ${isFormFocused ? 'scale-105' : 'scale-100'}`}>
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-xl opacity-75 animate-pulse" />
            
            {/* Main card */}
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 p-8 border-0">
              {/* Header with Brand */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="h-12 w-12 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 overflow-hidden">
                    <img src="/logo.png" alt="Saihari Papers" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SaihariPapers</h1>
                    <p className="text-xs text-slate-500">Enterprise Resource Planning</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                <p className="text-slate-500 text-sm">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6" onFocus={() => setIsFormFocused(true)} onBlur={() => setIsFormFocused(false)}>
                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-4 text-slate-900 shadow-lg shadow-slate-200/50 outline-none transition-all duration-300 focus:shadow-xl focus:shadow-blue-200/50 focus:scale-[1.02] hover:shadow-lg hover:shadow-slate-300/50 border-0 placeholder:text-slate-400"
                    />
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                    <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-4 text-slate-900 shadow-lg shadow-slate-200/50 outline-none transition-all duration-300 focus:shadow-xl focus:shadow-blue-200/50 focus:scale-[1.02] hover:shadow-lg hover:shadow-slate-300/50 border-0 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 transition-all duration-200 hover:scale-110"
                    >
                      {showPwd ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] focus:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                  By continuing, you agree to our{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}