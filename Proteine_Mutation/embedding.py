# embed_locally.py
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

df = pd.read_csv("protein_chunks.csv", sep=";", encoding="utf-8")

# Handle missing values
df.fillna("Unknown", inplace=True)

# Generate embeddings
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(df["chunk_text"].tolist(), show_progress_bar=True)

# Save
np.save("protein_embeddings.npy", embeddings)
df[["patient_id", "chunk_text"]].to_csv(
    "protein_chunks_FIXED.csv", 
    index=False, 
    encoding="utf-8",
    quoting=1  # ensures proper quoting for future use
)

print(f" {len(embeddings)} embeddings générés (384D) et sauvegardés.")