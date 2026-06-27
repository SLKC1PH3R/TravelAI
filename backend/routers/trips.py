import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

import models
import schemas
from database import get_db

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=list[schemas.TripOut])
def list_trips(uuid: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.anonymous_uuid == uuid).first()
    if user is None:
        return []
    return (
        db.query(models.Trip)
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.photos))
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.conversations))
        .filter(models.Trip.user_id == user.id)
        .order_by(models.Trip.started_at.desc())
        .all()
    )


@router.post("", response_model=schemas.TripOut)
def create_trip(payload: schemas.TripCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.anonymous_uuid == payload.uuid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    trip = models.Trip(
        user_id=user.id,
        country=payload.country,
        city=payload.city,
        title=payload.title,
        started_at=payload.started_at,
        ended_at=payload.ended_at,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: uuid.UUID, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.monuments:
        raise HTTPException(status_code=400, detail="Trip still has monuments, reassign them first")
    db.delete(trip)
    db.commit()


@router.post("/merge", response_model=schemas.TripOut)
def merge_trips(payload: schemas.TripMergeRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.anonymous_uuid == payload.uuid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    monuments = (
        db.query(models.Monument)
        .join(models.Trip, models.Monument.trip_id == models.Trip.id)
        .filter(
            models.Trip.user_id == user.id,
            models.Monument.visited_at >= payload.start_date,
            models.Monument.visited_at <= payload.end_date,
        )
        .all()
    )
    if not monuments:
        raise HTTPException(status_code=404, detail="No monuments found in this date range")

    old_trip_ids = {m.trip_id for m in monuments}

    merged_trip = models.Trip(
        user_id=user.id,
        country=payload.country,
        city=payload.city,
        started_at=payload.start_date,
        ended_at=payload.end_date,
        title=payload.title,
    )
    db.add(merged_trip)
    db.flush()

    for monument in monuments:
        monument.trip_id = merged_trip.id
    db.commit()

    db.query(models.Trip).filter(
        models.Trip.id.in_(old_trip_ids),
        ~models.Trip.id.in_(db.query(models.Monument.trip_id).distinct()),
    ).delete(synchronize_session=False)
    db.commit()

    db.refresh(merged_trip)
    return (
        db.query(models.Trip)
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.photos))
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.conversations))
        .filter(models.Trip.id == merged_trip.id)
        .first()
    )


@router.get("/{trip_id}", response_model=schemas.TripOut)
def get_trip(trip_id: uuid.UUID, db: Session = Depends(get_db)):
    trip = (
        db.query(models.Trip)
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.photos))
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.conversations))
        .filter(models.Trip.id == trip_id)
        .first()
    )
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
