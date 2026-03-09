import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from manager import manager
from auth_handler import verify_django_token 
from database import SessionLocal, ChatMessage, save_chat_message


app = FastAPI()

@app.websocket("/ws/chat")
async def websocket_endpoint(
    websocket: WebSocket, 
    token: str = Query(...),
    target_id: int = Query(...) # Recipient ID from the frontend URL
):
    # 1. Authenticate User via JWT
    user_data = await verify_django_token(token)
    if not user_data:
        # standard WebSocket close code for Policy Violation
        await websocket.close(code=1008)
        return

    user_id = int(user_data["user_id"])
    
    # 2. Register connection in the Manager
    await manager.connect(user_id, websocket)

    # 3. Fetch Private Chat History
    db = SessionLocal()
    try:
        # We filter for messages where (Me -> Target) OR (Target -> Me)
        # This keeps conversations separated for the Admin
        history = db.query(ChatMessage).filter(
            ((ChatMessage.sender_id == user_id) & (ChatMessage.receiver_id == target_id)) |
            ((ChatMessage.sender_id == target_id) & (ChatMessage.receiver_id == user_id))
        ).order_by(ChatMessage.timestamp.asc()).all()

        history_data = [
            {
                "sender_id": m.sender_id, 
                "message": m.message, 
                "timestamp": m.timestamp.isoformat() if m.timestamp else None
            } 
            for m in history
        ]
        
        # Send history payload to React
        await websocket.send_json({"type": "history", "data": history_data})
    except Exception as e:
        print(f"Error fetching history: {e}")
    finally:
        db.close()

    # 4. Listen for incoming messages
    try:
        while True:
            data = await websocket.receive_json()
            receiver_id = int(data.get("receiver_id"))
            message_text = data.get("message")

            # Prepare payload to send to the recipient
            payload = {
                "sender_id": user_id,
                "message": message_text,
                "type": "message" 
            }

            # Send Real-Time via Connection Manager
            await manager.send_private_message(payload, receiver_id)
            
            # Persist in background without blocking websocket flow
            asyncio.create_task(save_chat_message(user_id, receiver_id, message_text))

    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        manager.disconnect(user_id)
