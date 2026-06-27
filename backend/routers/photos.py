import os
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import models
import schemas
import storage
from database import get_db

router = APIRouter(prefix="/photos", tags=["photos"])


def _anonymous_uuid_for_photo(db: Session, photo: models.Photo) -> str:
    monument = db.query(models.Monument).filter(models.Monument.id == photo.monument_id).first()
    trip = db.query(models.Trip).filter(models.Trip.id == monument.trip_id).first()
    user = db.query(models.User).filter(models.User.id == trip.user_id).first()
    return user.anonymous_uuid


@router.get("/monument/{monument_id}", response_model=list[schemas.PhotoOut])
def list_photos(monument_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(models.Photo).filter(models.Photo.monument_id == monument_id).all()


@router.post("/monument/{monument_id}", response_model=schemas.PhotoOut)
def add_photo(monument_id: uuid.UUID, payload: schemas.PhotoUpload, db: Session = Depends(get_db)):
    monument = db.query(models.Monument).filter(models.Monument.id == monument_id).first()
    if monument is None:
        raise HTTPException(status_code=404, detail="Monument not found")
    trip = db.query(models.Trip).filter(models.Trip.id == monument.trip_id).first()
    user = db.query(models.User).filter(models.User.id == trip.user_id).first()

    filename, thumbnail_filename = storage.save_photo(user.anonymous_uuid, payload.image_base64)
    photo = models.Photo(
        monument_id=monument.id,
        filename=filename,
        thumbnail_filename=thumbnail_filename,
        stored=True,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/{photo_id}", status_code=204)
def delete_photo(photo_id: uuid.UUID, db: Session = Depends(get_db)):
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    db.delete(photo)
    db.commit()


@router.get("/{photo_id}/file")
def get_photo_file(photo_id: uuid.UUID, db: Session = Depends(get_db)):
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if photo is None or not photo.stored:
        raise HTTPException(status_code=404, detail="Photo not found")
    anonymous_uuid = _anonymous_uuid_for_photo(db, photo)
    path = storage.photo_path(anonymous_uuid, photo.filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File missing on disk")
    return FileResponse(path)


@router.get("/{photo_id}/thumbnail")
def get_photo_thumbnail(photo_id: uuid.UUID, db: Session = Depends(get_db)):
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if photo is None or not photo.stored or not photo.thumbnail_filename:
        raise HTTPException(status_code=404, detail="Thumbnail not found")
    anonymous_uuid = _anonymous_uuid_for_photo(db, photo)
    path = storage.thumbnail_path(anonymous_uuid, photo.thumbnail_filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File missing on disk")
    return FileResponse(path)
