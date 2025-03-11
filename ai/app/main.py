from fastapi import FastAPI
from app.endpoints import sentiment, prediction, nlp_query, chat

app = FastAPI(title="AI Microservices")

app.include_router(sentiment.router, prefix="/sentiment", tags=["Sentiment"])
app.include_router(prediction.router, prefix="/predict", tags=["Prediction"])
app.include_router(nlp_query.router, prefix="/nlp", tags=["NLP Query"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/")
async def read_root():
  return {"message": "Welcome to the AI Microservices"}