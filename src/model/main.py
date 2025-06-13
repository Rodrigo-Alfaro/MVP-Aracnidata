from fastapi import FastAPI
from pydantic import BaseModel
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferMemory
import os

app = FastAPI()

# Load Vectorstore
vectorstore = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "ley_vectorstore"),
    HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"),
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever()

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

class Project(BaseModel):
    description: str

class ChatInput(BaseModel):
    message: str

@app.post("/evaluate")
async def evaluate(project: Project):
    prompt = f"""
    Tienes que evaluar el siguiente proyecto:
    {project.description}

    Evalúa cumplimiento con la ley de protección de datos 21.719 de Chile. Genera:
    1) Una checklist de cumplimiento con base legal
    2) Recomendaciones por categoría (Consentimiento, Seguridad, ARCO) con ejemplos de buenas prácticas
    """
    answer = qa_chain.run(prompt)
    print(f"Evaluation response: {answer}")
    return {"answer": answer}


@app.post("/chat")
async def chat(input: ChatInput):
    response = chat_chain.invoke({"question": input.message})
    print(f"Chat response: {response['answer']}")
    return {"answer": response["answer"]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
