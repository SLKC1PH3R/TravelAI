from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import and_
from sqlalchemy.orm import Session

import gemini_client
import models
import schemas
import storage
from database import get_db

router = APIRouter(prefix="/analyze", tags=["analyze"])


def get_or_create_user(db: Session, anonymous_uuid: str) -> models.User:
    user = db.query(models.User).filter(models.User.anonymous_uuid == anonymous_uuid).first()
    if user is None:
        user = models.User(anonymous_uuid=anonymous_uuid)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def get_or_create_trip(db: Session, user: models.User, country: str, city: str) -> models.Trip:
    day_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = day_start + timedelta(days=1)

    trip = (
        db.query(models.Trip)
        .filter(
            and_(
                models.Trip.user_id == user.id,
                models.Trip.country == country,
                models.Trip.city == city,
                models.Trip.started_at >= day_start,
                models.Trip.started_at < day_end,
            )
        )
        .first()
    )
    if trip is None:
        trip = models.Trip(user_id=user.id, country=country, city=city, title=f"{city}, {country}")
        db.add(trip)
        db.commit()
        db.refresh(trip)
    return trip


@router.post("", response_model=schemas.AnalyzeResponse)
def analyze(payload: schemas.AnalyzeRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.uuid)

    name, country, city, description, anecdote, answer, trivia_question, trivia_answer = (
        "Lieu inconnu",
        "Inconnu",
        "Inconnu",
        None,
        None,
        "",
        None,
        None,
    )

    if payload.image_base64:
        result = gemini_client.analyze_image(payload.image_base64, payload.question)
        name = result.get("name", name)
        country = result.get("country", country)
        city = result.get("city", city)
        description = result.get("description")
        anecdote = result.get("anecdote")
        answer = result.get("answer", "")
        trivia_question = result.get("trivia_question")
        trivia_answer = result.get("trivia_answer")
    else:
        answer = "Aucune image fournie, je n'ai pas pu identifier de monument."

    trip = get_or_create_trip(db, user, country, city)

    full_description = description
    if anecdote:
        full_description = f"{description}\n\nAnecdote : {anecdote}" if description else anecdote

    monument = models.Monument(
        trip_id=trip.id,
        name=name,
        latitude=payload.latitude or 0.0,
        longitude=payload.longitude or 0.0,
        description=full_description,
        trivia_question=trivia_question,
        trivia_answer=trivia_answer,
    )
    db.add(monument)
    db.commit()
    db.refresh(monument)

    if user.photo_consent and payload.image_base64:
        filename, thumb_filename = storage.save_photo(user.anonymous_uuid, payload.image_base64)
        photo = models.Photo(
            monument_id=monument.id,
            filename=filename,
            thumbnail_filename=thumb_filename,
            stored=True,
        )
        db.add(photo)
        db.commit()

    conversation = models.Conversation(
        monument_id=monument.id,
        question=payload.question,
        answer=answer,
    )
    db.add(conversation)
    db.commit()

    storage.write_metadata_cache(
        user.anonymous_uuid,
        {"anonymous_uuid": user.anonymous_uuid, "last_monument": name, "last_trip": f"{city}, {country}"},
    )

    return schemas.AnalyzeResponse(
        answer=answer,
        monument_id=monument.id,
        trip_id=trip.id,
        monument_name=name,
    )
