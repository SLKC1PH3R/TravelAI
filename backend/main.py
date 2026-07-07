from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import models
from config import settings
from database import Base, SessionLocal, engine
from routers import admin, analyze, carnet, conversations, monuments, photos, trips, users

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
app.include_router(admin.router)


def seed_demo_user() -> None:
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == settings.demo_email).first()
        if existing is not None:
            return
        db.add(
            models.User(
                email=settings.demo_email,
                name=settings.demo_name,
                anonymous_uuid=settings.demo_login,
                avatar_url=settings.demo_avatar_url,
                snap_pseudo=settings.demo_pseudo,
                is_admin=False,
                is_locked=True,
            )
        )
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    seed_demo_user()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/ping")
def ping() -> dict:
    return {"ok": True}


@app.api_route("/debug", methods=["GET", "POST", "PUT", "DELETE"])
async def debug_endpoint(request: Request) -> dict:
    body = await request.body()
    import logging
    logging.getLogger("debug").warning(
        f"DEBUG method={request.method} path={request.url.path} "
        f"headers={dict(request.headers)} body={body[:500]}"
    )
    return {"received": True, "method": request.method, "body": body.decode(errors="replace")[:200]}
