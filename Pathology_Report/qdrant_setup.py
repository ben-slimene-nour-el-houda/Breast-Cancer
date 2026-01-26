import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, HnswConfigDiff
from config import QDRANT_URL, QDRANT_API_KEY, COLLECTION_NAME

def setup_qdrant():
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

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

    print(f" Collection Qdrant '{COLLECTION_NAME}' créée")
    return client

def add_embeddings(client, data, embed_func, data_dir):
    for item in data:
        image_path_rel = item.get("image_path")
        if not image_path_rel:
            continue

        image_path = f"{data_dir}/{image_path_rel}"
        emb = embed_func(image_path)

        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=emb,
            payload=item
        )
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=[point]
        )

    print(" Tous les embeddings ont été ajoutés à Qdrant")
