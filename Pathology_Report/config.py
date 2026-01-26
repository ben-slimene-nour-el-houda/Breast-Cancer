
import os

# Qdrant
QDRANT_URL = "https://5f634570-7d75-4753-a450-5a595145d6bf.europe-west3-0.gcp.cloud.qdrant.io"
QDRANT_API_KEY = "VOTRE_API_KEY_ICI"  # tu peux le remplacer par userdata.get("api-key") si dans Colab

COLLECTION_NAME = "PathologyImage"

# Dataset
DATA_DIR = "/content/synthetic_breast_dataset"
IMG_DIR = os.path.join(DATA_DIR, "images")
METADATA_FILE = os.path.join(DATA_DIR, "metadata.jsonl")

# CLIP
CLIP_MODEL_NAME = "openai/clip-vit-base-patch32"
