import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

import models
import schemas
from database import get_db

router = APIRouter(prefix="/monuments", tags=["monuments"])


@router.post("", response_model=schemas.MonumentOut)
def create_monument(payload: schemas.MonumentCreate, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == payload.trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    monument = models.Monument(
        trip_id=payload.trip_id,
        name=payload.name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        description=payload.description,
        visited_at=payload.visited_at,
        is_favorite=payload.is_favorite,
        trivia_question=payload.trivia_question,
        trivia_answer=payload.trivia_answer,
    )
    db.add(monument)
    db.commit()
    db.refresh(monument)
    return monument


@router.get("/{monument_id}", response_model=schemas.MonumentOut)
def get_monument(monument_id: uuid.UUID, db: Session = Depends(get_db)):
    monument = (
        db.query(models.Monument)
        .options(joinedload(models.Monument.photos))
        .options(joinedload(models.Monument.conversations))
        .filter(models.Monument.id == monument_id)
        .first()
    )
    if monument is None:
        raise HTTPException(status_code=404, detail="Monument not found")
    return monument


@router.patch("/{monument_id}/favorite", response_model=schemas.MonumentOut)
def update_favorite(monument_id: uuid.UUID, payload: schemas.FavoriteUpdate, db: Session = Depends(get_db)):
    monument = db.query(models.Monument).filter(models.Monument.id == monument_id).first()
    if monument is None:
        raise HTTPException(status_code=404, detail="Monument not found")
    monument.is_favorite = payload.is_favorite
    db.commit()
    db.refresh(monument)
    return monument


@router.patch("/{monument_id}", response_model=schemas.MonumentOut)
def update_monument(monument_id: uuid.UUID, payload: schemas.MonumentAdminUpdate, db: Session = Depends(get_db)):
    monument = db.query(models.Monument).filter(models.Monument.id == monument_id).first()
    if monument is None:
        raise HTTPException(status_code=404, detail="Monument not found")
    if payload.trip_id is not None:
        monument.trip_id = payload.trip_id
    if payload.visited_at is not None:
        monument.visited_at = payload.visited_at
    if payload.trivia_question is not None:
        monument.trivia_question = payload.trivia_question
    if payload.trivia_answer is not None:
        monument.trivia_answer = payload.trivia_answer
    db.commit()
    db.refresh(monument)
    return monument


@router.patch("/{monument_id}/location", response_model=schemas.MonumentOut)
def update_location(monument_id: uuid.UUID, payload: schemas.LocationUpdate, db: Session = Depends(get_db)):
    monument = db.query(models.Monument).filter(models.Monument.id == monument_id).first()
    if monument is None:
        raise HTTPException(status_code=404, detail="Monument not found")
    monument.latitude = payload.latitude
    monument.longitude = payload.longitude
    db.commit()
    db.refresh(monument)
    return monument
