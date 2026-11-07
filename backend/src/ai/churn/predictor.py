"""
BusinessOS AI — Customer Churn Prediction Model

AI/ML Concepts Demonstrated:
- Feature Engineering from business data
- Scikit-learn Pipeline with StandardScaler + LogisticRegression / RandomForest
- Model Persistence (joblib)
- Rule-Based Fallback (no training data needed)
- Risk Scoring (0–100) with explainability
"""
import json
import math
from datetime import datetime, timezone, timedelta
from typing import Optional

import numpy as np
from prisma import Prisma

from src.core.config import settings


# ── Feature Engineering ────────────────────────────────────

def extract_customer_features(customer, days_since_last_purchase: int) -> dict:
    """
    Convert raw customer data into ML features.
    This is Feature Engineering — a core ML concept.
    """
    recency   = days_since_last_purchase                              # Recency (days)
    frequency = customer.purchase_count                               # Frequency
    monetary  = customer.total_spending                               # Monetary value
    avg_order = customer.avg_order_value if customer.avg_order_value > 0 else 0

    # Derived features
    purchase_velocity = frequency / max(recency, 1) * 30             # Purchases per month
    spend_per_day     = monetary / max(recency, 1)                    # Avg spend per day

    return {
        "recency":           recency,
        "frequency":         frequency,
        "monetary":          monetary,
        "avg_order_value":   avg_order,
        "purchase_velocity": purchase_velocity,
        "spend_per_day":     spend_per_day,
    }


# ── Rule-Based Churn Scoring (works without training data) ─

def rule_based_churn_score(features: dict) -> tuple[int, str, list, list]:
    """
    Rule-based churn scoring using RFM (Recency, Frequency, Monetary) model.
    
    RFM is a proven marketing analytics model:
    - Recency:   How recently did the customer buy?
    - Frequency: How often do they buy?
    - Monetary:  How much do they spend?
    
    Returns: (risk_score 0-100, risk_level, reasons, recommended_actions)
    """
    score = 0
    reasons = []
    actions = []

    recency   = features["recency"]
    frequency = features["frequency"]
    monetary  = features["monetary"]
    velocity  = features["purchase_velocity"]

    # ── Recency scoring (40 points max) ──────────────────
    if recency > 180:
        score += 40
        reasons.append(f"No purchase in {recency} days (6+ months inactive)")
        actions.append("Send a 'We miss you' re-engagement email with a 20% discount coupon")
    elif recency > 90:
        score += 25
        reasons.append(f"No purchase in {recency} days (3+ months inactive)")
        actions.append("Send a personalised product recommendation based on past purchases")
    elif recency > 45:
        score += 10
        reasons.append(f"No purchase in {recency} days (1.5 months)")
        actions.append("Send a gentle reminder or newsletter with new arrivals")

    # ── Frequency scoring (30 points max) ─────────────────
    if frequency == 0:
        score += 30
        reasons.append("Customer has never completed a purchase")
        actions.append("Offer a first-purchase incentive or free shipping")
    elif frequency == 1:
        score += 20
        reasons.append("Only 1 purchase — single-transaction customer at high risk")
        actions.append("Trigger a post-purchase follow-up with a loyalty reward")
    elif frequency <= 3:
        score += 10
        reasons.append("Low purchase frequency (≤3 orders)")
        actions.append("Enrol customer in a loyalty programme")

    # ── Monetary scoring (20 points max) ──────────────────
    if monetary < 500:
        score += 20
        reasons.append("Very low total spending (< ₹500)")
        actions.append("Show value-for-money products that match their budget")
    elif monetary < 2000:
        score += 10
        reasons.append("Below-average total spending")
        actions.append("Offer bundle deals to increase order value")

    # ── Velocity scoring (10 points max) ──────────────────
    if velocity < 0.1 and frequency > 1:
        score += 10
        reasons.append("Declining purchase rate — buying less frequently over time")
        actions.append("Re-engage with a time-limited flash sale notification")

    # Clamp score to 0–100
    score = min(100, max(0, score))

    # Risk level classification
    if score >= 70:
        risk_level = "HIGH"
    elif score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    if not reasons:
        reasons.append("Customer is actively engaged with regular purchases")
        actions.append("Maintain engagement with loyalty rewards and exclusive offers")

    return score, risk_level, reasons, actions


# ── ML Model Churn Scoring (scikit-learn) ──────────────────

def ml_based_churn_score(features: dict) -> Optional[int]:
    """
    Try to use a trained scikit-learn model for scoring.
    Falls back to None if model is not trained yet.
    
    Model pipeline:
      StandardScaler → RandomForestClassifier
    
    This demonstrates:
    - Supervised learning
    - Pipeline design
    - Model persistence with joblib
    """
    try:
        import joblib
        import os

        model_path = os.path.join(os.path.dirname(__file__), "churn_model.joblib")
        if not os.path.exists(model_path):
            return None

        model = joblib.load(model_path)
        X = np.array([[
            features["recency"],
            features["frequency"],
            features["monetary"],
            features["avg_order_value"],
            features["purchase_velocity"],
            features["spend_per_day"],
        ]])

        # Get probability of churn (class=1)
        prob = model.predict_proba(X)[0][1]
        return int(prob * 100)

    except Exception:
        return None


