<<<<<<< HEAD
# iReady — Free AI/ML Interview Answer Analyzer

> Practice. Analyze. Improve. — No paid AI API required.

## Features
- 30 curated HR questions across Easy / Medium / Hard difficulty
- 15-minute countdown timer with auto-submit
- NLP analysis: TF-IDF + Cosine Similarity, keyword matching, TextBlob grammar check, length scoring
- Per-question scores, missing keywords, grammar suggestions, model answers
- Readiness level: Beginner → Improving → Interview Ready → Excellent
- Downloadable PDF report (ReportLab)
- React 18 + Tailwind CSS frontend · Flask backend

## How AI/ML Analysis Works (No Paid API)
- TF-IDF Vectorization + Cosine Similarity (scikit-learn) → 40%
- Keyword Coverage matching (NLTK) → 25%
- Grammar & Spelling (TextBlob) → 20%
- Answer Length scoring → 15%

### Requirements: Python 3.9+, Node.js 18+

### Step 1 — Backend
```
cd backend
pip install -r requirements.txt
python -m textblob.download_corpora
python app.py
```
Backend runs at http://localhost:5000

### Step 2 — Frontend (new terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173
=======
# iReady
iReady is a free interview preparation platform built with NLP and machine learning. It evaluates HR interview answers using TF-IDF cosine similarity, grammar correction, and keyword analysis delivering instant feedback and downloadable PDF reports.
>>>>>>> c5670cb0c23e70ebea553ee9c005548ad9661e41
