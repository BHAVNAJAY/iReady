export default function QuestionCard({ question, index, total, answer, onChange }) {
  const words = answer ? answer.split(/\s+/).filter(Boolean).length : 0;
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="badge gradient-bg text-white text-xs">Q{index + 1} / {total}</span>
        <span className="badge bg-violet-50 text-violet-600 text-xs capitalize">{question.difficulty}</span>
      </div>
      <p className="text-base font-semibold text-slate-800 leading-relaxed mb-5">{question.question}</p>
      <textarea
        className="input h-36 leading-relaxed text-sm"
        placeholder="Type your answer here… (aim for 40-150 words, use specific examples)"
        value={answer || ""}
        onChange={e => onChange(question.id, e.target.value)}
      />
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>{words} words</span>
        <span className={words >= 40 && words <= 150 ? "text-emerald-500 font-semibold" : ""}>
          {words < 40 ? "Too short — aim for 40+" : words > 150 ? "Good length" : "✓ Good length"}
        </span>
      </div>
    </div>
  );
}
