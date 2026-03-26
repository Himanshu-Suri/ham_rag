# Ham Radio AI Tutor 

An AI-powered study and exam preparation tool for ASOC (Amateur Station Operator's Certificate).

## Features
- 25 modules covering Restricted and General grade syllabus
- AI-powered study mode with textbook-grounded answers using RAG
- MCQ exam mode with instant feedback and scoring
- Ask follow-up questions on any module
- 100% local and free — no API keys needed

## Tech Stack
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: Ollama + Llama3 (runs locally)
- **Vector DB**: ChromaDB
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2)
- **PDF Parsing**: PyMuPDF

## Architecture
```
User → Next.js frontend → FastAPI backend → Ollama (Llama3)
                                         ↕
                                      ChromaDB (RAG)
                                         ↕
                                   NIAR Study Manual PDF
```

## Project Structure
```
ham-radio-ai/
├── main.py              # FastAPI backend
├── rag.py               # PDF ingestion + ChromaDB querying
├── exam.py              # Question generation + answer checking
├── ollama_client.py     # Ollama API wrapper
├── config.py            # 25 modules mapped from textbook
└── ham-radio-ui/        # Next.js frontend
    └── app/
        ├── page.tsx         # Home — module list
        ├── study/[id]/      # Study mode
        └── exam/[id]/       # Exam mode
```

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama installed

### 1. Clone the repo
```bash
git clone https://github.com/YOURUSERNAME/ham-radio-ai.git
cd ham-radio-ai
```

### 2. Install backend dependencies
```bash
pip install fastapi uvicorn chromadb sentence-transformers pymupdf ollama pydantic
```

### 3. Pull the model
```bash
ollama pull llama3 (i used llama3 but u can use any other model pretty much.)
```

### 4. Add your PDF

Place `Study-Manual.pdf` in the project root.

### 5. Ingest the PDF (only once)
```bash
python rag.py
```

### 6. Start the backend
```bash
uvicorn main:app --reload
```

### 7. Start the frontend
```bash
cd ham-radio-ui
npm install
npm run dev
```

### 8. Open the app

Visit `http://localhost:3000`

## Notes
- The PDF textbook is not included in this repo
- You need to provide your own copy of the NIAR Study Manual
- Always run `python rag.py` first before starting the backend
- Make sure `ollama serve` is running before starting the backend
