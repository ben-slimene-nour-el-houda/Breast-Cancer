The repository is organized into three main modules based on biological data types:

1. 🧬 Gene Mutation (gene_mutation/)

Data Types:

Point Mutations: Affected genes and mutation types

DNA Sequences: Raw nucleotide sequences (A, T, G, C) linked to mutations

Genomic Metrics: FGA (Fraction Genome Altered) for genome instability

Pathways: Impacted biological processes

Models & Techniques:

BioBERT (dmis-lab/biobert-v1.1): Encodes textual mutation descriptions, pretrained on biomedical texts for better domain understanding

K-mer Encoding (k=3): Converts DNA sequences into 3-mer frequency vectors to capture local sequence motifs

Multimodal Embedding: Concatenates text, genomic, and numeric vectors into a single patient profile

2. 🧪 Protein Mutation (protein_mutation/)

Data Types:

Hormone Receptors: ER, PR, HER2 status

Molecular Subtypes: PAM50 classifications (Luminal A/B, Her2-enriched, Basal-like)

Tumor Stages: TNM scale (T1, T2…)

Models & Techniques:

Clinical NLP Conversion: Protein data is converted into short explanatory paragraphs for LLM understanding

all-MiniLM-L6-v2: Lightweight sentence transformer for semantic similarity, producing 384-dim vectors for Qdrant search

3. 📄 Pathology Report (pathology_report/)
