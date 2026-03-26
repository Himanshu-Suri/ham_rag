import pymupdf
import chromadb
from config import MODULES
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

def extract_text(pdf_path , start_page , end_page):
    doc = pymupdf.open(pdf_path)
    out =""
    for i in range(start_page-1 , end_page-1):
        page = doc[i]
        text = page.get_text()
        out = out + text


    return  out


#print(extract_text("/home/himanshu/Desktop/random shithousery/nanogpt/ham-AI/Study-Manual.pdf", 13, 18))

def chunk_text(text , chunks_size = 1000 , overlap=100):
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunks_size
        chunks.append(text[start:end])
        start += chunks_size - overlap
    return chunks

def ingest_pdf(pdf_path):
    client = chromadb.PersistentClient(path="./db")

    embedding_fn = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    collection = client.get_or_create_collection("hamradio", embedding_function=embedding_fn)

    for module in MODULES:
        text = extract_text(pdf_path , module["pages"][0], module["pages"][1])
        chunks = chunk_text(text)

        for i , chunk in enumerate(chunks):
            collection.add(
                documents = [chunk],
                ids = [f"module_{module['id']}_chunk_{i}"],
                metadatas=[{
                "module_id": module["id"],
                "title": module["title"],
                "level": module["level"]
            }]
            )

        print(f"Ingested module {module['id']} - {module['title']}")


def query(question , module_id , n_results =3 ):
    client = chromadb.PersistentClient(path="./db")
    embedding_fn = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    collections = client.get_or_create_collection("hamradio", embedding_function=embedding_fn)
    results = collections.query(
        query_texts = [question],
        n_results = n_results,
        where={"module_id": module_id}
    )

    return " ".join(results["documents"][0])


#query("what is impedance", 5)
#ingest_pdf("/home/himanshu/Desktop/random shithousery/nanogpt/ham-AI/Study-Manual.pdf")