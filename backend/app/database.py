"""Conexión SQLite y sesión de SQLAlchemy.

Capa 1: SQLite es la única fuente de verdad. Cuando exista integración real
con Arbitrum, el Safe/contrato Stylus pasará a ser la fuente de verdad para
saldos y ejecución de propuestas — ver TODO-ARBITRUM en app/routers/.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./junta.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
