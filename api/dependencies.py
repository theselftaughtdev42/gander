from contextlib import asynccontextmanager
from .db import create_db_and_tables, engine
from fastapi import FastAPI
from sqlmodel import Session

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

def get_session():
    with Session(engine) as session:
        yield session