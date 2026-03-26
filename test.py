import ollama
from rag import query
import json
from config import MODULES
import re

def generate_question(module_id):
    module = next(m for m in MODULES if m["id"] == module_id)
    topics = module["topics"][0]
    context = query(topics, module_id)
    system = f"""
        You are a ham radio exam question generator.
        Generate one multiple choice question based on the textbook content below.
        Respond ONLY in JSON format with keys: question, options (A B C D), correct, explanation.
        Do not add any text outside the JSON.
        The explanation field must not be empty.
        Textbook content:
{context}
    """
    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": "Generate one MCQ question from this content."}
        ]
    )

    raw = response["message"]["content"]
    raw = response["message"]["content"]
    print("=== RAW ===")
    print(raw)
    print("=== END ===")

    raw = re.sub(r"'([^']*)'(\s*:)", r'"\1"\2', raw)  # fix 'key': patterns
    raw = re.sub(r":\s*'([^']*)'", r': "\1"', raw)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end != 0:
            return json.loads(raw[start:end])
        raise

def check_answer(user_answer, correct_answer, explanation):
    correct = user_answer.upper() == correct_answer.upper()
    if correct:
        return {"correct": True, "message": f"Correct! {explanation}"}
    else:
        return {"correct": False, "message": f"Wrong. The correct answer is {correct_answer}. {explanation}"}

