# backend/embedding.py
"""
Embedding module for Tawhida RAG system.
Handles three distinct modalities with their specific vector dimensions:
- Gene text: 844D (custom dimension from TCGA gene expression data)
- Protein text: 384D (standard sentence transformer dimension)
- Pathology images: 512D (CLIP ViT-B/32 standard dimension)

This module provides modality-specific embedding functions that match
the exact vector dimensions used in your Qdrant collections:
- breast_cancer_genes_mutation (844D)
- breast_cancer_protein_profiles (384D)  
- PathologyImage (512D)
"""

import os
import logging
from typing import Optional, List
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel, SentenceTransformer
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instances - loaded once at module initialization
_model_384 = None
_clip_model = None
_clip_processor = None

def _load_models():
    """
    Lazy loading of embedding models to optimize startup time.
    Models are only loaded when first needed.
    """
    global _model_384, _clip_model, _clip_processor
    
    if _model_384 is None:
        logger.info("Loading SentenceTransformer (all-MiniLM-L6-v2) for 384D embeddings...")
        _model_384 = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        logger.info("SentenceTransformer loaded successfully.")
    
    if _clip_model is None or _clip_processor is None:
        logger.info("Loading CLIP ViT-B/32 for 512D image/text embeddings...")
        _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        logger.info("CLIP model loaded successfully.")

def embed_text_844(text: str) -> Optional[List[float]]:
    """
    Embed gene-related text into 844-dimensional vector space.
    
    Since 844D is a non-standard dimension (likely from custom gene expression
    autoencoder), this function uses a fallback approach:
    1. Generate 384D embedding using all-MiniLM-L6-v2
    2. Pad with zeros to reach 844 dimensions
    
    This maintains compatibility with your existing 'breast_cancer_genes_mutation' 
    collection while providing reasonable semantic similarity.
    
    Args:
        text (str): Input gene text (e.g., "Patient with BRCA1 mutation and 141 mutated genes")
        
    Returns:
        Optional[List[float]]: 844-dimensional embedding vector or None if error occurs
        
    Example:
        >>> embed_text_844("BRCA1 mutation detected")
        [0.23, -0.45, 0.67, ..., 0.0, 0.0, 0.0]  # 844 elements
    """
    # Input validation
    if not text or not isinstance(text, str) or not text.strip():
        logger.warning("Empty or invalid text input for 844D embedding")
        return None
    
    try:
        # Load models if not already loaded
        _load_models()
        
        # Clean and preprocess text
        clean_text = text.strip()
        
        # Generate 384D base embedding
        logger.debug(f"Generating 384D embedding for text: {clean_text[:50]}...")
        vec_384 = _model_384.encode([clean_text], convert_to_numpy=True)[0]
        
        # Validate embedding quality
        if vec_384 is None or len(vec_384) != 384:
            logger.error(f"Invalid 384D embedding generated: {vec_384}")
            return None
        
        # Pad to 844 dimensions with zeros
        padding_size = 844 - 384
        if padding_size <= 0:
            logger.error(f"Padding size calculation error: {padding_size}")
            return None
            
        padded_vector = np.concatenate([vec_384, np.zeros(padding_size)])
        
        # Convert to Python list for JSON serialization
        result = padded_vector.tolist()
        
        logger.info(f"Successfully generated 844D embedding (384D + {padding_size} padding)")
        return result
        
    except Exception as e:
        logger.error(f"844D embedding error for text '{text[:50]}...': {str(e)}", exc_info=True)
        return None

