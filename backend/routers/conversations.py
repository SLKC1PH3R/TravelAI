import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import gemini_client
import models
import schemas
from database import get_db

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.get("/monument/{monument_id}", response_model=list[schemas.ConversationOut])
def list_conversations(monument_id: uuid.UUID, db: Session = Depends(get_db)):
    return (
        db.query(models.Conversation)
        .filter(models.Conversation.monument_id == monument_id)
        .order_by(models.Conversation.created_at.asc())
        .all()
    )


@router.post("/monument/{monument_id}", response_model=schemas.ConversationOut)
def ask_followup(monument_id: uuid.UUID, question: str, db: Session = Depends(get_db)):
    monument = db.query(models.Monument).filter(models.Monument.id == monument_id).first()
    if monument is None:
        raise HTTPException(status_code=404, detail="Monument not found")
    trip = db.query(models.Trip).filter(models.Trip.id == monument.trip_id).first()

    answer = gemini_client.ask_followup(
        monument_name=monument.name,
        city=trip.city,
        country=trip.country,
        description=monument.description or "",
        question=question,
    )

    conversation = models.Conversation(monument_id=monument.id, question=question, answer=answer)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation
