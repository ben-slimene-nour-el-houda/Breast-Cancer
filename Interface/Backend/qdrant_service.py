# backend/qdrant_service.py
"""
Qdrant service module for Tawhida RAG system.
Handles searching across three distinct collections with different vector dimensions:
- breast_cancer_genes_mutation (844D)
- breast_cancer_protein_profiles (384D)
- PathologyImage (512D)

This module provides a unified interface to search all collections simultaneously
while respecting their individual embedding requirements and payload structures.
"""

import os
import logging
from typing import Dict, List, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import SearchRequest, VectorParams, Distance
from .embedding import (
    embed_text_844, 
    embed_text_384, 
    embed_image_512,
    validate_embedding_dimension
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global Qdrant client instance
_qdrant_client = None

def _get_qdrant_client() -> QdrantClient:
    """
    Get or create the global Qdrant client instance.
    Ensures only one client is created per application lifecycle.
    
    Returns:
        QdrantClient: Configured Qdrant client instance
        
    Raises:
        ValueError: If QDRANT_URL or QDRANT_API_KEY environment variables are missing
    """
    global _qdrant_client
    
    if _qdrant_client is None:
        # Validate required environment variables
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")
        
        if not qdrant_url:
            raise ValueError("QDRANT_URL environment variable is required")
        if not qdrant_api_key:
            raise ValueError("QDRANT_API_KEY environment variable is required")
            
        logger.info(f"Initializing Qdrant client with URL: {qdrant_url}")
        _qdrant_client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
            timeout=30.0  # 30 second timeout for operations
        )
        
        # Verify connection
        try:
            collections = _qdrant_client.get_collections()
            logger.info(f"Successfully connected to Qdrant. Available collections: {[c.name for c in collections.collections]}")
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {str(e)}")
            raise
        
    return _qdrant_client

def _search_collection(
    collection_name: str,
    vector: List[float],
    expected_dim: int,
    limit: int = 10
) -> List[Dict]:
    """
    Search a single Qdrant collection with proper error handling and validation.
    
    Args:
        collection_name (str): Name of the collection to search
        vector (List[float]): Query vector
        expected_dim (int): Expected vector dimension for validation
        limit (int): Maximum number of results to return
        
    Returns:
        List[Dict]: List of search results with id and payload
        
    Raises:
        ValueError: If vector dimension doesn't match expected dimension
        Exception: If Qdrant search fails
    """
    client = _get_qdrant_client()
    
    # Validate vector dimension
    if not validate_embedding_dimension(vector, expected_dim):
        raise ValueError(f"Vector dimension mismatch for {collection_name}: expected {expected_dim}, got {len(vector)}")
    
    try:
        logger.debug(f"Searching collection '{collection_name}' with {expected_dim}D vector, limit={limit}")
        
        # Perform search
        hits = client.search(
            collection_name=collection_name,
            query_vector=vector,
            limit=limit,
            with_payload=True,
            with_vectors=False,  # Don't return vectors to save bandwidth
            score_threshold=0.0  # Return all results above minimum similarity
        )
        
        # Format results
        results = []
        for hit in hits:
            result = {
                "id": hit.id,
                "payload": hit.payload,
                "score": float(hit.score)  # Ensure float for JSON serialization
            }
            results.append(result)
            
        logger.info(f"Found {len(results)} results in collection '{collection_name}'")
        return results
        
    except Exception as e:
        logger.error(f"Search failed for collection '{collection_name}': {str(e)}", exc_info=True)
        raise