def embed_text_384(text: str) -> Optional[List[float]]:
    """
    Embed protein-related text into 384-dimensional vector space.
    
    Uses the efficient all-MiniLM-L6-v2 sentence transformer model which is
    well-suited for biomedical text and matches your 'breast_cancer_protein_profiles'
    collection dimension exactly.
    
    Args:
        text (str): Input protein text (e.g., "ER Status: Positive → Récepteur œstrogène présent")
        
    Returns:
        Optional[List[float]]: 384-dimensional embedding vector or None if error occurs
        
    Example:
        >>> embed_text_384("ER positive, HER2 negative")
        [0.12, -0.34, 0.56, ...]  # 384 elements
    """
    # Input validation
    if not text or not isinstance(text, str) or not text.strip():
        logger.warning("Empty or invalid text input for 384D embedding")
        return None
    
    try:
        # Load models if not already loaded
        _load_models()
        
        # Clean and preprocess text
        clean_text = text.strip()
        
        # Generate 384D embedding
        logger.debug(f"Generating 384D embedding for text: {clean_text[:50]}...")
        vec_384 = _model_384.encode([clean_text], convert_to_numpy=True)[0]
        
        # Validate embedding
        if vec_384 is None or len(vec_384) != 384:
            logger.error(f"Invalid 384D embedding generated: {vec_384}")
            return None
        
        # Convert to Python list
        result = vec_384.tolist()
        
        logger.info("Successfully generated 384D embedding")
        return result
        
    except Exception as e:
        logger.error(f"384D embedding error for text '{text[:50]}...': {str(e)}", exc_info=True)
        return None

def embed_image_512(image_path: str) -> Optional[List[float]]:
    """
    Embed pathology images into 512-dimensional vector space.
    
    Uses CLIP ViT-B/32 model which provides state-of-the-art multimodal
    embeddings and matches your 'PathologyImage' collection dimension exactly.
    The model is normalized using L2 normalization for optimal cosine similarity
    performance in Qdrant.
    
    Args:
        image_path (str): Path to image file (JPG, PNG, etc.)
        
    Returns:
        Optional[List[float]]: 512-dimensional embedding vector or None if error occurs
        
    Example:
        >>> embed_image_512("/path/to/mammogram.jpg")
        [0.45, -0.23, 0.78, ...]  # 512 elements
    """
    # Input validation
    if not image_path or not isinstance(image_path, str):
        logger.warning("Invalid image path for 512D embedding")
        return None
    
    if not os.path.exists(image_path):
        logger.warning(f"Image file not found: {image_path}")
        return None
    
    try:
        # Load models if not already loaded
        _load_models()
        
        # Open and preprocess image
        logger.debug(f"Loading image: {image_path}")
        image = Image.open(image_path).convert("RGB")
        
        # Validate image dimensions
        width, height = image.size
        if width == 0 or height == 0:
            logger.error(f"Invalid image dimensions: {width}x{height}")
            return None
        
        # Process image through CLIP
        logger.debug(f"Processing image ({width}x{height}) through CLIP...")
        inputs = _clip_processor(images=image, return_tensors="pt")
        
        # Generate embedding with no gradient computation
        with torch.no_grad():
            features = _clip_model.get_image_features(**inputs)
            # Apply L2 normalization (required for cosine similarity)
            features = torch.nn.functional.normalize(features, p=2, dim=-1)
        
        # Extract first (and only) embedding
        embedding_512 = features[0].cpu().numpy()
        
        # Validate embedding
        if embedding_512 is None or len(embedding_512) != 512:
            logger.error(f"Invalid 512D embedding generated: {embedding_512}")
            return None
        
        # Convert to Python list for JSON serialization
        result = embedding_512.tolist()
        
        logger.info(f"Successfully generated 512D embedding for image ({width}x{height})")
        return result
        
    except Exception as e:
        logger.error(f"512D image embedding error for {image_path}: {str(e)}", exc_info=True)
        return None

def get_embedding_dimensions() -> dict:
    """
    Return the expected embedding dimensions for each modality.
    
    Returns:
        dict: Dictionary mapping modality names to dimensions
    """
    return {
        "genes": 844,
        "proteins": 384,
        "images": 512
    }

def validate_embedding_dimension(vector: List[float], expected_dim: int) -> bool:
    """
    Validate that an embedding vector has the expected dimension.
    
    Args:
        vector (List[float]): Embedding vector to validate
        expected_dim (int): Expected dimension
        
    Returns:
        bool: True if dimension matches, False otherwise
    """
    if not isinstance(vector, list):
        return False
    if len(vector) != expected_dim:
        return False
    return True

# Module initialization
logger.info("Embedding module initialized. Models will be loaded on first use.")
