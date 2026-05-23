export default function Timer({ timeLeft }) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const warn = timeLeft < 120;
  const crit = timeLeft < 60;
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg border
      ${crit  ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
              : warn ? "bg-amber-50 border-amber-200 text-amber-600"
                     : "bg-indigo-50 border-indigo-100 text-indigo-600"}`}>
      ⏱ {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
    </div>
  );
}