def search_all_collections(
    gene_text: str = "",
    protein_text: str = "",
    image_path: str = ""
) -> Dict[str, List[Dict]]:
    """
    Search all three Qdrant collections simultaneously based on provided inputs.
    
    This function intelligently routes inputs to the appropriate collections:
    - gene_text → breast_cancer_genes_mutation (844D)
    - protein_text → breast_cancer_protein_profiles (384D)
    - image_path → PathologyImage (512D)
    
    Args:
        gene_text (str): Genetic information text (e.g., "BRCA1 mutation")
        protein_text (str): Protein biomarker text (e.g., "ER positive, HER2 negative")
        image_path (str): Path to pathology report image file
        
    Returns:
        Dict[str, List[Dict]]: Dictionary containing results from all collections:
            {
                "genes": [...],      # Results from breast_cancer_genes_mutation
                "proteins": [...],   # Results from breast_cancer_protein_profiles  
                "images": [...]      # Results from PathologyImage
            }
            
    Example:
        >>> results = search_all_collections(
        ...     gene_text="BRCA1 mutation",
        ...     protein_text="ER positive",
        ...     image_path="/tmp/report.jpg"
        ... )
        >>> len(results["genes"])  # Number of gene matches
        >>> len(results["proteins"])  # Number of protein matches
        >>> len(results["images"])  # Number of image matches
    """
    logger.info("Starting multi-collection search")
    logger.debug(f"Inputs - gene_text: {bool(gene_text)}, protein_text: {bool(protein_text)}, image_path: {bool(image_path)}")
    
    results = {
        "genes": [],
        "proteins": [],
        "images": []
    }
    
    try:
        # 1. Search genes collection (844D)
        if gene_text and gene_text.strip():
            logger.info("Processing gene text input")
            gene_vector = embed_text_844(gene_text)
            if gene_vector:
                results["genes"] = _search_collection(
                    collection_name="breast_cancer_genes_mutation",
                    vector=gene_vector,
                    expected_dim=844,
                    limit=10
                )
            else:
                logger.warning("Failed to generate gene embedding, skipping genes collection")
        else:
            logger.debug("No gene text provided, skipping genes collection")
        
        # 2. Search proteins collection (384D)
        if protein_text and protein_text.strip():
            logger.info("Processing protein text input")
            protein_vector = embed_text_384(protein_text)
            if protein_vector:
                results["proteins"] = _search_collection(
                    collection_name="breast_cancer_protein_profiles",
                    vector=protein_vector,
                    expected_dim=384,
                    limit=10
                )
            else:
                logger.warning("Failed to generate protein embedding, skipping proteins collection")
        else:
            logger.debug("No protein text provided, skipping proteins collection")
        
        # 3. Search pathology images collection (512D)
        if image_path and os.path.exists(image_path):
            logger.info(f"Processing image input: {image_path}")
            image_vector = embed_image_512(image_path)
            if image_vector:
                results["images"] = _search_collection(
                    collection_name="PathologyImage",
                    vector=image_vector,
                    expected_dim=512,
                    limit=10
                )
            else:
                logger.warning("Failed to generate image embedding, skipping images collection")
        else:
            if image_path:
                logger.warning(f"Image path does not exist: {image_path}")
            logger.debug("No valid image path provided, skipping images collection")
        
        # Log final results summary
        total_results = len(results["genes"]) + len(results["proteins"]) + len(results["images"])
        logger.info(f"Multi-collection search completed. Total results: {total_results} "
                   f"(genes: {len(results['genes'])}, proteins: {len(results['proteins'])}, images: {len(results['images'])})")
        
        return results
        
    except Exception as e:
        logger.error(f"Multi-collection search failed: {str(e)}", exc_info=True)
        # Return empty results on failure to maintain API contract
        return {"genes": [], "proteins": [], "images": []}

def get_collection_info() -> Dict[str, Dict]:
    """
    Get information about all configured collections.
    
    Returns:
        Dict[str, Dict]: Collection information including vector dimensions and status
    """
    client = _get_qdrant_client()
    collections_info = {}
    
    expected_collections = {
        "breast_cancer_genes_mutation": 844,
        "breast_cancer_protein_profiles": 384,
        "PathologyImage": 512
    }
    
    for collection_name, expected_dim in expected_collections.items():
        try:
            collection_info = client.get_collection(collection_name)
            collections_info[collection_name] = {
                "exists": True,
                "vector_size": collection_info.config.params.vectors.size,
                "distance": collection_info.config.params.vectors.distance,
                "expected_dim": expected_dim,
                "dimension_match": collection_info.config.params.vectors.size == expected_dim
            }
        except Exception as e:
            collections_info[collection_name] = {
                "exists": False,
                "error": str(e),
                "expected_dim": expected_dim
            }
    
    return collections_info

def health_check() -> bool:
    """
    Perform a health check on the Qdrant connection.
    
    Returns:
        bool: True if connection is healthy, False otherwise
    """
    try:
        client = _get_qdrant_client()
        client.get_collections()
        return True
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return False

# Module initialization
logger.info("Qdrant service module initialized. Client will be created on first use.")
