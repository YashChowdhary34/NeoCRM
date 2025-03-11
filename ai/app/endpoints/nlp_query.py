from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/")
async def query(text: str = Query(..., description="Natural language query input")):
  result = f"Result for query '{text}'"
  return {"query": text, "result": result}