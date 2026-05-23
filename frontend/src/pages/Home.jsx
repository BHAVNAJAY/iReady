import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import robotImg from "../assets/robot.png";
import bgVid from "../assets/bgvid.mp4";

const features = [
  { title: "10 HR Interview Questions",
    desc: "Carefully curated questions across Easy, Medium, and Hard difficulty levels covering all major HR interview topics." },
  { title: "15-Minute Countdown Timer",
    desc: "Practice under real interview conditions with an automatic timer that submits your answers when time expires." },
  { title: "NLP Answer Analysis",
    desc: "TF-IDF vectorization and cosine similarity measure how closely your answers align with professional model answers." },
  { title: "Grammar Correction",
    desc: "TextBlob detects spelling and grammar errors and provides specific word-level correction suggestions for every answer." },
  { title: "Keyword Matching",
    desc: "Checks whether your answer includes the key concepts and terminology expected by professional interviewers." },
  { title: "Similarity Score",
    desc: "Quantifies how well your answer matches the model answer using advanced NLP techniques powered by scikit-learn." },
  { title: "Downloadable PDF Report",
    desc: "Export a complete performance report with all scores, model answers, corrections, and improvement suggestions." },
];

const steps = [
  { n: "01", title: "Select Difficulty",
    desc: "Choose Easy, Medium, or Hard based on your experience and the level of role you are preparing for." },
  { n: "02", title: "Answer Questions",
    desc: "Type detailed answers to 10 HR interview questions within the 15-minute countdown timer." },
  { n: "03", title: "Get NLP Feedback",
    desc: "Receive instant analysis with similarity scores, keyword gaps, grammar corrections, and model answers." },
  { n: "04", title: "Download Report",
    desc: "Save your complete performance report as a PDF to review and track improvement over time." },
];

const levels = [
  {
    level: "easy", title: "Easy",
    color: "#059669", bg: "#ECFDF5", border: "#6EE7B7",
    desc: "Basic HR questions on strengths, goals, and motivation. Perfect for beginners getting started.",
    topics: ["Tell me about yourself", "Strengths and Weaknesses", "Career Goals", "Work Motivation"],
  },
  {
    level: "medium", title: "Medium",
    color: "#D97706", bg: "#FFFBEB", border: "#FCD34D",
    desc: "Situational and behavioral STAR-method questions designed for practised candidates.",
    topics: ["Challenges and Achievements", "Teamwork and Leadership", "Handling Failure", "Conflict Resolution"],
  },
  {
    level: "hard", title: "Hard",
    color: "#1D4ED8", bg: "#EFF6FF", border: "#93C5FD",
    desc: "Complex strategic and leadership questions for senior-level interview preparation.",
    topics: ["Ethical Decisions", "Influence Without Authority", "Handling Ambiguity", "Cross-functional Teams"],
  },
];

const S = {
  navLink: {
    background: "none", border: "none", color: "rgba(255,255,255,0.92)",
    fontSize: "15px", fontWeight: "500", cursor: "pointer",
    padding: "8px 16px", borderRadius: "8px", letterSpacing: "0.1px",
  },
  navBtn: {
    background: "white", border: "none", color: "#1D4ED8",
    fontSize: "14px", fontWeight: "700", cursor: "pointer",
    borderRadius: "10px", padding: "10px 22px", marginLeft: "4px",
    letterSpacing: "0.1px",
  },
  cta: {
    background: "#1D4ED8", color: "white", border: "none",
    borderRadius: "12px", padding: "15px 38px",
    fontSize: "16px", fontWeight: "700", cursor: "pointer",
    letterSpacing: "0.2px",
    boxShadow: "0 4px 16px rgba(29,78,216,0.35)",
  },
  sectionHead: {
    textAlign: "center", fontSize: "36px", fontWeight: "900",
    color: "#111827", margin: "0 0 10px", letterSpacing: "-0.8px",
  },
  sectionSub: {
    textAlign: "center", color: "#6B7280", fontSize: "16px",
    margin: "0 0 48px", lineHeight: "1.6",
  },
  stepCircle: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "#EFF6FF", border: "2px solid #93C5FD",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px", fontSize: "15px", fontWeight: "900",
    color: "#1D4ED8",
  },
};

/* ── duplicated for seamless loop ─────────────────────────────────────────── */
const featuresLoop = [...features, ...features];