# ── Train Model from DB Data ────────────────────────────────

async def train_churn_model(db: Prisma, business_id: int) -> dict:
    """
    Train a churn prediction model using historical customer data.
    
    ML Pipeline:
    1. Load customer + sales data from Neon PostgreSQL
    2. Feature engineering (RFM features)
    3. Auto-label using rule-based scoring (self-supervised)
    4. StandardScaler + RandomForestClassifier pipeline
    5. Persist model with joblib
    
    Demonstrates: supervised learning, pipelines, model training.
    """
    try:
        import joblib
        import os
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.pipeline import Pipeline
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import classification_report

        customers = await db.customer.find_many(
            where={"business_id": business_id}
        )

        if len(customers) < 10:
            return {"success": False, "message": "Need at least 10 customers to train the model"}

        now = datetime.now(timezone.utc)
        X_rows = []
        y_labels = []

        for c in customers:
            last = c.last_purchase
            days = (now - last).days if last else 365

            features = extract_customer_features(c, days)
            score, risk_level, _, _ = rule_based_churn_score(features)

            X_rows.append([
                features["recency"],
                features["frequency"],
                features["monetary"],
                features["avg_order_value"],
                features["purchase_velocity"],
                features["spend_per_day"],
            ])
            # Label: 1 = churned (HIGH risk), 0 = retained
            y_labels.append(1 if risk_level == "HIGH" else 0)

        X = np.array(X_rows)
        y = np.array(y_labels)

        # Need both classes
        if len(set(y)) < 2:
            return {"success": False, "message": "Not enough churn variation to train model"}

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")),
        ])
        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        report = classification_report(y_test, y_pred, output_dict=True)

        model_path = os.path.join(os.path.dirname(__file__), "churn_model.joblib")
        joblib.dump(pipeline, model_path)

        return {
            "success": True,
            "message": f"Model trained on {len(customers)} customers",
            "accuracy": round(report.get("accuracy", 0) * 100, 1),
            "precision": round(report.get("1", {}).get("precision", 0) * 100, 1),
            "recall":    round(report.get("1", {}).get("recall", 0) * 100, 1),
            "training_samples": len(customers),
        }

    except Exception as e:
        return {"success": False, "message": str(e)}


# ── Main Prediction Entry Point ─────────────────────────────

async def predict_churn(db: Prisma, business_id: int, top_n: int = 10) -> list:
    """
    Predict churn risk for all customers in a business.
    Uses ML model if trained, falls back to rule-based scoring.
    Saves predictions to ChurnPrediction table.
    """
    now = datetime.now(timezone.utc)

    customers = await db.customer.find_many(
        where={"business_id": business_id},
        order={"last_purchase": "asc"}
    )

    predictions = []

    for customer in customers:
        last = customer.last_purchase
        days_since = (now - last).days if last else 365

        features = extract_customer_features(customer, days_since)

        # Try ML model first, fallback to rules
        ml_score = ml_based_churn_score(features)
        if ml_score is not None:
            rule_score, risk_level, reasons, actions = rule_based_churn_score(features)
            final_score = int(0.6 * ml_score + 0.4 * rule_score)  # Ensemble blend
            # Re-classify risk with final score
            if final_score >= 70:
                risk_level = "HIGH"
            elif final_score >= 40:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
        else:
            final_score, risk_level, reasons, actions = rule_based_churn_score(features)

        # Persist prediction (delete+create pattern, since upsert needs @@unique)
        existing = await db.churnprediction.find_first(
            where={"customer_id": customer.id, "business_id": business_id}
        )
        if existing:
            await db.churnprediction.update(
                where={"id": existing.id},
                data={
                    "risk_score": final_score,
                    "risk_level": risk_level,
                    "reasons": json.dumps(reasons),
                    "recommended_actions": json.dumps(actions),
                }
            )
        else:
            await db.churnprediction.create(
                data={
                    "customer_id": customer.id,
                    "business_id": business_id,
                    "risk_score": final_score,
                    "risk_level": risk_level,
                    "reasons": json.dumps(reasons),
                    "recommended_actions": json.dumps(actions),
                }
            )

        predictions.append({
            "customer_id":           customer.id,
            "customer_name":         customer.name,
            "risk_score":            final_score,
            "risk_level":            risk_level,
            "days_since_purchase":   days_since,
            "total_spending":        customer.total_spending,
            "purchase_count":        customer.purchase_count,
            "reasons":               reasons,
            "recommended_actions":   actions,
            "model_used":            "ml+rules" if ml_score is not None else "rules",
        })

    # Sort by risk score desc, return top N
    predictions.sort(key=lambda x: x["risk_score"], reverse=True)
    return predictions[:top_n]
