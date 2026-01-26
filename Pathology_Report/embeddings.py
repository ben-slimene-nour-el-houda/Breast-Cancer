from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from config import CLIP_MODEL_NAME

# Charger modèle CLIP
clip_model = CLIPModel.from_pretrained(CLIP_MODEL_NAME)
clip_processor = CLIPProcessor.from_pretrained(CLIP_MODEL_NAME)
clip_model.eval()

def embed_image(image_path):
    """Crée l'embedding normalisé pour une image"""
    image = Image.open(image_path).convert("RGB")
    inputs = clip_processor(images=image, return_tensors="pt")
    with torch.no_grad():
        emb = clip_model.get_image_features(**inputs)
        emb = emb / emb.norm(dim=-1, keepdim=True)
    return emb.squeeze().tolist()
