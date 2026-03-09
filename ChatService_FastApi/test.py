# test.py
try:
    from database import SessionLocal, ChatMessage
    print("Import successful!")
    
    db = SessionLocal()
    # This checks if the table exists
    count = db.query(ChatMessage).count()
    print(f"Connection worked! Total messages in DB: {count}")
    db.close()

except ImportError as e:
    print(f"Import Error: {e}")
except Exception as e:
    print(f"Database Error: {e}")