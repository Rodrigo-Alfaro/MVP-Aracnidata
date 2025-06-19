from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import FAISS as LangchainFAISS
from langchain_huggingface import HuggingFaceEmbeddings
from typing import Dict
import os, json
import numpy as np
import redis
import faiss
from sentence_transformers import SentenceTransformer

# ─────────────────────────────────────────
# API Setup and Redis cache
# ─────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

redis_client = redis.Redis(host="localhost", port=6379, db=0)
embedding_model = SentenceTransformer("all-mpnet-base-v2")
dimension = 768

# ─────────────────────────────────────────
# LangChain Setup
# ─────────────────────────────────────────
vectorstore = LangchainFAISS.load_local(
    os.path.join(os.path.dirname(__file__), "ley_vectorstore"),
    HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"),
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
llm = OllamaLLM(model="mistral:7b")
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, chain_type="stuff")

project_store: Dict[str, dict] = {}

# ─────────────────────────────────────────
# FAISS Semantic Cache globals
# ─────────────────────────────────────────
def load_faiss_and_meta():
    if os.path.exists("semantic_cache.faiss"):
        index = faiss.read_index("semantic_cache.faiss")
        with open("semantic_cache_meta.json", "r") as f:
            meta = json.load(f)
        return index, meta["prompts"], meta["keys"]
    else:
        return faiss.IndexFlatIP(dimension), [], []

def save_faiss_and_meta(index, prompts, keys):
    faiss.write_index(index, "semantic_cache.faiss")
    with open("semantic_cache_meta.json", "w") as f:
        json.dump({"prompts": prompts, "keys": keys}, f)
    print("FAISS index and metadata saved.")

def embed(text: str) -> np.ndarray:
    vec = embedding_model.encode([text])
    vec = np.array(vec).astype("float32")
    faiss.normalize_L2(vec)
    return vec

semantic_index, semantic_prompts, semantic_keys = load_faiss_and_meta()
print(f"[Semantic Cache INIT] Loaded with {semantic_index.ntotal} entries.")

def semantic_cache_lookup(user_message: str, threshold=0.85):
    if semantic_index.ntotal == 0:
        print("[Semantic Cache] Empty index.")
        return None

    vector = embed(user_message)
    print(f"[Semantic Cache] Index size: {semantic_index.ntotal}")
    D, I = semantic_index.search(vector, k=1)
    print(f"[Semantic Cache] Similarity: {D[0][0]:.4f} — User Message: {user_message}")
    if D[0][0] > threshold:
        redis_key = semantic_keys[I[0][0]]
        cached = redis_client.get(redis_key)
        return cached.decode("utf-8") if cached else None
    return None

def semantic_cache_store(user_message: str, answer: str):
    global semantic_index, semantic_prompts, semantic_keys

    key = f"answer:{len(semantic_keys)}"
    vector = embed(user_message)
    semantic_index.add(vector)
    semantic_prompts.append(user_message)
    semantic_keys.append(key)
    redis_client.set(key, answer)

    print(f"[Semantic Cache] Stored new answer under {key}. Total now: {semantic_index.ntotal}")
    save_faiss_and_meta(semantic_index, semantic_prompts, semantic_keys)

# ─────────────────────────────────────────
# Models
# ─────────────────────────────────────────
class Chat(BaseModel):
    message: str

class Project(BaseModel):
    id: str
    description: str

class ChatInput(BaseModel):
    project_id: str
    message: str

class ChatMessage(BaseModel):
    message: str
    user_type: str  # dev or general

# ─────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────
@app.post("/chat")
async def chat(msg: ChatMessage):
    if msg.user_type == "dev":
        prompt = f"""
        Eres un experto en la ley 21.719 de protección de datos de Chile. Responde de manera clara, técnica y detallada para un público con conocimientos 
        en tecnología, como un desarrollador o un estudiante de informatica.
        Pregunta del usuario: {msg.message}
        Responde en español, usando la información de la ley y buenas prácticas.
        """
    else:
        prompt = f"""
        Eres un experto en la ley 21.719 de protección de datos de Chile. Estas respondiendo a alguien sin conocimientos
        técnicos, sé lo más simple y completo posible.
        Pregunta del usuario: {msg.message}
        Responde en español, usando la información de la ley y buenas prácticas.
        """

    cached_answer = semantic_cache_lookup(msg.message)
    if cached_answer:
        print("[Cache HIT]")
        return {"answer": cached_answer}

    print("[Cache MISS]")
    response = qa_chain.invoke({"query": prompt})
    answer = response.get("answer") or response.get("result")

    semantic_cache_store(msg.message, answer)
    print(f"Chat response: {answer}\n")
    return {"answer": answer}

@app.post("/evaluate")
async def evaluate(project: Project):
    prompt = f"""
    Eres un experto en la ley 21.719 de protección de datos de Chile. Tienes que evaluar el siguiente proyecto:
    {project.description}

    Evalúa cumplimiento con la ley de protección de datos 21.719 de Chile. Genera en español:
    1) Una checklist de cumplimiento con base legal, incluyendo los artículos relevantes de la ley. 
    Hace que los puntos de la checklist sean claros y concisos. y tengan cumplido ✅ o no cumplido ❌, o falta mas informarcion ❓.
    hacela en formato de lista.
    2) Recomendaciones por categoría (Consentimiento, Seguridad, ARCO) con ejemplos de buenas prácticas.
    """

    cached_answer = semantic_cache_lookup(prompt)
    if cached_answer:
        project_store[project.id] = {"description": project.description, "evaluation": cached_answer}
        return {"answer": cached_answer}

    response = qa_chain.invoke({"query": prompt})
    answer = response.get("answer") or response.get("result")
    project_store[project.id] = {"description": project.description, "evaluation": answer}
    semantic_cache_store(prompt, answer)
    print(f"Evaluation response: {answer}\n")
    return {"answer": answer}

@app.post("/project_chat")
async def project_chat(input: ChatInput):
    project_data = project_store.get(input.project_id)
    if not project_data:
        return {"error": "Project not found"}

    prompt = f"""
    Proyecto: {project_data['description']}
    Evaluación y recomendaciones previas: {project_data['evaluation']}
    
    Pregunta del usuario: {input.message}
    Responde en español, usando la información del proyecto y las recomendaciones previas.
    """

    cached_answer = semantic_cache_lookup(prompt)
    if cached_answer:
        return {"answer": cached_answer}

    response = qa_chain.invoke({"query": prompt})
    answer = response.get("answer") or response.get("result")
    semantic_cache_store(prompt, answer)
    print(f"Project chat response: {answer}\n")
    return {"answer": answer}


# ─────────────────────────────────────────────────────────────
# main
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
