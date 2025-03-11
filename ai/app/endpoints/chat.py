# ai/app/endpoints/chat.py

from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/")
async def chat(message: str = Query(..., description="User's chat message")):
    # Dummy chat response; integrate with an actual chat model later
    response = f"Hello! You said: '{message}'. How can I help you further?"
    return {"message": message, "response": response}
