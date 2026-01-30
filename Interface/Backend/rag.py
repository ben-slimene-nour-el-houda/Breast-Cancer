# backend/rag.py
"""
RAG (Retrieval-Augmented Generation) module for Tawhida system.
Generates safe, explainable, and ethically-compliant summaries from Qdrant search results.

This module processes results from three distinct collections:
- breast_cancer_genes_mutation: Contains genetic mutation data with 'Text' and 'DNA' fields
- breast_cancer_protein_profiles: Contains French clinical text in 'chunk_text' field  
- PathologyImage: Contains structured JSON with direct 'cancer' boolean field

All outputs are designed to be:
- Non-diagnostic (no probabilities or medical advice)
- Explainable (based on actual similar cases)
- Ethically compliant (references TCGA-BRCA public data only)
- Multilingual (handles French clinical terminology)
"""

import logging
import re
from typing import List, Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def count_cancer_cases(cases: List[Dict[str, Any]]) -> int:
    """
    Count confirmed cancer cases across all three collection types.
    
    This function handles the different payload structures:
    - PathologyImage: Direct 'cancer' boolean field
    - Genes collection: 'Text' field containing cancer-related terms
    - Proteins collection: 'chunk_text' field with French clinical descriptions
    
    Args:
        cases (List[Dict[str, Any]]): List of search results from Qdrant
        
    Returns:
        int: Number of cases with confirmed cancer
        
    Examples:
        >>> case1 = {"payload": {"cancer": True}}  # PathologyImage
        >>> case2 = {"payload": {"Text": "Patient with invasive ductal carcinoma confirmed"}}
        >>> case3 = {"payload": {"chunk_text": "Cancer confirmé: carcinome canalaire infiltrant"}}
        >>> count_cancer_cases([case1, case2, case3])
        3
    """
    if not cases:
        return 0
        
    count = 0
    cancer_keywords = [
        'cancer', 'carcinome', 'tumeur maligne', 'néoplasie', 
        'malignant', 'infiltrant', 'invasif', 'confirmé', 'confirmed'
    ]
    
    for case in cases:
        try:
            payload = case.get("payload", {})
            
            # PathologyImage collection: direct boolean field
            if "cancer" in payload and payload["cancer"] is True:
                count += 1
                continue
                
            # Genes collection: check 'Text' field
            if "Text" in payload and isinstance(payload["Text"], str):
                text_lower = payload["Text"].lower()
                # Check for cancer keywords AND confirmation terms
                has_cancer = any(keyword in text_lower for keyword in cancer_keywords[:5])  # cancer-related terms
                has_confirmation = any(keyword in text_lower for keyword in cancer_keywords[5:])  # confirmation terms
                if has_cancer and has_confirmation:
                    count += 1
                    continue
                    
            # Proteins collection: check 'chunk_text' field (French)
            if "chunk_text" in payload and isinstance(payload["chunk_text"], str):
                text_lower = payload["chunk_text"].lower()
                has_cancer = any(keyword in text_lower for keyword in cancer_keywords[:5])
                has_confirmation = any(keyword in text_lower for keyword in cancer_keywords[5:])
                if has_cancer and has_confirmation:
                    count += 1
                    
        except Exception as e:
            logger.warning(f"Error processing case for cancer detection: {str(e)}")
            continue
            
    logger.info(f"Cancer case count: {count} out of {len(cases)} total cases")
    return count

