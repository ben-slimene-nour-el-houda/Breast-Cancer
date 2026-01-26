from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, PointStruct
import uuid
import numpy as np

# Connexion à Qdrant 
client = QdrantClient(
    url="httpsast4-0.gcp.cloud.qdrant.io",
    api_key="eyJhbGciOiJIUzI1NiIsILspRuz8UOL1tyMHv1Q"
)

collection_name = "breast_cancer_genes_mutation"

# Création ou réinitialisation de la collection
# embeddings doit être défini avant : shape = (nb_points, dimension_vecteur)
client.recreate_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(size=embeddings.shape[1], distance="Cosine")
)
print(f"Collection '{collection_name}' créée")

# Préparation des points à insérer
points = []
for i, patient in enumerate(patient_chunks):
    vector = embeddings[i].tolist()  # Conversion du vecteur numpy en liste
    payload = {
        "Patient_ID": patient.get("Patient_ID"),
        "Sample_ID": patient.get("Sample_ID"),
        "Text": patient.get("Text"),
        "DNA": patient.get("DNA"),
        "Pathways": patient.get("Pathways"),
        "FGA": patient.get("Numeric", {}).get("FGA", 0.0),
        "Mutation_Count": patient.get("Numeric", {}).get("Mutation_Count", 0)
    }

    points.append(PointStruct(
        id=str(uuid.uuid4()),  # UUID unique
        vector=vector,
        payload=payload
    ))

print(f"{len(points)} points prêts pour Qdrant ")

# Envoi par batch pour éviter les limites de mémoire
batch_size = 500
for i in range(0, len(points), batch_size):
    batch = points[i:i+batch_size]
    client.upsert(
        collection_name=collection_name,
        points=batch
    )
    print(f"Batch {i} → {i+len(batch)} envoyé")

