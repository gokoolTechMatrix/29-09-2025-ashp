"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-100 via-white to-white">
      {/* Subtle background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl" />
      </div>



      {/* Centered Card */}
      <main className="grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl ring-1 ring-black/5">
          <img src="/saiharipapers.jpg" alt="Sai Hari ERP Logo" className="mx-auto mb-6 h-24 w-auto" />

          <h1 className="mb-1 text-center text-2xl font-semibold text-slate-900">Sign in with email</h1>
          <p className="mb-8 text-center text-sm text-slate-600">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-sky-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M1.5 6.75A1.5 1.5 0 013 5.25h18a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5V6.75zm2.1-.75l8.4 5.25L20.4 6H3.6z"/></svg>
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="sr-only">Password</label>
                <a href="/forgot-password" className="text-sm font-medium text-slate-600 hover:text-slate-800">Forgot password?</a>
              </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-sky-100"
                />
                <button
                  type="button"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                >
                  {showPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 10-1.06 1.06l18 18a.75.75 0 101.06-1.06l-2.37-2.37A12.07 12.07 0 0021.75 12S18 4.5 12 4.5a9.7 9.7 0 00-4.9 1.36L3.53 2.47zM12 6c4.52 0 7.88 4.05 8.96 6-.42.67-1.03 1.57-1.85 2.47l-2.1-2.1A4.5 4.5 0 0010.63 8.1L8.4 5.86A8.21 8.21 0 0112 6z"/><path d="M14.12 15.23l-5.35-5.35a4.5 4.5 0 005.35 5.35z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 4.5c-6 0-9.75 7.5-9.75 7.5S6 19.5 12 19.5s9.75-7.5 9.75-7.5S18 4.5 12 4.5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Get Started"}
            </button>
          </form>

          {/* No social / sign-up per requirement */}
          <div className="mt-6 text-center text-xs text-slate-500">By continuing you agree to the Terms & Privacy.</div>
        </div>
      </main>
    </div>
  );
}
