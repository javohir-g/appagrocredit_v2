from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict
from pydantic import BaseModel
from ..db.database import db

router = APIRouter(prefix="/api/farmers", tags=["farmers"])

# --- Models ---
class FarmerSummary(BaseModel):
    total_debt: float
    active_credits: int
    credit_score: int
    total_paid: float

class FarmerProfile(BaseModel):
    id: int
    email: str
    full_name: str
    credit_score: int
    farm_name: str
    farm_size: float
    joined_date: str = "2023-01-15" # Mock or fetch
    
class Loan(BaseModel):
    id: int
    amount: float
    remaining: float
    rate: float = 12.0 # Hardcoded for now or fetch from DB if column added
    term_months: int
    status: str
    paid: float
    progress: int
    next_payment: float
    due_date: str

class LoanCreate(BaseModel):
    amount: float
    term_months: int
    purpose: str

class UtilityReading(BaseModel):
    type: str # electricity, gas, water
    value: float
    unit: str
    diff: float = 0 # Placeholder for monthly difference

class Recommendation(BaseModel):
    title: str
    message: str
    type: str

# --- Endpoints ---

@router.get("/profile", response_model=FarmerProfile)
async def get_profile():
    with db.get_connection() as conn:
        farmer = conn.execute("SELECT * FROM farmers WHERE id = 1").fetchone()
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
            
        farm = conn.execute("SELECT * FROM farms WHERE farmer_id = 1").fetchone()
        farm_name = farm['name'] if farm else "No Farm"
        farm_size = farm['size_acres'] if farm else 0.0
        
        return FarmerProfile(
            id=farmer['id'],
            email=farmer['email'],
            full_name=farmer['full_name'],
            credit_score=farmer['credit_score'],
            farm_name=farm_name,
            farm_size=farm_size,
            joined_date="15.01.2023" # Hardcoded for demo
        )

@router.get("/summary", response_model=FarmerSummary)
async def get_summary():
    # For V2 demo, we assume single farmer (ID 1)
    # In real app, getting from auth token
    with db.get_connection() as conn:
        farmer = conn.execute("SELECT * FROM farmers WHERE id = 1").fetchone()
        if not farmer:
            # Trigger seed if not found (just in case)
            db.seed_data(conn)
            farmer = conn.execute("SELECT * FROM farmers WHERE id = 1").fetchone()
            
        # Calc stats
        loans = conn.execute("SELECT * FROM loan_requests WHERE farm_id IN (SELECT id FROM farms WHERE farmer_id = 1)").fetchall()
        
        active_loans = [l for l in loans if l['status'] == 'active']
        active_credits = len(active_loans)
        
        total_debt = sum(l['amount'] for l in active_loans)
        
        # Calc total paid
        total_paid = 0
        for loan in active_loans:
            paid_res = conn.execute("SELECT SUM(amount) as total FROM payments WHERE loan_id = ?", (loan['id'],)).fetchone()
            total_paid += (paid_res['total'] or 0)
            
        return FarmerSummary(
            total_debt=total_debt,
            active_credits=active_credits,
            credit_score=farmer['credit_score'],
            total_paid=total_paid
        )

@router.get("/loans", response_model=List[Loan])
async def get_loans():
    loans_list = []
    with db.get_connection() as conn:
        # Get active loans for farmer 1
        loans = conn.execute("""
            SELECT lr.* 
            FROM loan_requests lr
            JOIN farms f ON lr.farm_id = f.id
            WHERE f.farmer_id = 1 AND lr.status IN ('active', 'pending', 'waiting_signature')
        """).fetchall()
        
        for loan in loans:
            paid_res = conn.execute("SELECT SUM(amount) as total FROM payments WHERE loan_id = ?", (loan['id'],)).fetchone()
            paid = paid_res['total'] or 0
            
            # Simple interest calculation for demo: 12% annual
            interest = loan['amount'] * 0.12 * (loan['term_months'] / 12)
            total_repayment = loan['amount'] + interest
            remaining = total_repayment - paid
            
            progress = int((paid / total_repayment) * 100) if total_repayment > 0 else 0
            monthly = total_repayment / loan['term_months']
            
            # Simulated due date
            due_date = "15.06.2024" 
            
            # For pending loans, everything is 0/mock
            if loan['status'] == 'pending':
                remaining = total_repayment
                paid = 0
                progress = 0
                due_date = "-"
            
            loans_list.append(Loan(
                id=loan['id'],
                amount=loan['amount'],
                remaining=round(remaining, 2),
                rate=12.0,
                term_months=loan['term_months'],
                status=loan['status'],
                paid=paid,
                progress=progress,
                next_payment=round(monthly, 2),
                due_date=due_date
            ))
            
    return loans_list

