export const getQuestions = async (difficulty) => {
  const res = await fetch(`/questions/${difficulty}`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
};
export const analyzeAnswers = async (difficulty, answers) => {
  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ difficulty, answers }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
};
export const downloadReport = async (reportData) => {
  const res = await fetch("/download-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  });
  if (!res.ok) throw new Error("PDF generation failed");
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `iready_lite_report_${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
