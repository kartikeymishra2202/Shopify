import os
from sqlalchemy import create_engine, Column, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import asyncio


from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if SQLALCHEMY_DATABASE_URL is None:
    raise RuntimeError("DATABASE_URL not found in .env file!")

engine_kwargs = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False, "timeout": 30}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ChatMessage(Base):
    __tablename__ = "store_chatmessage"  # This must match your Django table name
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer)
    receiver_id = Column(Integer)
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


def _save_chat_message_sync(sender_id: int, receiver_id: int, message: str) -> None:
    db = SessionLocal()
    try:
        new_msg = ChatMessage(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message,
        )
        db.add(new_msg)
        db.commit()
    finally:
        db.close()


async def save_chat_message(sender_id: int, receiver_id: int, message: str) -> None:
    await asyncio.to_thread(_save_chat_message_sync, sender_id, receiver_id, message)
