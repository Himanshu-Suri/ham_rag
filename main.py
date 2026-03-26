from fastapi import FastAPI
from pydantic import BaseModel
from config import MODULES
from rag import query
from ollamaclient import ask
from test import generate_question
from test import check_answer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/modules")
def get_modules():
    return MODULES

class StudyRequest(BaseModel):
    question: str
    module_id: int

@app.post("/study")
def study(data: StudyRequest):
    context = query(data.question, data.module_id)
    answer = ask(data.question, context)
    return {"answer": answer}

class QuestionRequest(BaseModel):
    module_id: int

@app.post("/exam/question")
def question(data: QuestionRequest):
    result = generate_question(data.module_id)
    return result

class CheckRequest(BaseModel):
    user_answer: str
    correct_answer: str
    explanation: str

@app.post("/exam/check")
def check(data: CheckRequest):
    result = check_answer(data.user_answer, data.correct_answer, data.explanation)
    return result