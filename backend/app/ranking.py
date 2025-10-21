# backend/app/ranking.py
import pandas as pd
import numpy as np
from datetime import datetime
from .models import BloodType
from typing import List, Dict, Any
from .schemas import MatchExplanation

COMPATIBILITY_MATRIX = { "A+": ["A+", "A-", "O+", "O-"], "A-": ["A-", "O-"], "B+": ["B+", "B-", "O+", "O-"], "B-": ["B-", "O-"], "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], "AB-": ["A-", "B-", "AB-", "O-"], "O+": ["O+", "O-"], "O-": ["O-"], }

def get_compatible_types(blood_type_needed: BloodType | str) -> List[str]:
    bt_value = blood_type_needed.value if isinstance(blood_type_needed, BloodType) else blood_type_needed
    return COMPATIBILITY_MATRIX.get(bt_value, [])

def calculate_features(donors: List[Any], hospital_location: str) -> pd.DataFrame:
    features = []; hospital_city = hospital_location.split(',')[0].strip().lower() if ',' in hospital_location else hospital_location.lower()
    for donor in donors:
        days_since_last = 999
        if donor.last_donation_date: days_since_last = (datetime.now() - donor.last_donation_date).days
        if days_since_last < 90: continue
        donor_city = donor.location.split(',')[0].strip().lower() if ',' in donor.location else donor.location.lower()
        is_local = 1.0 if donor_city == hospital_city else 0.0
        features.append({ "donor": donor, "Reliability": donor.reliability_score, "Fatigue": donor.fatigue_level, "Days Since Donation": days_since_last, "Is Local": is_local, })
    if not features: return pd.DataFrame()
    return pd.DataFrame(features)

def rank_donors(donors_df: pd.DataFrame) -> List[Dict[str, Any]]:
    if donors_df.empty: return []
    weights = { 'Reliability': 0.6, 'Is Local': 0.3, 'Fatigue': -0.1, 'Days Since Donation': 0.05 / 365 }
    scores = ( donors_df['Reliability'] * weights['Reliability'] + donors_df['Is Local'] * weights['Is Local'] + donors_df['Fatigue'] * weights['Fatigue'] + (donors_df['Days Since Donation'] * weights['Days Since Donation']) ); scores = scores.clip(lower=0)
    min_score, max_score = scores.min(), scores.max()
    if max_score > min_score: donors_df['probability_score'] = (scores - min_score) / (max_score - min_score)
    else: donors_df['probability_score'] = 0.5 if len(donors_df) > 0 else 0.0
    donors_df['probability_score'] = donors_df['probability_score'].fillna(0.5)
    donors_df = donors_df.sort_values(by="probability_score", ascending=False).reset_index()
    ranked_results = []
    for i, row in donors_df.iterrows():
        shap_factors: List[MatchExplanation] = [
            MatchExplanation(feature="Reliability", value=row.Reliability, impact=row.Reliability * weights['Reliability']),
            MatchExplanation(feature="Location", value=row['Is Local'], impact=row['Is Local'] * weights['Is Local']),
            MatchExplanation(feature="Fatigue", value=row.Fatigue, impact=row.Fatigue * weights['Fatigue'])
        ]
        sorted_factors = sorted(shap_factors, key=lambda x: abs(x.impact), reverse=True)
        top_positive = next((f for f in sorted_factors if f.impact > 0.01), None)
        top_negative = next((f for f in sorted_factors if f.impact < -0.01), None)
        explanation_parts = []
        if top_positive:
            feature_value_text = f" ({top_positive.value*100:.0f}% score)" if top_positive.feature == "Reliability" else ""
            explanation_parts.append(f"Primary positive factor: **{top_positive.feature}**{feature_value_text}.")
        if row['Is Local'] > 0 and (not top_positive or top_positive.feature != "Location"): explanation_parts.append("Good proximity (same city).")
        if top_negative:
             if top_negative.feature == "Fatigue": explanation_parts.append(f"Rank slightly lowered by fatigue level ({row.Fatigue:.2f}).")
        elif row['Is Local'] == 0 and (not top_positive or top_positive.feature != "Location"): explanation_parts.append("Located in a different city.")
        human_insight = f"Rank #{i+1}. " + " ".join(explanation_parts)
        if not explanation_parts: human_insight = f"Rank #{i+1}. Score based on reliability, location, and fatigue."
        ranked_results.append({ "donor": row.donor, "probability_score": row.probability_score, "rank": i + 1, "explanation_human": human_insight.strip(), "explanation_shap": shap_factors, })
    return ranked_results