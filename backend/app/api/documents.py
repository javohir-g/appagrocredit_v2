from fastapi import APIRouter
from pydantic import BaseModel
import datetime

router = APIRouter(prefix="/api/documents", tags=["documents"])

class DocumentRequest(BaseModel):
    application_id: int
    farmer_name: str
    amount: float
    date: str = datetime.date.today().isoformat()

class DocumentResponse(BaseModel):
    title: str
    content: str

@router.post("/contract", response_model=DocumentResponse)
async def generate_contract(req: DocumentRequest):
    return DocumentResponse(
        title="LOAN AGREEMENT",
        content=f"""
LOAN AGREEMENT

This Agreement is made on {req.date} between AgroCredit Bank ("Lender") and {req.farmer_name} ("Borrower").

1. LOAN AMOUNT
The Lender agrees to lend the Borrower the principal sum of ${req.amount:,.2f}.

2. TERMS
The loan shall be repaid in monthly installments as per the agreed schedule.

3. AI ASSESSMENT
The loan has been approved based on an AI-driven assessment of crop yield potential and creditworthiness.

4. COLLATERAL
The Borrower grants the Lender a security interest in the future crop harvest of the indicated fields.

Signed:
___________________ (Bank)
___________________ ({req.farmer_name})
        """
    )

@router.post("/rejection", response_model=DocumentResponse)
async def generate_rejection(req: DocumentRequest):
    return DocumentResponse(
        title="NOTICE OF ADVERSE ACTION",
        content=f"""
NOTICE OF ADVERSE ACTION

Date: {req.date}
To: {req.farmer_name}

Thank you for your application for a loan of ${req.amount:,.2f}.

After careful review by our AI Risk Assessment model and credit officers, we regret to inform you that we are unable to approve your request at this time.

Principal reasons for denial:
- Insufficient historical crop yield data
- High risk factors identified in market analysis

You have the right to request a full copy of your credit report within 60 days.

Sincerely,
AgroCredit AI Risk Team
        """
    )
