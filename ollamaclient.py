import ollama

def ask(question , context):
    system = f"""You are an expert ham radio teacher preparing a student for the ASOC exam.
    Use the following textbook content as your primary source, but explain it clearly 
    in simple terms like a teacher would. Give examples where helpful.
    If something is not covered in the content, say so.

    Textbook content:
    {context}"""
    response = ollama.chat(
        model="llama3",
        messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": question}
                ]
        )

    return response["message"]["content"]

#print(ask("what is impedance?", "impedance is the opposition to current flow in an AC circuit..."))