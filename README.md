# 🩺 Tawhida  
## Multimodal Breast Cancer Risk Assessment System

---

## 1. Project Overview

**Tawhida** is a **multimodal, retrieval-based clinical decision support system (CDSS)** designed to assess **breast cancer risk** by integrating **genetic, proteomic, clinical text, and pathology image data**.

The system focuses on **non-invasive, pre-imaging risk stratification**, aiming to **reduce unnecessary exposure to ionizing radiation (mammography)**—especially for **young women** and **high-risk populations**.

Tawhida does **not perform autonomous diagnosis or prediction**. Instead, it provides **evidence-grounded similarity-based insights** to support clinicians and inform patients.

---

## 2. Key Objectives

### 🎯 Risk Stratification
- **Screening**: Early identification of asymptomatic women at risk  
- **Follow-up (Suivi)**: Monitoring recurrence risk in breast cancer survivors  

### 🧬 Multimodal Integration
- Genetic mutations (e.g. **BRCA1 / BRCA2**)  
- Protein biomarkers (**ER, PR, HER2**)  
- Pathology reports and histopathology images  

### 🔍 Explainability
- **Doctor Mode**: Similarity scores, modality contributions, biomedical rationale  
- **Patient Mode**: Qualitative risk tiers (*Low / Moderate / High*)  

### ☢️ Radiation Reduction
- Reduce over-screening  
- Limit cumulative radiation exposure  

---

## 3. Technologies Used

| Component | Technology |
|--------|-----------|
| Vector Database | **Qdrant (Cloud)** |
| Retrieval | **RAG (Retrieval-Augmented Generation)** |
| LLM Orchestration | Risk LLM + RAG LLM |
| Indexing | **HNSW** |
| Similarity Metric | **Cosine Similarity** |
| Image Embeddings | **CLIP (ViT-B/32)** |
| Text Embeddings | **BioBERT**, **all-MiniLM-L6-v2** |
| Dataset | **TCGA-BRCA** |

---

## 4. System Architecture

Tawhida is structured into **three layers**:

### 🖥️ Frontend Layer
- Secure web interface  
- Role-based access:
  - Doctor dashboard
  - Patient interface  

### 🧠 Inference & RAG Layer
- Risk Evaluation Engine  
- API orchestration  
- Specialized LLMs:
  - Risk LLM
  - RAG LLM  

### 🗄️ Data Layer
- Qdrant Vector Database  
- Medical Knowledge Base  
- Patient Records  

---

## 5. Qdrant Integration (Biological Memory)

Qdrant acts as the **core similarity engine**, storing multimodal embeddings of historical breast cancer cases.

### 5.1 Modality-Specific Collections

| Collection | Description |
|----------|-------------|
| `genes_collection` | Gene-level mutation embeddings |
| `proteins_collection` | ER / PR / HER2 profiles |
| `pathology_reports_collection` | Clinical report |

Each vector contains:
- Case ID  
- Modality metadata  
- Dataset traceability  

---

### 5.2 Retrieval Workflow

1. Patient data decomposition (genetic, proteomic, text, image)  
2. Modality-specific embedding  
3. Top-K similarity search (cosine similarity)  
4. RAG-based explanation adapted to user role
📚 Usage Examples
For Patients:
1.Go to patient.html
2.Upload a pathology report image (JPG/PNG)
3.Click "Analyser"
See:
"Parmi 28 cas similaires dans la base TCGA-BRCA, 11 ont eu un cancer confirmé."
For Doctors:
1.Go to doctor.html
2.Upload image + enter: "ER+, PR-, HER2-, BRCA1+"
3.Click "Analyser"
See detailed summary with:
BRCA1/2 mutation counts
ER/PR/HER2/Ki67 status
NCCN v2025 recommendation
Clear disclaimer: "This analysis is based on public TCGA-BRCA data and is not a diagnosis."

---

## 6. Repository Structure

```bash
breast-cancer-repository/
│
├── gene_mutation/
├── protein_mutation/
├── pathology_report/
└── Interface/

---
## 7. 📦 Requirements / Dependencies

Backend (backend/requirements.txt)
txt
123456789
fastapi==0.110.0
uvicorn==0.27.0
qdrant-client==1.10.0
torch==2.4.0
transformers==4.40.0
pillow==10.3.0
python-dotenv==1.0.1
sentencepiece==0.2.0
numpy==1.26.0
Frontend
Pure HTML/CSS/JS — no dependencies
Uses modern CSS (Flexbox/Grid), responsive design, Inter font (Google Fonts)
