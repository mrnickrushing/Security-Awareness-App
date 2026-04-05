import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { setUser }  = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    if (sessionId && location.pathname.includes("success")) {
      setVerifying(true);
      fetch(`/api/stripe/verify-session?session_id=${sessionId}`, {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) {
            setUser(data.user);
            navigate("/dashboard");
          } else {
            setError(data.error || "Payment verification failed.");
            setVerifying(false);
          }
        })
        .catch(() => {
          setError("Something went wrong verifying your payment.");
          setVerifying(false);
        });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError("Could not connect to payment system.");
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-white text-lg">Verifying your payment, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Join CyberCore Academy — one time $10.00 access fee
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Redirecting to payment..." : "Continue to Payment — $10.00"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-300 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
