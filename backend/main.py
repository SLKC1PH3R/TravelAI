from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import Base, engine
from routers import analyze, carnet, conversations, monuments, photos, trips, users

app = FastAPI(title="TravelAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(users.router)
app.include_router(trips.router)
app.include_router(monuments.router)
app.include_router(photos.router)
app.include_router(conversations.router)
app.include_router(carnet.router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
