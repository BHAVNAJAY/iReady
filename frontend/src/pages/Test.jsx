import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Timer from "../components/Timer.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import { getQuestions, analyzeAnswers } from "../services/api.js";

export default function Test() {
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const difficulty = state?.difficulty || "easy";
  const [questions,  setQuestions]  = useState([]);
  const [answers,    setAnswers]    = useState({});
  const [currentQ,   setCurrentQ]   = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(15 * 60);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const answersRef   = useRef({});
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!difficulty) { navigate("/difficulty"); return; }
    getQuestions(difficulty)
      .then(qs => { setQuestions(qs); setLoading(false); })
      .catch(() => { setError("Failed to load questions. Is the Flask backend running on port 5000?"); setLoading(false); });
  }, [difficulty]);

  useEffect(() => {
    if (loading || submitting) return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (!submittedRef.current) { submittedRef.current = true; doSubmit(answersRef.current); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loading, submitting]);

  const setAnswer = (qid, val) => {
    const updated = { ...answersRef.current, [String(qid)]: val };
    answersRef.current = updated;
    setAnswers({ ...updated });
  };

  const doSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const data = await analyzeAnswers(difficulty, finalAnswers);
      navigate("/result", { state: { analysisData: data, difficulty } });
    } catch {
      setError("Analysis failed. Make sure the Flask backend is running on port 5000.");
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (submittedRef.current || submitting) return;
    submittedRef.current = true;
    doSubmit(answersRef.current);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading questions…</p>
      </div>
    </div>
  );

  if (submitting) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
      <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-4xl" style={{animation:"pulse 2s infinite"}}>🤖</div>
      <h2 className="text-2xl font-black text-slate-900">Analysing Your Answers</h2>
      <p className="text-slate-500 text-sm max-w-xs text-center">Running TF-IDF similarity, keyword detection, and grammar checks…</p>
      <div className="w-64 h-1.5 bg-indigo-100 rounded-full overflow-hidden relative">
        <div className="absolute top-0 h-full w-2/5 gradient-bg rounded-full"
             style={{animation:"shimmer 1.8s infinite",position:"absolute"}} />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card text-center p-8 max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-bold text-red-600 mb-2">Connection Error</h2>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button onClick={() => navigate("/")} className="btn-primary mx-auto">Go Back Home</button>
      </div>
    </div>
  );

  const q        = questions[currentQ];
  const answered = Object.keys(answers).filter(k => answers[k]?.trim()).length;
  const total    = questions.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="bg-white border-b border-indigo-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <span className="font-black text-base text-slate-900">iReady</span>
            <span className="ml-2 text-xs text-slate-400 capitalize">— {difficulty}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{answered}/{total} answered</span>
            <Timer timeLeft={timeLeft} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="h-1.5 bg-indigo-100 rounded-full mb-6">
          <div className="h-full gradient-bg rounded-full transition-all"
               style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
        </div>

        {q && <QuestionCard question={q} index={currentQ} total={total}
                            answer={answers[q.id]} onChange={setAnswer} />}

        <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
          <button onClick={() => setCurrentQ(i => Math.max(0, i - 1))}
            disabled={currentQ === 0} className="btn-ghost disabled:opacity-40">← Previous</button>

          <div className="flex gap-1.5 flex-wrap justify-center">
            {questions.map((_, i) => {
              const done = !!(answers[questions[i]?.id]?.trim());
              return (
                <button key={i} onClick={() => setCurrentQ(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all
                    ${i===currentQ ? "gradient-bg text-white border-transparent"
                      : done ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                             : "bg-white border-indigo-100 text-slate-400 hover:bg-indigo-50"}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          {currentQ < total - 1
            ? <button onClick={() => setCurrentQ(i => Math.min(total-1, i+1))}
                className="btn-primary py-2 px-5 text-sm">Next →</button>
            : <button onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl px-5 py-2 text-sm hover:brightness-110 transition-all">
                Submit Test ✓
              </button>
          }
        </div>

        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-slate-500 text-center">
          💡 Aim for 40–150 words per answer · Use specific examples · Include relevant keywords
        </div>
      </div>
    </div>
  );
}
