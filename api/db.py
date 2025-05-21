from sqlmodel import SQLModel, create_engine
from pathlib import Path

sqlite_full_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_full_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def drop_all_tables():
    if Path(sqlite_full_name).exists():
        print("Dropping all Tables...")
        SQLModel.metadata.drop_all(engine)


def create_db_and_tables():
    print("Creating Tables...")
    SQLModel.metadata.create_all(engine)