export default function Home() {
  const navigate    = useNavigate();
  const featuresRef = useRef(null);
  const howRef      = useRef(null);
  const startRef    = useRef(null);
  const trackRef    = useRef(null);

  const scrollTo = (ref) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#111827", background: "white" }}>

      {/* ── Keyframe CSS injected once ──────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .feature-card-item {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.13) !important;
        }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav style={{
        background: "#083b8c", position: "sticky", top: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "64px",
        boxShadow: "0 2px 20px rgba(29,78,216,0.3)",
      }}>
        <span style={{ color: "white", fontSize: "22px", fontWeight: "900", letterSpacing: "-0.5px" }}>
          iReady
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button onClick={() => scrollTo(featuresRef)} style={S.navLink}>Features</button>
          <button onClick={() => scrollTo(howRef)}      style={S.navLink}>How it Works</button>
          <button onClick={() => scrollTo(startRef)}    style={S.navBtn}>Start Learning</button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "80px 48px 60px", minHeight: "580px",
      }}>
        <video autoPlay loop muted playsInline style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
        }}>
          <source src={bgVid} type="video/mp4" />
        </video>

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center",
          gap: "64px", flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 400px" }}>
            <h1 style={{
              fontSize: "clamp(44px,6vw,72px)", fontWeight: "900",
              color: "#083b8c", lineHeight: 1.05,
              letterSpacing: "-2.5px", margin: "0 0 14px",
              textShadow: "0 1px 0 rgba(255,255,255,0.15)",
            }}>
              iReady
            </h1>
            <p style={{
              fontSize: "22px", fontWeight: "700", color: "#000000",
              margin: "0 0 18px", letterSpacing: "-0.3px",
            }}>
              Be confident. Be prepared. Be interview ready.
            </p>
            <p style={{
              fontSize: "17px", color: "#000000", lineHeight: "1.75",
              maxWidth: "500px", margin: "0 0 36px", fontWeight: "400",
            }}>
              Answer 10 HR interview questions and get instant NLP-powered feedback
              on your answers with grammar corrections, keyword analysis,
              similarity scores, and a downloadable PDF report.
            </p>
            <button onClick={() => scrollTo(startRef)}
              style={{ ...S.cta, background: "#083b8c", color: "#FFFFFF" }}>
              Start Learning
            </button>
          </div>

          <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
            <img src={robotImg} alt="AI Interview Assistant"
              style={{ width: "100%", maxWidth: "440px", objectFit: "contain" }} />
          </div>
        </div>
      </section>

      {/* ── FEATURES — infinite horizontal scroll ──────────────────────── */}
      <section ref={featuresRef} style={{ background: "#083b8c", padding: "80px 0 90px" }}>

        {/* Section heading — padded */}
        <div style={{ textAlign: "center", padding: "0 48px", marginBottom: "48px" }}>
          <h2 style={{ ...S.sectionHead, color: "#FFFFFF" }}>Features</h2>
          <p style={{ ...S.sectionSub, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Everything you need to practice and improve your interview skills
          </p>
        </div>

        {/* Fade edges */}
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: "80px", zIndex: 2,
            background: "linear-gradient(to right, #083b8c, transparent)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0,
            width: "80px", zIndex: 2,
            background: "linear-gradient(to left, #083b8c, transparent)",
            pointerEvents: "none",
          }} />

          {/* Scrolling track — overflow hidden wrapper */}
          <div style={{ overflow: "hidden", width: "100%" }}>
            <div
              ref={trackRef}
              className="marquee-track"
              style={{
                display: "flex",
                gap: "20px",
                width: "max-content",
                padding: "8px 0 16px",
              }}
            >
              {featuresLoop.map((f, i) => (
                <div
                  key={i}
                  className="feature-card-item"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    padding: "26px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                    width: "300px",
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    background: "#EFF6FF", display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "14px",
                    fontSize: "12px", fontWeight: "900", color: "#1D4ED8",
                    border: "1px solid #BFDBFE",
                  }}>
                    {String((i % features.length) + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.7", margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section ref={howRef} style={{ background: "white", padding: "80px 48px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={S.sectionHead}>How it Works</h2>
          <p style={S.sectionSub}>Four simple steps to sharpen your interview skills</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
          }}>
            {steps.map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={S.stepCircle}>{s.n}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 10px" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.7", margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── START LEARNING ─────────────────────────────────────────────── */}
      <section ref={startRef} style={{ background: "#083b8c", padding: "80px 48px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ ...S.sectionHead, color: "#FFFFFF" }}>Start Learning</h2>
          <p style={{ ...S.sectionSub, color: "rgba(255,255,255,0.80)" }}>
            Select your difficulty level and begin your interview practice session
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {levels.map(l => (
              <LevelCard key={l.level} level={l} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{
        background: "#111827", padding: "28px 48px",
        textAlign: "center", color: "rgba(255,255,255,0.45)",
        fontSize: "13px", letterSpacing: "0.2px",
      }}>
        iReady — Practice. Analyze. Improve. — Powered by NLP, TF-IDF, TextBlob, and scikit-learn.
      </footer>

    </div>
  );
}

function LevelCard({ level: l, navigate }) {
  const handleMouseOver = e => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
  };
  const handleMouseOut = e => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
  };
  return (
    <div
      onClick={() => navigate("/test", { state: { difficulty: l.level } })}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={{
        background: "white", borderRadius: "16px",
        border: `2px solid ${l.border}`, padding: "28px 24px",
        cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "900", color: l.color, margin: 0 }}>{l.title}</h3>
        <span style={{
          fontSize: "11px", background: l.bg, color: l.color,
          padding: "4px 12px", borderRadius: "100px",
          fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          {l.level}
        </span>
      </div>
      <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.65", margin: "0 0 16px" }}>
        {l.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {l.topics.map(t => (
          <span key={t} style={{
            fontSize: "11px", background: "#F9FAFB",
            border: "1px solid #E5E7EB", color: "#6B7280",
            padding: "3px 10px", borderRadius: "100px",
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}