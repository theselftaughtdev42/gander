from sqlmodel import SQLModel, create_engine

sqlite_full_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_full_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    print("Creating Tables...")
    SQLModel.metadata.create_all(engine)
