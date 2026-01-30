# backend/main.py
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .qdrant_service import search_all_collections
from .rag import summarize_for_patient, summarize_for_doctor, count_cancer_cases
import os
import tempfile
import shutil

app = FastAPI(title="Tawhida RAG API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/search")
async def search_risk(
    role: str = Form(...),
    gene_text: str = Form(""),
    protein_text: str = Form(""),
    report_image: UploadFile = File(None)
):
    """
    Main endpoint for Tawhida RAG system
    Accepts:
      - role: "patient" or "doctor"
      - gene_text: genetic info (e.g., "BRCA1 mutation")
      - protein_text: protein biomarkers (e.g., "ER+, PR-")
      - report_image: pathology report image (optional)
    """
    # Validate role
    if role not in ["patient", "doctor"]:
        raise HTTPException(status_code=400, detail="Role must be 'patient' or 'doctor'")
    
    # Save uploaded image temporarily
    image_path = None
    temp_dir = None
    if report_image and report_image.filename:
        temp_dir = tempfile.mkdtemp()
        image_path = os.path.join(temp_dir, report_image.filename)
        with open(image_path, "wb") as f:
            f.write(await report_image.read())

    try:
        # Search all three collections
        results = search_all_collections(gene_text, protein_text, image_path)
        
        # Extract cases by modality
        gene_cases = results.get("genes", [])
        protein_cases = results.get("proteins", [])
        image_cases = results.get("images", [])
        all_cases = gene_cases + protein_cases + image_cases

        # Generate role-specific response
        if role == "patient":
            explanation = summarize_for_patient(all_cases)
            total_cases = len(all_cases)
            cancer_count = count_cancer_cases(all_cases)
            
            # Determine risk level
            if total_cases == 0:
                risk_level = "Inconnu"
            elif cancer_count == 0:
                risk_level = "Faible"
            elif cancer_count / total_cases >= 0.5:
                risk_level = "Élevé"
            else:
                risk_level = "Modéré"
                
            return {
                "risk_level": risk_level,
                "explanation": explanation,
                "similar_cases_count": total_cases,
                "cancer_confirmed_count": cancer_count
            }
            
        else:  # doctor
            explanation = summarize_for_doctor(gene_cases, protein_cases, image_cases)
            return {
                "explanation": explanation,
                "similar_cases": [hit["payload"] for hit in all_cases[:10]],
                "total_found": len(all_cases),
                "gene_cases_count": len(gene_cases),
                "protein_cases_count": len(protein_cases),
                "image_cases_count": len(image_cases)
            }

    finally:
        # Cleanup temporary files
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
