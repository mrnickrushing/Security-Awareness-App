import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 24;

function HexGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width  / (GRID_SIZE * 1.75)) + 2;
      const rows = Math.ceil(canvas.height / (GRID_SIZE * 1.5))  + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GRID_SIZE * 1.75 + (r % 2 === 0 ? 0 : GRID_SIZE * 0.875);
          const y = r * GRID_SIZE * 1.5;
          const dist = Math.sqrt(
            Math.pow(x - canvas.width  * 0.5, 2) +
            Math.pow(y - canvas.height * 0.5, 2)
          );
          const pulse = Math.sin(t * 0.012 - dist * 0.008) * 0.5 + 0.5;
          const alpha = pulse * 0.18 + 0.03;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + GRID_SIZE * 0.9 * Math.cos(angle);
            const py = y + GRID_SIZE * 0.9 * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(0, 255, 200, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          if (pulse > 0.85 && Math.random() > 0.997) {
            ctx.fillStyle = `rgba(0, 255, 200, 0.6)`;
            ctx.fill();
          }
        }
      }
      t++;
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6,
      }}
    />
  );
}

const features = [
  {
    icon: "🛡️",
    title: "11 Training Sections",
    desc: "From phishing and malware to cloud security, AI threats, and identity protection — every major domain covered.",
  },
  {
    icon: "🎯",
    title: "Live Simulations",
    desc: "Face real world attack scenarios. Make decisions. See the consequences. Learn by doing, not just reading.",
  },
  {
    icon: "🏆",
    title: "XP and Certificates",
    desc: "Earn XP, level up your rank, and collect section certificates as proof of what you know.",
  },
  {
    icon: "📊",
    title: "Leaderboard",
    desc: "Compete with others, track your streak, and see where you rank against the whole platform.",
  },
  {
    icon: "🔐",
    title: "Password and Identity",
    desc: "Master password hygiene, MFA, single sign on, and how to lock down your digital identity for good.",
  },
  {
    icon: "🤖",
    title: "AI and Deepfake Threats",
    desc: "Understand how AI is being weaponized — deepfakes, synthetic voice, automated phishing — and how to spot it.",
  },
];

