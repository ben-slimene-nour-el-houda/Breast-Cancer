import pandas as pd

# Fichiers
INPUT_FILE = r"C:\Users\EL MECHKAT\Desktop\clinical_data.csv"
OUTPUT_FILE = r"C:\Users\EL MECHKAT\Desktop\protein_cleaned.csv"

# Charger le fichier CSV
df = pd.read_csv(INPUT_FILE, sep="\t")
print("Fichier chargé")

# Normaliser les noms de colonnes
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# Colonnes importantes
cols = ["patient_id", "sample_id", "er_status", "pr_status", "her2_status",
        "rppa_cluster", "tumor_stage", "pam50_subtype", "cancer_type_detailed"]

# Garder seulement les colonnes existantes
df = df[[c for c in cols if c in df.columns]]

# Remplacer les valeurs manquantes par "Unknown"
df.fillna("Unknown", inplace=True)

# Normaliser le statut des récepteurs
def normalize(x):
    x = str(x).lower().strip()
    if x in ["positive", "pos", "1", "yes"]:
        return "Positive"
    if x in ["negative", "neg", "0", "no"]:
        return "Negative"
    return "Unknown"

for col in ["er_status", "pr_status", "her2_status"]:
    if col in df.columns:
        df[col] = df[col].apply(normalize)

# Supprimer les lignes sans patient_id ou sample_id
df = df[(df["patient_id"] != "Unknown") & (df["sample_id"] != "Unknown")]

# Supprimer les doublons
df.drop_duplicates(subset=["patient_id", "sample_id"], inplace=True)

# Sauvegarder le fichier nettoyé
df.to_csv(OUTPUT_FILE, index=False)
print("Données nettoyées et sauvegardées")
