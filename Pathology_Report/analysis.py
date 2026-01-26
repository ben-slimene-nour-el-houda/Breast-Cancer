from utils import risk_level, patient_message
from qdrant_utils import search_similar_images
from embeddings import embed_image

def compute_cancer_probability(results):
    if len(results) == 0:
        return 0.0
    positives = sum(1 for r in results if r.payload.get("cancer") is True)
    return positives / len(results)

def doctor_summary(results):
    return {
        "total_cases": len(results),
        "cancer_cases": sum(1 for r in results if r.payload.get("cancer")),
        "probability": compute_cancer_probability(results),
        "case_ids": [r.payload.get("case_id") for r in results]
    }

def analyze_image(image_path, mode="patient"):
    emb = embed_image(image_path)
    results = search_similar_images(emb, k=5)
    prob = compute_cancer_probability(results)
    level = risk_level(prob)

    if mode == "patient":
        return {
            "risk_level": level,
            "probability": prob,
            "message": patient_message(prob)
        }
    else:
        return {
            "risk_level": level,
            "probability": prob,
            "details": doctor_summary(results),
            "raw_results": results
        }
