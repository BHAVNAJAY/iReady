import os, json
from flask import Flask, jsonify, request, send_file, after_this_request
from flask_cors import CORS

import nltk
for _pkg in ["punkt","punkt_tab","brown","averaged_perceptron_tagger",
             "averaged_perceptron_tagger_eng","wordnet","stopwords"]:
    try:
        nltk.download(_pkg, quiet=True)
    except Exception:
        pass
try:
    from textblob import TextBlob
    TextBlob("startup").correct()
except Exception:
    pass

from analyzer import analyze_answers
from report_generator import generate_pdf

app = Flask(__name__)
# NEW — allows all origins (you can restrict later)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, "questions.json"), "r") as f:
    ALL_QUESTIONS = json.load(f)

@app.route("/health")
def health():
    return jsonify({"status": "ok", "message": "iReady Lite backend running"})

@app.route("/questions/<difficulty>")
def get_questions(difficulty):
    qs = [q for q in ALL_QUESTIONS if q["difficulty"] == difficulty.lower()][:10]
    if not qs:
        return jsonify({"error": f"No questions for difficulty: {difficulty}"}), 404
    safe = [{"id": q["id"], "question": q["question"], "difficulty": q["difficulty"]} for q in qs]
    return jsonify(safe)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    difficulty   = data.get("difficulty", "medium").lower()
    user_answers = data.get("answers", {})
    questions = [q for q in ALL_QUESTIONS if q["difficulty"] == difficulty][:10]
    if not questions:
        return jsonify({"error": "Invalid difficulty"}), 400
    result = analyze_answers(questions, user_answers)
    return jsonify(result)

@app.route("/download-report", methods=["POST"])
def download_report():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    pdf_path = generate_pdf(data)
    @after_this_request
    def cleanup(response):
        try:
            os.unlink(pdf_path)
        except Exception:
            pass
        return response
    return send_file(pdf_path, as_attachment=True,
                     download_name="iready_lite_report.pdf",
                     mimetype="application/pdf")

if __name__ == "__main__":
    print("iReady Lite backend starting on http://localhost:5000")
    app.run(debug=True, port=5000)
