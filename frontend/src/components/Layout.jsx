import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard",        label: "🏠 Dashboard" },
  { to: "/sections",         label: "📖 Modules" },
  { to: "/simulations",      label: "🎯 Simulations & Scenarios" },
  { to: "/threat-library",   label: "🛡 Threat Library" },
  { to: "/attempts-history", label: "📋 Attempts History" },
  { to: "/leaderboard",      label: "🏆 Leaderboard" },
  { to: "/certificate",      label: "🎓 Certificate" },
  { to: "/faq",              label: "❓ FAQ" },
  { to: "/admin-builder",    label: "⚙️ Admin Panel" },
];

function MatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 13;
    const chars    = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01{}[]<>/\\|#$%&@!?=+-*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

    let cols  = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) drops = Array(cols).fill(1);

      for (let i = 0; i < drops.length; i++) {
        const char       = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random();

        if      (brightness > 0.95) ctx.fillStyle = "#ffffff";
        else if (brightness > 0.70) ctx.fillStyle = "#67e8f9";
        else                        ctx.fillStyle = "#0e7490";

        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        opacity: 0.22, pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  const visibleNav = navItems.filter((item) => {
    if (item.to === "/admin-builder") return isAdmin;
    return true;
  });

  return (
    <>
      <MatrixCanvas />

      <div
        className="min-h-screen text-white"
        style={{ position: "relative", zIndex: 1, background: "rgba(2, 6, 23, 0.82)" }}
      >
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside
            className="w-72 border-r border-slate-800 flex flex-col"
            style={{ background: "rgba(15, 23, 42, 0.92)", position: "relative", zIndex: 2 }}
          >
            {/* Logo */}
            <div className="border-b border-slate-800 px-5 py-6">
              <div className="text-2xl font-bold text-cyan-300">Computer Fundamentals</div>
              <div className="text-lg font-semibold text-cyan-500" style={{ marginTop: "2px" }}>& Security</div>
              <div className="mt-2 text-sm text-slate-400">Training & simulation platform</div>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
              {visibleNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "block rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User card */}
            <div className="p-4 border-t border-slate-800">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="text-sm text-slate-300 truncate">
                  {user?.email || "Signed in"}
                </div>
                <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                  <span>Role: {user?.role || "user"}</span>
                  {isAdmin && (
                    <span style={{
                      padding: "1px 7px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                      background: "#1c1400", border: "1px solid #422006", color: "#fbbf24",
                    }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1" style={{ position: "relative", zIndex: 1 }}>
            <header
              className="border-b border-slate-800 px-8 py-6"
              style={{ background: "rgba(2, 6, 23, 0.80)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-4xl font-bold text-white">{title}</div>
              <div className="mt-2 text-sm text-slate-400">
                Training only. Never enter real passwords or sensitive data.
              </div>
            </header>

            <div className="p-8">{children}</div>
          </main>

        </div>
      </div>
    </>
  );
}
