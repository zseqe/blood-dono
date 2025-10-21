# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, donors, hospitals
from .models import create_db_tables
import logging

app = FastAPI(
    title="Smart Blood Donor Platform API",
    description="API for matching blood donors with hospital requests using AI.",
    version="1.0.0"
)

origins = [ "http://localhost:3000", ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn.error")

@app.on_event("startup")
async def on_startup():
    try:
        create_db_tables()
        logger.info("Database tables ensured on startup.")
    except Exception as e:
        logger.exception("Failed to create/ensure database tables on startup: %s", e)

app.include_router(auth.router)
app.include_router(hospitals.router)
app.include_router(donors.router)

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "API is running"}