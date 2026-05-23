import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import ResultCard from "../components/ResultCard.jsx";
import { downloadReport } from "../services/api.js";

const LEVELS = {
  "Excellent"       : { color:"text-emerald-600", bg:"bg-emerald-50", border:"border-emerald-200", icon:"🏆" },
  "Interview Ready" : { color:"text-indigo-600",  bg:"bg-indigo-50",  border:"border-indigo-200",  icon:"🎯" },
  "Improving"       : { color:"text-amber-600",   bg:"bg-amber-50",   border:"border-amber-200",   icon:"📈" },
  "Beginner"        : { color:"text-red-500",     bg:"bg-red-50",     border:"border-red-200",     icon:"🌱" },
};

export default function Result() {
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const [dl, setDl]  = useState(false);
  const [err, setErr]= useState("");

  if (!state?.analysisData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card text-center p-8">
        <p className="text-slate-500 mb-4">No results found.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );

  const { analysisData: r, difficulty } = state;
  const lv   = LEVELS[r.readiness_level] || LEVELS["Beginner"];
  const comp = r.component_avgs || {};

  const handleDownload = async () => {
    setDl(true); setErr("");
    try { await downloadReport({ ...r, difficulty }); }
    catch { setErr("PDF download failed. Make sure the Flask backend is running."); }
    finally { setDl(false); }
  };

  const cc = v => v>=8?"text-emerald-600":v>=6?"text-indigo-600":v>=4?"text-amber-500":"text-red-400";
  const cb = v => v>=8?"bg-emerald-500":v>=6?"bg-indigo-500":v>=4?"bg-amber-400":"bg-red-400";

  const Meter = ({ label, val, pct }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className={`font-bold ${cc(val)}`}>{val}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cb(val)}`} style={{ width: `${val*10}%` }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-indigo-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-black text-base text-slate-900">iReady — Results</span>
          <div className="flex gap-2">
            <button onClick={() => navigate("/difficulty")} className="btn-ghost">Practice Again</button>
            <button onClick={() => navigate("/")} className="btn-ghost">Home</button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Score hero */}
        <div className="card hero-bg p-7 mb-6 text-center">
          <div className="text-5xl mb-3">{lv.icon}</div>
          <div className="text-6xl font-black text-indigo-600 leading-none mb-2">
            {r.avg_score}<span className="text-3xl font-bold text-slate-400">/10</span>
          </div>
          <div className="text-base text-slate-500 mb-3">Average Score · Total: {r.total_score}/100</div>
          <span className={`inline-block px-5 py-1.5 rounded-full font-bold border ${lv.bg} ${lv.color} ${lv.border}`}>
            {r.readiness_level}
          </span>
          <div className="grid grid-cols-2 gap-4 mt-6 text-left">
            <Meter label="TF-IDF Similarity (40%)"  val={comp.similarity||0} />
            <Meter label="Keyword Coverage (25%)"   val={comp.keywords||0}   />
            <Meter label="Grammar & Spelling (20%)" val={comp.grammar||0}    />
            <Meter label="Answer Length (15%)"      val={comp.length||0}     />
          </div>
        </div>

        {/* Strengths / Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="card">
            <h3 className="text-sm font-bold text-emerald-600 mb-3">💪 Strengths</h3>
            {(r.strengths||[]).map((s,i) =>
              <div key={i} className="flex gap-2 text-sm text-slate-700 mb-2"><span className="text-emerald-500 shrink-0">✓</span>{s}</div>)}
          </div>
          <div className="card">
            <h3 className="text-sm font-bold text-amber-500 mb-3">📈 Areas to Improve</h3>
            {(r.weaknesses||[]).map((w,i) =>
              <div key={i} className="flex gap-2 text-sm text-slate-700 mb-2"><span className="text-amber-400 shrink-0">→</span>{w}</div>)}
          </div>
        </div>

        {/* PDF Download */}
        <div className="card mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">📄 Download Full PDF Report</h3>
            <p className="text-xs text-slate-400">All questions, answers, model answers, scores, keywords, grammar corrections</p>
          </div>
          <button onClick={handleDownload} disabled={dl} className="btn-primary py-2.5 px-6 text-sm shrink-0">
            {dl ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</> : "⬇ Download PDF"}
          </button>
        </div>
        {err && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-4">{err}</div>}

        {/* Per-question */}
        <h2 className="text-base font-black text-slate-900 mb-4">Question-by-Question Feedback</h2>
        {(r.results||[]).map((res,i) => <ResultCard key={res.question_id||i} result={res} index={i} />)}

        <div className="mt-8 text-center">
          <button onClick={() => navigate("/difficulty")} className="btn-primary mx-auto">🔄 Practice Again</button>
          <p className="text-xs text-slate-400 mt-4">iReady · TF-IDF · TextBlob · scikit-learn · ReportLab</p>
        </div>
      </div>
    </div>
  );
}
