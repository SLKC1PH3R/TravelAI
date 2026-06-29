import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from config import settings
from database import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def get_me(uuid: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.anonymous_uuid == uuid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}/consent", response_model=schemas.UserOut)
def update_consent(user_id: uuid.UUID, payload: schemas.ConsentUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.photo_consent = payload.photo_consent
    db.commit()
    db.refresh(user)
    return user


@router.get("/by-email", response_model=schemas.UserOut)
def get_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if email == settings.admin_email and not user.is_admin:
        user.is_admin = True
        db.commit()
        db.refresh(user)
    return user


@router.post("/onboarding", response_model=schemas.UserOut)
def onboarding(payload: schemas.OnboardingRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.anonymous_uuid == payload.login).first()
    if user is None:
        user = models.User(anonymous_uuid=payload.login)
        db.add(user)
    user.email = payload.email
    user.name = payload.name
    user.avatar_url = payload.avatar_url
    user.snap_pseudo = payload.pseudo
    if payload.email == settings.admin_email:
        user.is_admin = True
    db.commit()
    db.refresh(user)
    return user
