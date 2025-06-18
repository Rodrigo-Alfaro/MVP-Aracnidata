import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-mpnet-base-v2")
dim = 768

index = faiss.IndexFlatIP(dim)

def embed(text):
    vec = model.encode([text])
    vec = np.array(vec).astype("float32")
    faiss.normalize_L2(vec)
    return vec

text = "que es la nueva ley de datos personales?"
vec = embed(text)

index.add(vec)
print("Index size:", index.ntotal)

# Buscamos el mismo texto
vec2 = embed(text)
D, I = index.search(vec2, k=1)
print("Similarity:", D[0][0])
