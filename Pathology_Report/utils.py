def risk_level(prob):
    if prob < 0.3:
        return "low"
    elif prob < 0.6:
        return "medium"
    else:
        return "high"

def patient_message(prob):
    if prob < 0.3:
        return (
            "L'analyse de l'image ne montre pas de signes fortement inquiétants. "
            "Un suivi médical régulier est conseillé."
        )
    elif prob < 0.6:
        return (
            "Certains éléments observés nécessitent une évaluation médicale plus approfondie. "
            "Nous vous recommandons de consulter un spécialiste."
        )
    else:
        return (
            "L'image présente des similitudes avec des cas à risque élevé. "
            "Veuillez consulter un médecin spécialiste dès que possible."
        )