@router.post("/loans", response_model=Loan)
async def create_loan(loan_data: LoanCreate):
    with db.get_connection() as conn:
        # Get farm
        farm = conn.execute("SELECT id FROM farms WHERE farmer_id = 1").fetchone()
        if not farm:
            raise HTTPException(status_code=404, detail="Farm not found")
            
        # Insert
        cursor = conn.execute("""
            INSERT INTO loan_requests (farm_id, amount, term_months, purpose, status)
            VALUES (?, ?, ?, ?, 'pending')
        """, (farm['id'], loan_data.amount, loan_data.term_months, loan_data.purpose))
        loan_id = cursor.lastrowid
        
        # Return mock loan object
        monthly = (loan_data.amount + (loan_data.amount * 0.12 * (loan_data.term_months/12))) / loan_data.term_months
        
        return Loan(
            id=loan_id,
            amount=loan_data.amount,
            remaining=loan_data.amount + (loan_data.amount * 0.12 * (loan_data.term_months/12)),
            rate=12.0,
            term_months=loan_data.term_months,
            status='pending',
            paid=0,
            progress=0,
            next_payment=round(monthly, 2),
            due_date="-"
        )

@router.get("/utilities", response_model=List[UtilityReading])
async def get_utilities():
    readings = []
    with db.get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM utility_readings 
            WHERE farm_id IN (SELECT id FROM farms WHERE farmer_id = 1)
        """).fetchall()
        
        for row in rows:
            readings.append(UtilityReading(
                type=row['utility_type'],
                value=row['reading_value'],
                unit=row['unit'],
                diff=100 # Mock diff for now
            ))
    return readings

@router.get("/recommendations/latest", response_model=Recommendation)
async def get_latest_recommendation():
    with db.get_connection() as conn:
        row = conn.execute("""
            SELECT * FROM recommendations 
            WHERE farm_id IN (SELECT id FROM farms WHERE farmer_id = 1)
            ORDER BY created_at DESC LIMIT 1
        """).fetchone()
        
        if row:
            return Recommendation(
                title=row['title'],
                message=row['message'],
                type=row['type'] or "general"
            )
        return Recommendation(title="No Recommendations", message="Everything looks great!", type="general")

@router.post("/loans/{loan_id}/sign")
async def sign_loan(loan_id: int):
    with db.get_connection() as conn:
        # Verify loan exists and is in correct status
        loan = conn.execute("SELECT * FROM loan_requests WHERE id = ?", (loan_id,)).fetchone()
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        
        if loan['status'] != 'waiting_signature':
            raise HTTPException(status_code=400, detail="Loan is not ready for signature")
            
        # Update status to active
        conn.execute("UPDATE loan_requests SET status = 'active' WHERE id = ?", (loan_id,))
        conn.commit()
        
        return {"message": "Contract signed successfully", "status": "active"}

@router.get("/notifications")
async def get_notifications():
    notifications = []
    with db.get_connection() as conn:
        # Check for loans waiting signature
        pending_sign = conn.execute("""
            SELECT lr.*, f.name as farm_name 
            FROM loan_requests lr
            JOIN farms f ON lr.farm_id = f.id
            WHERE f.farmer_id = 1 AND lr.status = 'waiting_signature'
        """).fetchall()
        
        for loan in pending_sign:
            notifications.append({
                "id": f"sign_{loan['id']}",
                "title": "Action Required",
                "message": f"Loan application for ${loan['amount']:,.0f} approved! Please sign the contract.",
                "type": "alert",
                "link": "/farmer/loans"
            })
            
        # Check active loans
        active = conn.execute("""
             SELECT lr.* 
             FROM loan_requests lr
             JOIN farms f ON lr.farm_id = f.id
             WHERE f.farmer_id = 1 AND lr.status = 'active'
        """).fetchall()
        
        if active:
             notifications.append({
                "id": "active_summary",
                "title": "Monthly Update",
                "message": f"You have {len(active)} active credits. Next payment due in 15 days.",
                "type": "info",
                "link": "/farmer/loans"
            })
            
@router.post("/loans/{loan_id}/pay")
async def make_payment(loan_id: int, payment: Dict[str, float]):
    amount = payment.get('amount', 0)
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payment amount")

    with db.get_connection() as conn:
        # Verify loan
        loan = conn.execute("SELECT * FROM loan_requests WHERE id = ?", (loan_id,)).fetchone()
        if not loan or loan['status'] != 'active':
             raise HTTPException(status_code=400, detail="Loan not active or found")

        # Record payment
        conn.execute("INSERT INTO payments (loan_id, amount, payment_date) VALUES (?, ?, CURRENT_DATE)", 
                     (loan_id, amount))
        
        # Check if fully paid
        paid_res = conn.execute("SELECT SUM(amount) as total FROM payments WHERE loan_id = ?", (loan_id,)).fetchone()
        total_paid = paid_res['total'] or 0
        
        # Recalculate total repayment (same logic as in get_loans)
        interest = loan['amount'] * 0.12 * (loan['term_months'] / 12)
        total_repayment = loan['amount'] + interest
        
        if total_paid >= total_repayment - 0.01: # Small epsilon for float comparison
            # Fully paid - delete loan and payments
            conn.execute("DELETE FROM payments WHERE loan_id = ?", (loan_id,))
            conn.execute("DELETE FROM loan_requests WHERE id = ?", (loan_id,))
            
        conn.commit()
        
        return {"message": "Payment successful"}
