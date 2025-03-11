from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/")
async def predict(input: str = Query(..., description="Input for prediction")):
  prediction_result = f"Predicted output for '{input}"
  return {"input": input, "prediction": prediction_result}
