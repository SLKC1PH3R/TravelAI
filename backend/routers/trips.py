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
