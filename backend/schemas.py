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


class PhotoUpload(BaseModel):
    image_base64: str


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
    trivia_question: str | None
    trivia_answer: str | None
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


class LocationUpdate(BaseModel):
    latitude: float
    longitude: float


class ConsentUpdate(BaseModel):
    photo_consent: bool


class TripMergeRequest(BaseModel):
    uuid: str
    title: str
    start_date: datetime
    end_date: datetime
    country: str | None = None
    city: str | None = None


class TripCreate(BaseModel):
    uuid: str
    country: str | None = None
    city: str | None = None
    title: str | None = None
    started_at: datetime
    ended_at: datetime | None = None


class MonumentAdminUpdate(BaseModel):
    trip_id: uuid.UUID | None = None
    visited_at: datetime | None = None
    trivia_question: str | None = None
    trivia_answer: str | None = None


class MonumentCreate(BaseModel):
    trip_id: uuid.UUID
    name: str
    latitude: float
    longitude: float
    description: str | None = None
    visited_at: datetime
    is_favorite: bool = False
    trivia_question: str | None = None
    trivia_answer: str | None = None
