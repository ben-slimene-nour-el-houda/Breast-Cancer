import json


def preprocess(patients):
    data = []

    for p in patients:
        patient = {}
        patient["Patient_ID"] = p.get("Patient_ID")
        patient["Sample_ID"] = p.get("Sample_ID")

        muts = p.get("Mutations", [])
        clean_muts = []

        for m in muts:
            x = {}

            if m.get("Gene"):
                x["Gene"] = m.get("Gene")

            if m.get("Mutation Type"):
                x["Mutation Type"] = m.get("Mutation Type")

            if m.get("ADN"):
                x["ADN"] = m.get("ADN").upper()

            if x:
                clean_muts.append(x)

        patient["Mutations"] = clean_muts
        patient["Mutation_Count"] = len(clean_muts)

        fga = p.get("FGA")
        if fga is None:
            if clean_muts:
                fga = len(clean_muts) / 1000
            else:
                fga = 0.0
            if fga > 1:
                fga = 1.0

        patient["FGA"] = fga
        patient["Pathways"] = p.get("Pathways", [])

        data.append(patient)

    return data


if __name__ == "__main__":
    
    with open("patients_raw.json") as f:
        patients = json.load(f)

    print("preprocess")
    patients = preprocess(patients)

    with open("patients_cleaned.json", "w") as f:
        json.dump(patients, f, indent=2)

    print("done", len(patients))
