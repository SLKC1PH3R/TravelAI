import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from config import settings
from database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(email: str, db: Session) -> models.User:
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


@router.get("/users", response_model=list[schemas.AdminUserOut])
def list_users(email: str, db: Session = Depends(get_db)):
    require_admin(email, db)
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return [
        schemas.AdminUserOut(
            **schemas.UserOut.model_validate(u).model_dump(),
            trips_count=len(u.trips),
        )
        for u in users
    ]


@router.patch("/users/{user_id}", response_model=schemas.AdminUserOut)
def update_user(user_id: uuid.UUID, payload: schemas.AdminUserUpdate, email: str, db: Session = Depends(get_db)):
    require_admin(email, db)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.anonymous_uuid is not None:
        user.anonymous_uuid = payload.anonymous_uuid
    if payload.snap_pseudo is not None:
        user.snap_pseudo = payload.snap_pseudo
    if payload.is_admin is not None:
        if user.email == settings.admin_email and not payload.is_admin:
            raise HTTPException(status_code=400, detail="Cannot revoke the primary admin account")
        user.is_admin = payload.is_admin
    db.commit()
    db.refresh(user)
    return schemas.AdminUserOut(**schemas.UserOut.model_validate(user).model_dump(), trips_count=len(user.trips))


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: uuid.UUID, email: str, db: Session = Depends(get_db)):
    require_admin(email, db)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.email == settings.admin_email:
        raise HTTPException(status_code=400, detail="Cannot delete the primary admin account")
    db.delete(user)
    db.commit()
