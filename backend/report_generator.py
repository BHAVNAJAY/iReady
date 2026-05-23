import os, tempfile
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER

INDIGO = colors.HexColor("#4F46E5")
VIOLET = colors.HexColor("#7C3AED")
SLATE  = colors.HexColor("#334155")
MUTED  = colors.HexColor("#64748B")
LIGHT  = colors.HexColor("#EEF2FF")
GREEN  = colors.HexColor("#10B981")
AMBER  = colors.HexColor("#F59E0B")
RED    = colors.HexColor("#EF4444")
BORDER = colors.HexColor("#E0E7FF")

def styles():
    b = getSampleStyleSheet()
    return {
        "title"   : ParagraphStyle("t1", parent=b["Normal"], fontSize=20, fontName="Helvetica-Bold",
                                   textColor=INDIGO, alignment=TA_CENTER, spaceAfter=2),
        "sub"     : ParagraphStyle("t2", parent=b["Normal"], fontSize=11, fontName="Helvetica",
                                   textColor=MUTED,  alignment=TA_CENTER, spaceAfter=6),
        "section" : ParagraphStyle("t3", parent=b["Normal"], fontSize=12, fontName="Helvetica-Bold",
                                   textColor=VIOLET, spaceBefore=8, spaceAfter=4),
        "body"    : ParagraphStyle("t4", parent=b["Normal"], fontSize=10, fontName="Helvetica",
                                   textColor=SLATE, leading=14, spaceAfter=3),
        "bold"    : ParagraphStyle("t5", parent=b["Normal"], fontSize=10, fontName="Helvetica-Bold",
                                   textColor=SLATE, leading=14, spaceAfter=3),
        "small"   : ParagraphStyle("t6", parent=b["Normal"], fontSize=9,  fontName="Helvetica",
                                   textColor=MUTED, leading=12, spaceAfter=2),
        "qhead"   : ParagraphStyle("t7", parent=b["Normal"], fontSize=11, fontName="Helvetica-Bold",
                                   textColor=INDIGO, spaceBefore=6, spaceAfter=3),
    }

def sc_color(s):
    if s >= 8: return GREEN
    if s >= 6: return INDIGO
    if s >= 4: return AMBER
    return RED

def generate_pdf(data):
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", prefix="iready_")
    tmp.close()
    doc = SimpleDocTemplate(tmp.name, pagesize=A4,
                            rightMargin=2.2*cm, leftMargin=2.2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    S = styles()
    el = []

    el.append(Paragraph("iReady Lite", S["title"]))
    el.append(Paragraph("Interview Practice Report", S["sub"]))
    el.append(HRFlowable(width="100%", thickness=2, color=INDIGO))
    el.append(Spacer(1, 0.3*cm))

    diff  = data.get("difficulty", "").title()
    total = data.get("total_score", 0)
    avg   = data.get("avg_score", 0)
    level = data.get("readiness_level", "")
    date  = datetime.now().strftime("%B %d, %Y  |  %I:%M %p")

    rows = [["Date", date], ["Difficulty", diff], ["Total Score", f"{total} / 100"],
            ["Average Score", f"{avg} / 10"], ["Readiness Level", level]]
    tbl = Table(rows, colWidths=[4*cm, 11.5*cm])
    tbl.setStyle(TableStyle([
        ("FONTNAME",       (0,0),(0,-1), "Helvetica-Bold"),
        ("FONTNAME",       (1,0),(1,-1), "Helvetica"),
        ("FONTSIZE",       (0,0),(-1,-1), 10),
        ("TEXTCOLOR",      (0,0),(0,-1), INDIGO),
        ("TEXTCOLOR",      (1,0),(1,-1), SLATE),
        ("ROWBACKGROUNDS", (0,0),(-1,-1), [LIGHT, colors.white]),
        ("GRID",           (0,0),(-1,-1), 0.5, BORDER),
        ("PADDING",        (0,0),(-1,-1), 7),
    ]))
    el.append(tbl)
    el.append(Spacer(1, 0.4*cm))

    comp = data.get("component_avgs", {})
    if comp:
        el.append(Paragraph("Scoring Breakdown", S["section"]))
        crow = [["Component", "Score / 10", "Weight"],
                ["TF-IDF Similarity",   f"{comp.get("similarity","-")}", "40%"],
                ["Keyword Coverage",    f"{comp.get("keywords","-")}",   "25%"],
                ["Grammar & Spelling",  f"{comp.get("grammar","-")}",    "20%"],
                ["Answer Length",       f"{comp.get("length","-")}",     "15%"]]
        ct = Table(crow, colWidths=[7*cm, 5*cm, 3.5*cm])
        ct.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,0), INDIGO),
            ("TEXTCOLOR",     (0,0),(-1,0), colors.white),
            ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
            ("FONTNAME",      (0,1),(-1,-1),"Helvetica"),
            ("FONTSIZE",      (0,0),(-1,-1), 9),
            ("ROWBACKGROUNDS",(0,1),(-1,-1), [colors.white, LIGHT]),
            ("GRID",          (0,0),(-1,-1), 0.5, BORDER),
            ("ALIGN",         (1,0),(-1,-1), "CENTER"),
            ("PADDING",       (0,0),(-1,-1), 6),
        ]))
        el.append(ct)
        el.append(Spacer(1, 0.3*cm))

    el.append(Paragraph("Overall Assessment", S["section"]))
    for s in data.get("strengths", []):
        el.append(Paragraph(f"  &nbsp; ✓  {s}", S["body"]))
    el.append(Spacer(1, 0.1*cm))
    for w in data.get("weaknesses", []):
        el.append(Paragraph(f"  &nbsp; →  {w}", S["body"]))
    el.append(Spacer(1, 0.3*cm))

    el.append(HRFlowable(width="100%", thickness=1, color=BORDER))
    el.append(Paragraph("Question-by-Question Breakdown", S["section"]))

    for i, r in enumerate(data.get("results", [])):
        score = r.get("score", 0)
        el.append(Paragraph(f"Q{i+1}. {r.get("question","")}", S["qhead"]))
        el.append(Paragraph(f"Score: {score} / 10", ParagraphStyle(
            "sc", parent=S["bold"], textColor=sc_color(score))))
        ua = r.get("user_answer","") or "(no answer provided)"
        el.append(Paragraph(f"<b>Your Answer:</b> {ua}",          S["body"]))
        el.append(Paragraph(f"<b>Model Answer:</b> {r.get("model_answer","")}",S["body"]))
        mk = r.get("missing_keywords",[])
        if mk:
            el.append(Paragraph(f"<b>Missing Keywords:</b> {', '.join(mk)}", S["small"]))
        gs = r.get("grammar_suggestions",[])
        if gs:
            el.append(Paragraph(f"<b>Grammar:</b> {'; '.join(gs)}", S["small"]))
        fb = r.get("feedback","")
        if fb:
            el.append(Paragraph(f"<i>{fb}</i>", S["small"]))
        el.append(HRFlowable(width="80%", thickness=0.5, color=BORDER, spaceAfter=4))

    el.append(Spacer(1, 0.5*cm))
    el.append(Paragraph("Generated by iReady Lite — Practice. Analyze. Improve.", S["small"]))
    doc.build(el)
    return tmp.name
