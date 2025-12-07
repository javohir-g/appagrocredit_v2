from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import farmers, bank, documents

app = FastAPI(title="AgroCredit V2 API")

# CORS setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://agroscore-app.onrender.com",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farmers.router)
app.include_router(bank.router)
app.include_router(documents.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AgroCredit V2 API"}
