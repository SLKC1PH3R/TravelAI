import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PhotoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    filename: str
    thumbnail_filename: str | None
    taken_at: datetime
    stored: bool


class ConversationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question: str
    answer: str
    created_at: datetime


class MonumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    trip_id: uuid.UUID
    name: str
    latitude: float
    longitude: float
    description: str | None
    visited_at: datetime
    is_favorite: bool
    photos: list[PhotoOut] = []
    conversations: list[ConversationOut] = []


class TripOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    country: str | None
    city: str | None
    started_at: datetime
    ended_at: datetime | None
    title: str | None
    monuments: list[MonumentOut] = []


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str | None
    name: str | None
    anonymous_uuid: str
    created_at: datetime
    photo_consent: bool


class AnalyzeRequest(BaseModel):
    image_base64: str | None = None
    question: str
    uuid: str
    latitude: float | None = None
    longitude: float | None = None


class AnalyzeResponse(BaseModel):
    answer: str
    monument_id: uuid.UUID
    trip_id: uuid.UUID
    monument_name: str


class FavoriteUpdate(BaseModel):
    is_favorite: bool


class ConsentUpdate(BaseModel):
    photo_consent: bool


class TripMergeRequest(BaseModel):
    uuid: str
    title: str
    start_date: datetime
    end_date: datetime
    country: str | None = None
    city: str | None = None
