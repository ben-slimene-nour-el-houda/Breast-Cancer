from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, HnswConfigDiff
from config import QDRANT_URL, QDRANT_API_KEY, COLLECTION_NAME

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

def create_collection():
    if client.collection_exists(COLLECTION_NAME):
        client.delete_collection(COLLECTION_NAME)
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=512,
            distance=Distance.COSINE
        ),
        hnsw_config=HnswConfigDiff(m=16, ef_construct=200)
    )
    print(f"✅ Collection '{COLLECTION_NAME}' créée")

def search_similar_images(embedding, k=5):
    """Recherche les images similaires dans Qdrant"""
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=k,
        with_payload=True
    )
    return results.points
