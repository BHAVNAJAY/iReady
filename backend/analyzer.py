from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
import re

WEIGHT_SIMILARITY = 0.40
WEIGHT_KEYWORDS   = 0.25
WEIGHT_GRAMMAR    = 0.20
WEIGHT_LENGTH     = 0.15

def compute_tfidf_similarity(answer, model_answer):
    if not answer.strip():
        return 0.0
    try:
        vec   = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        tfidf = vec.fit_transform([answer.lower(), model_answer.lower()])
        sim   = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return round(min(1.0, float(sim) * 1.4), 4)
    except Exception:
        return 0.0

def check_keyword_coverage(answer, keywords):
    if not keywords:
        return 1.0, [], []
    answer_lower = answer.lower()
    present = [kw for kw in keywords if kw.lower() in answer_lower]
    missing = [kw for kw in keywords if kw.lower() not in answer_lower]
    return round(len(present) / len(keywords), 4), present, missing

def check_grammar_spelling(text):
    if not text.strip():
        return 0.0, []
    try:
        blob      = TextBlob(text)
        corrected = str(blob.correct())
        suggestions = []
        for orig, corr in zip(text.split(), corrected.split()):
            o = re.sub(r"[^\w]", "", orig).lower()
            c = re.sub(r"[^\w]", "", corr).lower()
            if o and c and o != c:
                suggestions.append(f'"{orig}" should be "{corr}"')
        suggestions = suggestions[:6]
        error_rate  = len(suggestions) / max(len(text.split()), 1)
        score       = max(0.2, 1.0 - error_rate * 1.5)
        return round(score, 4), suggestions
    except Exception:
        return 0.8, []

def check_length_quality(text):
    words = len(text.split()) if text.strip() else 0
    if words == 0:   return 0.0
    if words < 10:   return 0.15
    if words < 25:   return 0.45
    if words < 40:   return 0.70
    if words <= 150: return 1.00
    if words <= 250: return 0.85
    return 0.70

def generate_feedback(result):
    parts = []
    sc = result["score"]
    if sc >= 8:   parts.append("Excellent answer — strong understanding demonstrated.")
    elif sc >= 6: parts.append("Good answer with clear communication.")
    elif sc >= 4: parts.append("Decent attempt — more depth and specific examples would strengthen this.")
    else:         parts.append("This answer needs significant improvement.")
    if result["missing_keywords"]:
        parts.append(f'Include these key concepts: {", ".join(result["missing_keywords"][:4])}.')
    if result["similarity_score"] < 5:
        parts.append("Review the model answer — your response diverges from the expected direction.")
    if result["grammar_suggestions"]:
        parts.append("A few spelling or grammar corrections are suggested below.")
    if result["length_score"] < 5:
        parts.append("Try to provide a more detailed answer (aim for 40-150 words).")
    return " ".join(parts)

def analyze_single(question, user_answer):
    model_answer = question["model_answer"]
    keywords     = question.get("keywords", [])
    sim_score               = compute_tfidf_similarity(user_answer, model_answer)
    kw_score, present, miss = check_keyword_coverage(user_answer, keywords)
    gram_score, gram_sug    = check_grammar_spelling(user_answer)
    len_score               = check_length_quality(user_answer)
    weighted    = (sim_score * WEIGHT_SIMILARITY + kw_score * WEIGHT_KEYWORDS +
                   gram_score * WEIGHT_GRAMMAR + len_score * WEIGHT_LENGTH)
    final_score = round(weighted * 10, 1)
    result = {
        "question_id"        : question["id"],
        "question"           : question["question"],
        "user_answer"        : user_answer,
        "model_answer"       : model_answer,
        "score"              : final_score,
        "similarity_score"   : round(sim_score  * 10, 1),
        "keyword_score"      : round(kw_score   * 10, 1),
        "grammar_score"      : round(gram_score * 10, 1),
        "length_score"       : round(len_score  * 10, 1),
        "present_keywords"   : present,
        "missing_keywords"   : miss,
        "grammar_suggestions": gram_sug,
    }
    result["feedback"] = generate_feedback(result)
    return result

def analyze_answers(questions, user_answers):
    results = [analyze_single(q, user_answers.get(str(q["id"]), "").strip()) for q in questions]
    scores  = [r["score"] for r in results]
    total   = round(sum(scores), 1)
    avg     = round(total / len(scores), 1) if scores else 0.0
    if avg >= 8.5:   level = "Excellent"
    elif avg >= 7.0: level = "Interview Ready"
    elif avg >= 4.0: level = "Improving"
    else:            level = "Beginner"
    avg_sim  = round(sum(r["similarity_score"] for r in results) / len(results), 1)
    avg_kw   = round(sum(r["keyword_score"]    for r in results) / len(results), 1)
    avg_gram = round(sum(r["grammar_score"]    for r in results) / len(results), 1)
    avg_len  = round(sum(r["length_score"]     for r in results) / len(results), 1)
    strengths, weaknesses = [], []
    if avg_sim  >= 6: strengths.append("Strong conceptual alignment with expected answers")
    if avg_gram >= 7: strengths.append("Good grammar and professional language")
    if avg_kw   >= 6: strengths.append("Effective use of relevant keywords and terminology")
    if avg_len  >= 7: strengths.append("Well-structured answers with appropriate depth")
    if avg_sim  < 5:  weaknesses.append("Answers diverge from professional standards — review model answers")
    if avg_gram < 6:  weaknesses.append("Grammar and spelling need improvement")
    if avg_kw   < 5:  weaknesses.append("Include more role-relevant keywords in your answers")
    if avg_len  < 5:  weaknesses.append("Answers are too brief — provide more context and examples")
    if not strengths:  strengths.append("Completed the full interview — a strong first step")
    if not weaknesses: weaknesses.append("Keep practising to maintain consistency")
    return {
        "results"        : results,
        "total_score"    : total,
        "avg_score"      : avg,
        "readiness_level": level,
        "strengths"      : strengths,
        "weaknesses"     : weaknesses,
        "component_avgs" : {"similarity": avg_sim, "keywords": avg_kw,
                            "grammar": avg_gram, "length": avg_len},
    }
