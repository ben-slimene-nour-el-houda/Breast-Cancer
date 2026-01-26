# Breast Cancer Repository

The repository is organized into **three main modules** based on biological data types:

---

### 1. 🧬 Gene Mutation (`gene_mutation/`)

**Data Types:**  
- **Point Mutations:** Affected genes and mutation types  
- **DNA Sequences:** Raw nucleotide sequences (A, T, G, C) linked to mutations  
- **Genomic Metrics:** FGA (Fraction Genome Altered) for genome instability  
- **Pathways:** Impacted biological processes  

**Models & Techniques:**  
  - **BioBERT (dmis-lab/biobert-v1.1):** Encodes textual mutation descriptions, pretrained on biomedical texts  
  - **K-mer Encoding (k=3):** Converts DNA sequences into 3-mer frequency vectors  
  - **Multimodal Embedding:** Concatenates text, genomic, and numeric vectors into a single patient profile  

---

### 2. 🧪 Protein Mutation (`protein_mutation/`)

**Data Types:**  
- **Hormone Receptors:** ER, PR, HER2 status  
- **Molecular Subtypes:** PAM50 classifications (Luminal A/B, Her2-enriched, Basal-like)  
- **Tumor Stages:** TNM scale (T1, T2…)  

**Models & Techniques:**  
  - **Clinical NLP Conversion:** Protein data converted into explanatory paragraphs for LLMs  
  - **all-MiniLM-L6-v2:** Sentence transformer producing 384-dim vectors for Qdrant search  

---

### 3. 📄 Pathology Report (`pathology_report/`)

**Data Types:**  
- **Clinical Text Reports:** Free-text pathology notes, histology descriptions, and biopsy findings  
- **Structured Metadata:** Patient IDs, sample IDs, slide images, and report dates  
- **Image Data:** Associated microscopy or histopathology images  

**Models & Techniques:**  
- **CLIP (openai/clip-vit-base-patch32):** Generates multimodal embeddings for pathology images, enabling image-text retrieval  
- **Text Preprocessing:** Tokenization, cleaning, and normalization of report text  
- **Vector Database (Qdrant):** Stores 512-dim image and text embeddings for semantic search and similarity queries  
- **Multimodal Retrieval:** Allows searching for patients or slides using text queries, image queries, or combined embeddings  
