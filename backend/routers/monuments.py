import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

import models
import schemas
from database import get_db

router = APIRouter(prefix="/monuments", tags=["monuments"])


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