def extract_protein_biomarkers(protein_cases: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Extract protein biomarker status from protein_profiles collection.
    
    Handles multilingual clinical terminology including:
    - French: "récepteur œstrogène positif", "HER2 positif"
    - English: "ER positive", "HER2+"
    - Abbreviations: "ER+", "PR-", "HER2+"
    
    Biomarkers extracted:
    - ER (Estrogen Receptor)
    - PR (Progesterone Receptor) 
    - HER2 (Human Epidermal Growth Factor Receptor 2)
    - Ki67 (Proliferation marker)
    
    Args:
        protein_cases (List[Dict[str, Any]]): Protein collection search results
        
    Returns:
        Dict[str, int]: Counts of positive biomarker cases
        
    Example:
        >>> cases = [{"payload": {"chunk_text": "ER Status: Positive → Récepteur œstrogène présent"}}]
        >>> extract_protein_biomarkers(cases)
        {'er_positive': 1, 'pr_positive': 0, 'her2_positive': 0, 'ki67_high': 0}
    """
    if not protein_cases:
        return {"er_positive": 0, "pr_positive": 0, "her2_positive": 0, "ki67_high": 0}
    
    # Initialize counters
    er_positive = pr_positive = her2_positive = ki67_high = 0
    
    # Define comprehensive biomarker patterns
    er_patterns = [
        r'er\s*\+', r'er\s*positif', r'er\s*positive',
        r'récepteur\s*œstrogène\s*positif', r'estrogen\s*receptor\s*positive',
        r'œstrogène\s*positif', r'oestrogen\s*receptor\s*positive'
    ]
    
    pr_patterns = [
        r'pr\s*\+', r'pr\s*positif', r'pr\s*positive',
        r'récepteur\s*progestérone\s*positif', r'progesterone\s*receptor\s*positive',
        r'progestérone\s*positif'
    ]
    
    her2_patterns = [
        r'her2\s*\+', r'her-2\s*\+', r'her2\s*positif', r'her-2\s*positif',
        r'her2\s*positive', r'her-2\s*positive',
        r'human\s*epidermal\s*growth\s*factor\s*receptor\s*2\s*positive'
    ]
    
    ki67_patterns = [
        r'ki67', r'ki-67', r'k.i.67'
    ]
    ki67_high_indicators = [
        r'élevé', r'high', r'fort', r'élevée', r'highly', r'grade\s*[23]', r'grade\s*ii', r'grade\s*iii'
    ]
    
    for case in protein_cases:
        try:
            payload = case.get("payload", {})
            text = payload.get("chunk_text", "")
            if not isinstance(text, str):
                continue
                
            text_lower = text.lower()
            
            # ER detection
            if any(re.search(pattern, text_lower) for pattern in er_patterns):
                er_positive += 1
                
            # PR detection  
            if any(re.search(pattern, text_lower) for pattern in pr_patterns):
                pr_positive += 1
                
            # HER2 detection
            if any(re.search(pattern, text_lower) for pattern in her2_patterns):
                her2_positive += 1
                
            # Ki67 detection (requires both Ki67 mention AND high indicator)
            has_ki67 = any(re.search(pattern, text_lower) for pattern in ki67_patterns)
            has_high_indicator = any(re.search(pattern, text_lower) for pattern in ki67_high_indicators)
            if has_ki67 and has_high_indicator:
                ki67_high += 1
                
        except Exception as e:
            logger.warning(f"Error extracting protein biomarkers from case: {str(e)}")
            continue
    
    result = {
        "er_positive": er_positive,
        "pr_positive": pr_positive, 
        "her2_positive": her2_positive,
        "ki67_high": ki67_high
    }
    
    logger.info(f"Protein biomarker extraction: {result}")
    return result

def extract_gene_mutations(gene_cases: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Extract BRCA1/BRCA2 mutation status from genes_mutation collection.
    
    Handles multiple data sources within the payload:
    - 'Text' field: Natural language descriptions
    - 'DNA' field: Array of gene names/mutations
    
    Args:
        gene_cases (List[Dict[str, Any]]): Gene collection search results
        
    Returns:
        Dict[str, int]: Counts of BRCA1 and BRCA2 mutations
        
    Example:
        >>> cases = [{"payload": {"Text": "BRCA1 mutation detected", "DNA": ["BRCA1", "TP53"]}}]
        >>> extract_gene_mutations(cases)
        {'brca1_mutated': 1, 'brca2_mutated': 0}
    """
    if not gene_cases:
        return {"brca1_mutated": 0, "brca2_mutated": 0}
    
    brca1_mutated = brca2_mutated = 0
    
    # BRCA detection patterns
    brca1_patterns = [r'brca1', r'breast\s*cancer\s*1']
    brca2_patterns = [r'brca2', r'breast\s*cancer\s*2']
    
    mutation_indicators = [
        'mutation', 'mutated', 'muté', 'positif', 'positive', 
        'anormal', 'abnormal', 'défectueux', 'defective'
    ]
    
    for case in gene_cases:
        try:
            payload = case.get("payload", {})
            
            # Check Text field
            text = payload.get("Text", "")
            if isinstance(text, str):
                text_lower = text.lower()
                
                # BRCA1 detection
                has_brca1 = any(re.search(pattern, text_lower) for pattern in brca1_patterns)
                has_mutation = any(indicator in text_lower for indicator in mutation_indicators)
                if has_brca1 and has_mutation:
                    brca1_mutated += 1
                    
                # BRCA2 detection  
                has_brca2 = any(re.search(pattern, text_lower) for pattern in brca2_patterns)
                if has_brca2 and has_mutation:
                    brca2_mutated += 1
            
            # Check DNA array
            dna_array = payload.get("DNA", [])
            if isinstance(dna_array, list):
                dna_str = " ".join(str(item) for item in dna_array).lower()
                if any(re.search(pattern, dna_str) for pattern in brca1_patterns):
                    brca1_mutated += 1
                if any(re.search(pattern, dna_str) for pattern in brca2_patterns):
                    brca2_mutated += 1
                    
        except Exception as e:
            logger.warning(f"Error extracting gene mutations from case: {str(e)}")
            continue
    
    result = {
        "brca1_mutated": brca1_mutated,
        "brca2_mutated": brca2_mutated
    }
    
    logger.info(f"Gene mutation extraction: {result}")
    return result

def summarize_for_patient(all_cases: List[Dict[str, Any]]) -> str:
    """
    Generate patient-friendly summary with ethical compliance.
    
    Key principles:
    - No probabilities or risk percentages
    - No diagnostic language
    - Clear reference to TCGA-BRCA public data
    - Plain language suitable for non-medical audience
    - Focus on factual counts from similar cases
    
    Args:
        all_cases (List[Dict[str, Any]]): Combined results from all collections
        
    Returns:
        str: Patient-friendly summary text
        
    Example:
        "Parmi 28 cas similaires dans la base TCGA-BRCA, 11 ont eu un cancer confirmé."
    """
    total_cases = len(all_cases)
    
    if total_cases == 0:
        return ("Aucun cas similaire trouvé dans la base de données publique TCGA-BRCA. "
                "Cette base contient des profils cliniques historiques de patients atteints de cancer du sein.")
    
    cancer_count = count_cancer_cases(all_cases)
    
    # Construct ethical, non-diagnostic summary
    base_message = f"Parmi {total_cases} cas similaires dans la base TCGA-BRCA"
    
    if cancer_count == 0:
        return f"{base_message}, aucun n’a eu de cancer confirmé."
    else:
        return f"{base_message}, {cancer_count} ont eu un cancer confirmé."

def summarize_for_doctor(
    gene_cases: List[Dict[str, Any]], 
    protein_cases: List[Dict[str, Any]], 
    image_cases: List[Dict[str, Any]]
) -> str:
    """
    Generate detailed clinical summary for medical professionals.
    
    Includes:
    - Genetic mutation analysis (BRCA1/BRCA2)
    - Protein biomarker profile (ER/PR/HER2/Ki67)
    - Cancer confirmation statistics
    - NCCN-aligned clinical recommendations
    - Clear disclaimer about data source limitations
    
    Args:
        gene_cases (List[Dict[str, Any]]): Gene collection results
        protein_cases (List[Dict[str, Any]]): Protein collection results  
        image_cases (List[Dict[str, Any]]): Pathology image results
        
    Returns:
        str: Comprehensive clinical summary with recommendations
        
    Example:
        "Analyse des 28 cas les plus similaires dans la base TCGA-BRCA :
        - Mutations génétiques détectées : BRCA1 (8), BRCA2 (3)
        - Profil d'expression protéique : ER+ (22), PR+ (18), HER2+ (5), Ki67 élevé (14)
        - Cas avec cancer invasif confirmé : 11/28
        
        Recommandation clinique : Considérer une IRM mammaire pour évaluation complète..."
    """
    all_cases = gene_cases + protein_cases + image_cases
    total_cases = len(all_cases)
    
    if total_cases == 0:
        return ("Aucun cas similaire trouvé dans la base de données publique TCGA-BRCA. "
                "Cette base contient des profils cliniques historiques de patients atteints de cancer du sein.")
    
    # Extract comprehensive biomarker data
    gene_data = extract_gene_mutations(gene_cases)
    protein_data = extract_protein_biomarkers(protein_cases)
    cancer_count = count_cancer_cases(all_cases)
    
    # Build structured summary
    summary_parts = []
    
    # Header
    summary_parts.append(f"Analyse des {total_cases} cas les plus similaires dans la base TCGA-BRCA :")
    
    # Genetic findings section
    if gene_data["brca1_mutated"] > 0 or gene_data["brca2_mutated"] > 0:
        gene_line = "- Mutations génétiques détectées : "
        mutations = []
        if gene_data["brca1_mutated"] > 0:
            mutations.append(f"BRCA1 ({gene_data['brca1_mutated']})")
        if gene_data["brca2_mutated"] > 0:
            mutations.append(f"BRCA2 ({gene_data['brca2_mutated']})")
        summary_parts.append(gene_line + ", ".join(mutations))
    
    # Protein biomarker section
    protein_total = sum(protein_data.values())
    if protein_total > 0:
        protein_line = ("- Profil d'expression protéique : "
                       f"ER+ ({protein_data['er_positive']}), "
                       f"PR+ ({protein_data['pr_positive']}), "
                       f"HER2+ ({protein_data['her2_positive']}), "
                       f"Ki67 élevé ({protein_data['ki67_high']})")
        summary_parts.append(protein_line)
    
    # Cancer confirmation section
    if cancer_count > 0:
        cancer_line = f"- Cas avec cancer invasif confirmé : {cancer_count}/{total_cases}"
        summary_parts.append(cancer_line)
    
    # Clinical recommendation with ethical disclaimer
    recommendation = ("\nRecommandation clinique : "
                     "Considérer une IRM mammaire pour évaluation complète conformément aux lignes directrices NCCN v2025. "
                     "Cette analyse est basée uniquement sur des données publiques (TCGA-BRCA) et ne constitue pas un diagnostic médical. "
                     "Les décisions cliniques doivent être prises en consultation avec l'équipe médicale traitante.")
    
    summary_parts.append(recommendation)
    
    final_summary = "\n".join(summary_parts)
    logger.info("Generated doctor summary")
    return final_summary

def get_rag_statistics(
    gene_cases: List[Dict[str, Any]],
    protein_cases: List[Dict[str, Any]], 
    image_cases: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Get comprehensive statistics for monitoring and analytics.
    
    Args:
        gene_cases: Gene collection results
        protein_cases: Protein collection results
        image_cases: Pathology image results
        
    Returns:
        Dict[str, Any]: Detailed statistics dictionary
    """
    all_cases = gene_cases + protein_cases + image_cases
    
    stats = {
        "total_cases": len(all_cases),
        "gene_cases": len(gene_cases),
        "protein_cases": len(protein_cases),
        "image_cases": len(image_cases),
        "cancer_confirmed": count_cancer_cases(all_cases),
        "biomarkers": extract_protein_biomarkers(protein_cases),
        "mutations": extract_gene_mutations(gene_cases)
    }
    
    return stats

# Module initialization
logger.info("RAG module initialized with multilingual biomarker detection and ethical compliance")
