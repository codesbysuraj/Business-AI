"""
BusinessOS AI — Churn Prediction Router
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.ai.churn.predictor import predict_churn, train_churn_model

router = APIRouter()


@router.get("/predictions")
async def get_churn_predictions(
    top_n: int = 10,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Get churn risk predictions for all customers.
    Uses ML model (RandomForest) if trained, else rule-based RFM scoring.
    """
    predictions = await predict_churn(db, current_user.business_id, top_n)
    
    high_risk   = [p for p in predictions if p["risk_level"] == "HIGH"]
    medium_risk = [p for p in predictions if p["risk_level"] == "MEDIUM"]
    low_risk    = [p for p in predictions if p["risk_level"] == "LOW"]

    return {
        "predictions": predictions,
        "summary": {
            "total_analyzed": len(predictions),
            "high_risk_count": len(high_risk),
            "medium_risk_count": len(medium_risk),
            "low_risk_count": len(low_risk),
            "avg_risk_score": round(
                sum(p["risk_score"] for p in predictions) / len(predictions), 1
            ) if predictions else 0,
        }
    }


@router.post("/train")
async def train_model(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Train the churn prediction ML model (RandomForest) on your customer data.
    Uses scikit-learn Pipeline: StandardScaler → RandomForestClassifier.
    Auto-labels data using RFM rules (self-supervised approach).
    """
    result = await train_churn_model(db, current_user.business_id)
    return result