const sections = [
  "Security Awareness",
  "Computer Troubleshooting",
  "Anti Hacking Defense",
  "Network Fundamentals",
  "Safe Internet Habits",
  "Device Security",
  "Privacy Protection",
  "Cloud Security",
  "Incident Response",
  "AI and Deepfake Threats",
  "Password and Identity",
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000a0f 0%, #001a14 50%, #000d1a 100%)",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      color: "#e2ffe9",
      overflowX: "hidden",
      position: "relative",
    }}>
      <HexGrid />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* NAV */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 3rem",
          borderBottom: "1px solid rgba(0,255,180,0.1)",
          backdropFilter: "blur(10px)",
          background: "rgba(0,10,15,0.6)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 36, height: 36,
              border: "2px solid #00ffb4",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 0 12px rgba(0,255,180,0.4)",
            }}>⬡</div>
            <span style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#00ffb4",
              textShadow: "0 0 20px rgba(0,255,180,0.5)",
            }}>CYBERCORE ACADEMY</span>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,255,180,0.4)",
                color: "#00ffb4",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
              onMouseOver={e => {
                e.target.style.background = "rgba(0,255,180,0.1)";
                e.target.style.boxShadow = "0 0 16px rgba(0,255,180,0.3)";
              }}
              onMouseOut={e => {
                e.target.style.background = "transparent";
                e.target.style.boxShadow = "none";
              }}
            >LOGIN</button>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "linear-gradient(135deg, #00ffb4, #00c896)",
                border: "none",
                color: "#000d1a",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                boxShadow: "0 0 20px rgba(0,255,180,0.4)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => e.target.style.boxShadow = "0 0 32px rgba(0,255,180,0.7)"}
              onMouseOut={e => e.target.style.boxShadow = "0 0 20px rgba(0,255,180,0.4)"}
            >ENROLL — $10</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 2rem",
          position: "relative",
        }}>
          <div style={{
            display: "inline-block",
            border: "1px solid rgba(0,255,180,0.3)",
            borderRadius: 100,
            padding: "0.4rem 1.2rem",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "#00ffb4",
            marginBottom: "2rem",
            background: "rgba(0,255,180,0.05)",
            animation: "fadeUp 0.8s ease both",
          }}>
            ◆ PROFESSIONAL CYBERSECURITY TRAINING PLATFORM
          </div>

          <h1 style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
            animation: "fadeUp 0.8s ease 0.1s both",
            fontFamily: "'Courier New', monospace",
          }}>
            <span style={{ color: "#ffffff" }}>DEFEND.</span>{" "}
            <span style={{ color: "#00ffb4", textShadow: "0 0 40px rgba(0,255,180,0.6)" }}>DETECT.</span>{" "}
            <span style={{ color: "#ffffff" }}>DOMINATE.</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "rgba(226,255,233,0.65)",
            maxWidth: 640,
            lineHeight: 1.7,
            marginBottom: "3rem",
            animation: "fadeUp 0.8s ease 0.2s both",
          }}>
            CyberCore Academy is a hands on security training platform built for
            people who want real knowledge. 11 sections, 77 modules, live attack
            simulations, and certificates that prove you know your stuff.
          </p>

          <div style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.8s ease 0.3s both",
          }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "linear-gradient(135deg, #00ffb4, #00c896)",
                border: "none",
                color: "#000d1a",
                padding: "1rem 2.5rem",
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "1rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                boxShadow: "0 0 40px rgba(0,255,180,0.5), 0 8px 32px rgba(0,0,0,0.4)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => e.target.style.boxShadow = "0 0 60px rgba(0,255,180,0.8), 0 8px 32px rgba(0,0,0,0.4)"}
              onMouseOut={e => e.target.style.boxShadow = "0 0 40px rgba(0,255,180,0.5), 0 8px 32px rgba(0,0,0,0.4)"}
            >START TRAINING — $10 ONE TIME</button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,255,180,0.3)",
                color: "#e2ffe9",
                padding: "1rem 2.5rem",
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "1rem",
                letterSpacing: "0.08em",
                transition: "all 0.2s",
              }}
              onMouseOver={e => e.target.style.background = "rgba(0,255,180,0.06)"}
              onMouseOut={e => e.target.style.background = "transparent"}
            >ALREADY ENROLLED</button>
          </div>

          {/* STATS ROW */}
          <div style={{
            display: "flex",
            gap: "3rem",
            marginTop: "5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.8s ease 0.4s both",
          }}>
            {[
              { num: "11", label: "Training Sections" },
              { num: "77", label: "Modules" },
              { num: "40+", label: "Simulations" },
              { num: "$10", label: "One Time Fee" },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  color: "#00ffb4",
                  textShadow: "0 0 20px rgba(0,255,180,0.5)",
                  letterSpacing: "-0.02em",
                }}>{num}</div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "rgba(226,255,233,0.5)",
                  letterSpacing: "0.1em",
                  marginTop: "0.25rem",
                }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{
          padding: "6rem 2rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ color: "#00ffb4", letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "1rem" }}>
              WHAT YOU GET
            </p>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}>Everything you need to level up</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} style={{
                border: "1px solid rgba(0,255,180,0.12)",
                borderRadius: 16,
                padding: "1.75rem",
                background: "rgba(0,255,180,0.03)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s",
                cursor: "default",
              }}
                onMouseOver={e => {
                  e.currentTarget.style.border = "1px solid rgba(0,255,180,0.4)";
                  e.currentTarget.style.background = "rgba(0,255,180,0.06)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,180,0.1)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.border = "1px solid rgba(0,255,180,0.12)";
                  e.currentTarget.style.background = "rgba(0,255,180,0.03)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{icon}</div>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}>{title}</h3>
                <p style={{
                  fontSize: "0.875rem",
                  color: "rgba(226,255,233,0.55)",
                  lineHeight: 1.7,
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTIONS TICKER */}
        <section style={{
          padding: "3rem 0",
          borderTop: "1px solid rgba(0,255,180,0.08)",
          borderBottom: "1px solid rgba(0,255,180,0.08)",
          overflow: "hidden",
          background: "rgba(0,255,180,0.02)",
        }}>
          <div style={{
            display: "flex",
            gap: "3rem",
            animation: "ticker 25s linear infinite",
            whiteSpace: "nowrap",
          }}>
            {[...sections, ...sections].map((s, i) => (
              <span key={i} style={{
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                color: "rgba(0,255,180,0.6)",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}>
                {s.toUpperCase()}
                <span style={{ color: "rgba(0,255,180,0.25)" }}>◆</span>
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: "8rem 2rem",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(0,255,180,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <p style={{
            color: "#00ffb4",
            letterSpacing: "0.15em",
            fontSize: "0.8rem",
            marginBottom: "1.5rem",
          }}>ONE TIME ACCESS — NO SUBSCRIPTION</p>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}>Ready to get serious<br />about security?</h2>
          <p style={{
            color: "rgba(226,255,233,0.55)",
            fontSize: "1rem",
            marginBottom: "3rem",
            maxWidth: 480,
            margin: "0 auto 3rem",
            lineHeight: 1.7,
          }}>
            Pay once, keep access forever. No monthly fees, no upsells.
            Just real training that makes you dangerous to attackers.
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "linear-gradient(135deg, #00ffb4, #00c896)",
              border: "none",
              color: "#000d1a",
              padding: "1.1rem 3rem",
              borderRadius: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "1.1rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              boxShadow: "0 0 50px rgba(0,255,180,0.5), 0 8px 40px rgba(0,0,0,0.5)",
              transition: "all 0.2s",
            }}
            onMouseOver={e => e.target.style.boxShadow = "0 0 80px rgba(0,255,180,0.8), 0 8px 40px rgba(0,0,0,0.5)"}
            onMouseOut={e => e.target.style.boxShadow = "0 0 50px rgba(0,255,180,0.5), 0 8px 40px rgba(0,0,0,0.5)"}
          >ENROLL NOW FOR $10</button>
        </section>

        {/* FOOTER */}
        <footer style={{
          borderTop: "1px solid rgba(0,255,180,0.08)",
          padding: "2rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <span style={{ color: "rgba(0,255,180,0.5)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
            CYBERCORE ACADEMY
          </span>
          <span style={{ color: "rgba(226,255,233,0.25)", fontSize: "0.75rem" }}>
            © 2026 CyberCore Academy. All rights reserved.
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
      `}</style>
    </div>
  );
}
