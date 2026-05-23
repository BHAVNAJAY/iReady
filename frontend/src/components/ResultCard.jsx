import { useState } from "react";
const scColor = s => s>=8?"text-emerald-600":s>=6?"text-indigo-600":s>=4?"text-amber-500":"text-red-500";
const scBg    = s => s>=8?"bg-emerald-50 border-emerald-200":s>=6?"bg-indigo-50 border-indigo-200":s>=4?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200";
export default function ResultCard({ result, index }) {
  const [open, setOpen] = useState(false);
  const s = result.score;
  return (
    <div className="card mb-3">
      <div onClick={() => setOpen(o => !o)} className="flex items-start gap-3 cursor-pointer">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border shrink-0 ${scBg(s)}`}>
          <span className={scColor(s)}>{s}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug mb-2">Q{index+1}. {result.question}</p>
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-indigo-50 text-indigo-600">Similarity {result.similarity_score}/10</span>
            <span className="badge bg-violet-50 text-violet-600">Keywords {result.keyword_score}/10</span>
            <span className="badge bg-slate-100 text-slate-500">Grammar {result.grammar_score}/10</span>
          </div>
        </div>
        <span className={`text-slate-400 text-lg shrink-0 transition-transform ${open?"rotate-180":""}`}>⌄</span>
      </div>
      {open && (
        <div className="mt-4 pt-4 border-t border-indigo-50 space-y-3 text-sm">
          {result.user_answer
            ? <div><p className="text-xs font-bold text-slate-400 mb-1">Your Answer:</p>
                <div className="bg-slate-50 rounded-lg p-3 text-slate-700 leading-relaxed">{result.user_answer}</div></div>
            : <div className="bg-red-50 rounded-lg p-3 text-red-400">No answer provided.</div>
          }
          <div>
            <p className="text-xs font-bold text-emerald-600 mb-1">Model Answer:</p>
            <div className="bg-emerald-50 rounded-lg p-3 text-slate-700 leading-relaxed">{result.model_answer}</div>
          </div>
          {result.missing_keywords?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-amber-500 mb-1.5">Missing Keywords:</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_keywords.map(kw =>
                  <span key={kw} className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">{kw}</span>)}
              </div>
            </div>
          )}
          {result.present_keywords?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-emerald-600 mb-1.5">Keywords Used:</p>
              <div className="flex flex-wrap gap-1.5">
                {result.present_keywords.map(kw =>
                  <span key={kw} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">{kw}</span>)}
              </div>
            </div>
          )}
          {result.grammar_suggestions?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-400 mb-1">Spelling/Grammar Suggestions:</p>
              {result.grammar_suggestions.map((g,i) =>
                <div key={i} className="text-xs text-slate-600 pl-3 border-l-2 border-red-300 mb-1">{g}</div>)}
            </div>
          )}
          {result.feedback &&
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-slate-700 text-xs leading-relaxed italic">
              💡 {result.feedback}
            </div>}
        </div>
      )}
    </div>
  );
}
