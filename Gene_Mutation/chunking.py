import json


def chunk_patients(patients):
    chunks = []

    for p in patients:
        muts = p.get("Mutations", [])

        genes = sorted({m.get("Gene") for m in muts if m.get("Gene")})
        types = sorted({m.get("Mutation Type") for m in muts if m.get("Mutation Type")})
        dna = [m.get("ADN") for m in muts if m.get("ADN")]

        text = (
            "Patient with " + str(p.get("Mutation_Count")) + " gene mutations. "
            + "Genes affected: " + ", ".join(genes) + ". "
            + "Mutation types: " + ", ".join(types) + ". "
            + "FGA: " + f"{p.get('FGA'):.3f}."
        )

        chunks.append({
            "Patient_ID": p.get("Patient_ID"),
            "Sample_ID": p.get("Sample_ID"),
            "Text": text,
            "DNA": dna,
            "Pathways": p.get("Pathways", []),
            "Numeric": {
                "FGA": p.get("FGA"),
                "Mutation_Count": p.get("Mutation_Count")
            }
        })

    return chunks


if __name__ == "__main__":
    with open("patients_cleaned.json") as f:
        patients = json.load(f)

    chunks = chunk_patients(patients)

    with open("patient_chunks.json", "w") as f:
        json.dump(chunks, f, indent=2)

    print("chunks:", len(chunks))
