from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict
from pydantic import BaseModel
from ..db.database import db
import random

router = APIRouter(prefix="/api/bank", tags=["bank"])

# --- Models ---
class DashboardStats(BaseModel):
    total_portfolio: float
    active_loans: int
    pending_applications: int
    risk_level: str

class Application(BaseModel):
    id: int
    farmer_name: str
    farm_name: str
    amount: float
    term_months: int
    purpose: str
    credit_score: int
    status: str
    created_at: str
    # AI Analysis Fields
    yield_potential: str 
    risk_factors: List[str]
    ai_score_breakdown: Dict[str, int]

class ApprovalRequest(BaseModel):
    approved: bool

# --- Endpoints ---

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats():
    with db.get_connection() as conn:
        # Calculate Total Portfolio (Sum of all active loan amounts)
        portfolio_res = conn.execute("SELECT SUM(amount) as total FROM loan_requests WHERE status = 'active'").fetchone()
        total_portfolio = portfolio_res['total'] or 0
        
        # Active Loans Count
        active_res = conn.execute("SELECT COUNT(*) as count FROM loan_requests WHERE status = 'active'").fetchone()
        active_loans = active_res['count'] or 0
        
        # Pending Applications Count
        pending_res = conn.execute("SELECT COUNT(*) as count FROM loan_requests WHERE status = 'pending'").fetchone()
        pending_apps = pending_res['count'] or 0
        
        return DashboardStats(
            total_portfolio=total_portfolio,
            active_loans=active_loans,
            pending_applications=pending_apps,
            risk_level="Low" # Mock risk level for now
        )

@router.get("/applications", response_model=List[Application])
async def get_applications():
    with db.get_connection() as conn:
        # Join with farmers and farms to get names
        query = """
            SELECT lr.*, f.full_name as farmer_name, f.credit_score, fa.name as farm_name
            FROM loan_requests lr
            JOIN farms fa ON lr.farm_id = fa.id
            JOIN farmers f ON fa.farmer_id = f.id
            WHERE lr.status = 'pending'
            ORDER BY lr.created_at DESC
        """
        rows = conn.execute(query).fetchall()
        
        apps = []
        for row in rows:
            # Deterministic/Mock AI Analysis based on id
            yield_potential = "High" if row['credit_score'] > 700 else "Medium"
            risk_factors = []
            if row['credit_score'] < 650:
                risk_factors.append("Recent late payments")
                risk_factors.append("Low equity")
            else:
                risk_factors.append("Stable market demand")
                
            if row['amount'] > 5000:
                risk_factors.append("High capital exposure")

            apps.append(Application(
                id=row['id'],
                farmer_name=row['farmer_name'],
                farm_name=row['farm_name'],
                amount=row['amount'],
                term_months=row['term_months'],
                purpose=row['purpose'],
                credit_score=row['credit_score'],
                status=row['status'],
                created_at=row['created_at'],
                yield_potential=f"{random.randint(4,8)} tons/ha",
                risk_factors=risk_factors,
                ai_score_breakdown={
                    "Collateral": 85,
                    "History": row['credit_score'] // 10,
                    "Market": 90
                }
            ))
            
        return apps

@router.post("/applications/{app_id}/review")
async def review_application(app_id: int, review: ApprovalRequest):
    with db.get_connection() as conn:
        # Check if exists
        app = conn.execute("SELECT * FROM loan_requests WHERE id = ?", (app_id,)).fetchone()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
            
        new_status = 'waiting_signature' if review.approved else 'rejected'
        
        conn.execute("UPDATE loan_requests SET status = ? WHERE id = ?", (new_status, app_id))
        conn.commit()
        
        return {"message": f"Application {new_status}"}
