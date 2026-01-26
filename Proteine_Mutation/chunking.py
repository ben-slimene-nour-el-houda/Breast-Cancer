# chunk_protein_data.py

protein_descriptions = {
    "er_status": {
        "Positive": "Récepteur œstrogène présent → tumeur sensible aux œstrogènes.",
        "Negative": "Pas de récepteur œstrogène → tumeur indépendante des œstrogènes.",
        "Unknown": "Statut ER non testé ou inconnu."
    },
    "pr_status": {
        "Positive": "Récepteur progestérone présent → souvent associé à un meilleur pronostic.",
        "Negative": "Pas de récepteur progestérone → moins sensible aux traitements hormonaux.",
        "Unknown": "Statut PR non testé ou inconnu."
    },
    "her2_status": {
        "Positive": "Overexpression de HER2 → croissance tumorale rapide, mais traitable par thérapie ciblée.",
        "Negative": "Pas d’overexpression de HER2 → pas besoin de trastuzumab.",
        "Equivocal": "Résultat équivoque → nécessite confirmation par FISH.",
        "Unknown": "Statut HER2 non testé ou inconnu."
    },
    "rppa_cluster": {
        "Basal": "Profil protéique typique des cancers triple négatifs.",
        "Luminal A": "Profil protéique avec faible activité de signalisation oncogène.",
        "Luminal B": "Profil protéique avec activation de voies de croissance.",
        "HER2-enriched": "Profil protéique avec activation de la voie HER2.",
        "Normal-like": "Profil proche du tissu sain.",
        "Unknown": "Données protéomiques non disponibles."
    },
    "pam50_subtype": {
        "Luminal A": "Sous-type moléculaire favorable, faible risque de récidive.",
        "Luminal B": "Sous-type plus agressif, nécessite chimiothérapie adjuvante.",
        "HER2-enriched": "Dépendant de HER2, répond bien aux thérapies ciblées.",
        "Basal-like": "Souvent triple négatif, agressif, nécessite chimiothérapie intensive.",
        "Normal-like": "Ressemble aux tissus sains, rare dans les cancers invasifs.",
        "Unknown": "Sous-type PAM50 non déterminé."
    },
    "tumor_stage": {
        "T1": "Stade précoce, petite tumeur (<2 cm).",
        "T2": "Tumeur moyenne (2–5 cm).",
        "T3": "Tumeur grande (>5 cm).",
        "T4": "Tumeur très grande ou envahissant la peau/muscle.",
        "Unknown": "Stade tumoral inconnu."
    },
    "cancer_type_detailed": {
        "Invasive Breast Carcinoma": "Cancer qui a envahi les tissus environnants.",
        "Ductal Carcinoma In Situ": "Cancer confiné aux canaux mammaires (non invasif).",
        "Unknown": "Type histologique inconnu."
    }
}
def generate_chunk(row):
    """
    Takes a row from the DataFrame and returns a readable text chunk.
    """
    # Start with patient ID
    chunk = f"Patient {row['patient_id']}:\n"

    # Add each biomarker with its explanation
    chunk += f"- ER Status: {row['er_status']} → {protein_descriptions['er_status'].get(row['er_status'], 'Inconnu')}\n"
    chunk += f"- PR Status: {row['pr_status']} → {protein_descriptions['pr_status'].get(row['pr_status'], 'Inconnu')}\n"
    chunk += f"- HER2 Status: {row['her2_status']} → {protein_descriptions['her2_status'].get(row['her2_status'], 'Inconnu')}\n"
    chunk += f"- RPPA Cluster: {row['rppa_cluster']} → {protein_descriptions['rppa_cluster'].get(row['rppa_cluster'], 'Inconnu')}\n"
    chunk += f"- PAM50 Subtype: {row['pam50_subtype']} → {protein_descriptions['pam50_subtype'].get(row['pam50_subtype'], 'Inconnu')}\n"
    chunk += f"- Tumor Stage: {row['tumor_stage']} → {protein_descriptions['tumor_stage'].get(row['tumor_stage'], 'Inconnu')}\n"
    chunk += f"- Cancer Type: {row['cancer_type_detailed']} → {protein_descriptions['cancer_type_detailed'].get(row['cancer_type_detailed'], 'Inconnu')}\n"

    # Add clinical implication summary
    implications = []
    if row['er_status'] == "Positive":
        implications.append("traitement hormonal recommandé")
    if row['her2_status'] == "Positive":
        implications.append("thérapie ciblée anti-HER2 nécessaire")
    if row['pam50_subtype'] in ["Luminal B", "HER2-enriched", "Basal-like"]:
        implications.append("chimiothérapie adjuvante probable")

    if implications:
        implication_text = ", ".join(implications)
        chunk += f"\nImplication clinique: {implication_text}. Suivi régulier conseillé."
    else:
        chunk += "\nImplication clinique: Profil favorable. Surveillance standard recommandée."

    return chunk
if __name__ == "__main__":
    import pandas as pd

    # Step 1: Load your cleaned data
    df = pd.read_csv("protein_cleaned.csv")

    # Make sure column names match exactly!
    print("Columns in your data:", df.columns.tolist())

    # Step 2: Generate chunks for all rows
    df["chunk_text"] = df.apply(generate_chunk, axis=1)

    # Step 3: Save to new CSV
    output_file = "protein_chunks.csv"
    df[["patient_id", "chunk_text"]].to_csv(output_file, index=False, encoding="utf-8")
    