import { useNavigate } from "react-router-dom";
const levels = [
  { level:"easy",  icon:"🌱", title:"Easy",   color:"text-emerald-600", border:"border-emerald-200", bg:"bg-emerald-50",
    desc:"10 basic HR questions about yourself, strengths, goals, and motivation. Perfect for beginners.",
    topics:["Tell me about yourself","Strengths & Weaknesses","Career Goals","What motivates you"] },
  { level:"medium",icon:"🔥", title:"Medium", color:"text-amber-600",   border:"border-amber-200",   bg:"bg-amber-50",
    desc:"Situational and behavioral questions using STAR method. For practised candidates.",
    topics:["Challenges & Achievements","Teamwork & Leadership","Handling Failure","Conflict Resolution"] },
  { level:"hard",  icon:"💎", title:"Hard",   color:"text-indigo-600",  border:"border-indigo-200",  bg:"bg-indigo-50",
    desc:"Complex strategic and leadership questions for senior-level preparation.",
    topics:["Ethical Decisions","Influencing Without Authority","Ambiguity Handling","Cross-functional Teams"] },
];
export default function Difficulty() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <button onClick={() => navigate("/")} className="btn-ghost mb-6">← Back</button>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Select Difficulty Level</h1>
          <p className="text-slate-500 text-sm">10 questions · 15-minute timer · Auto-submits when time ends</p>
        </div>
        <div className="space-y-4">
          {levels.map(l => (
            <div key={l.level}
              onClick={() => navigate("/test", { state: { difficulty: l.level } })}
              className={`card cursor-pointer border-2 hover:-translate-y-1 hover:shadow-md transition-all ${l.border}`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${l.bg} flex items-center justify-center text-2xl shrink-0`}>{l.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className={`text-xl font-black ${l.color}`}>{l.title}</h2>
                    <span className={`badge ${l.bg} ${l.color} text-xs capitalize`}>{l.level}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3 leading-relaxed">{l.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {l.topics.map(t => <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{t}</span>)}
                  </div>
                </div>
                <div className="text-slate-300 text-2xl shrink-0 mt-1">→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
