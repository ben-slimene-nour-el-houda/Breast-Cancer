# upload_to_qdrant.py
import numpy as np
import pandas as pd
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
COLLECTION_NAME = "breast_cancer_protein_profiles"
EMBEDDINGS_FILE = "protein_embeddings.npy"
METADATA_FILE = "protein_chunks_FIXED.csv"

# Connect to Qdrant Cloud
print("Connecting to Qdrant Cloud...")
client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# Load data

embeddings = np.load(EMBEDDINGS_FILE)
metadata = pd.read_csv(METADATA_FILE, encoding="utf-8")

# Validate
assert len(embeddings) == len(metadata), "Mismatch between embeddings and metadata!"
print(f" Loaded {len(embeddings)} items")

# Create collection
print(" Creating collection in Qdrant Cloud...")
client.recreate_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)

# Prepare points
print(" Preparing points for upload...")
points = []
for i in range(len(embeddings)):
    points.append(
        PointStruct(
            id=i,
            vector=embeddings[i].tolist(),
            payload={
                "patient_id": str(metadata.iloc[i]["patient_id"]),
                "chunk_text": str(metadata.iloc[i]["chunk_text"]),
                "source": "TCGA-BRCA",
                "modality": "Protein Biomarkers"
            }
        )
    )

# Upload
client.upsert(collection_name=COLLECTION_NAME, points=points)
