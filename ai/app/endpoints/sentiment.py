from fastapi import APIRouter, Query
from textblob import TextBlob

router = APIRouter()

@router.get("/")
async def analyze_sentiment(text: str = Query(..., description="Text to analyze")):
  blob = TextBlob(text)
  sentiment = blob.sentiment
  return {
    "polarity": sentiment.polarity,
    "subjectivity": sentiment.subjectivity
  }