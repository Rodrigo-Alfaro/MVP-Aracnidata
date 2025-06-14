from fastapi import FastAPI
from pydantic import BaseModel
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferMemory
from typing import Dict
import os

app = FastAPI()

# Load Vectorstore
vectorstore = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "ley_vectorstore"),
    HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"),
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

llm = OllamaLLM(model="mistral")

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff"
)

# Memory for Conversational Chain
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
chat_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory
)

project_store: Dict[str, dict] = {}

class Chat(BaseModel):
    message: str
class Project(BaseModel):
    id: str
    description: str
class ChatInput(BaseModel):
    project_id: str
    message: str

@app.post("/chat")
async def chat(input: Chat):
    prompt = f"""
    Eres un experto en la ley 21.719 de protección de datos de Chile. Estas respondiendo a alguien sin conocimientos
    tecnicos, se lo mas simple y completo posible.
    Pregunta del usuario: {input.message}
    Responde en español, usando la información de la ley y buenas prácticas.
    """
    response = qa_chain.invoke({"query": prompt})
    print(f"Chat response: {response.get('answer') or response.get('result')}\n")
    return {"answer": response.get("answer") or response.get("result")}

@app.post("/evaluate")
async def evaluate(project: Project):
    prompt = f"""
    Eres un experto en la ley 21.719 de protección de datos de Chile. Tienes que evaluar el siguiente proyecto:
    {project.description}

    Evalúa cumplimiento con la ley de protección de datos 21.719 de Chile. Genera en español:
    1) Una checklist de cumplimiento con base legal
    2) Recomendaciones por categoría (Consentimiento, Seguridad, ARCO) con ejemplos de buenas prácticas
    """
    answer = qa_chain.invoke({"query": prompt})
    project_store[project.id] = {
        "description": project.description,
        "evaluation": answer.get("answer") or answer.get("result")
    }
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
    response = qa_chain.invoke({"query": prompt})
    print(f"Chat response: {response.get('answer') or response.get('result')}\n")
    return {"answer": response.get("answer") or response.get("result")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
