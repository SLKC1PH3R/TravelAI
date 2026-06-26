import base64
import json
import os
from datetime import datetime
from io import BytesIO

from PIL import Image

from config import settings

THUMBNAIL_SIZE = (320, 320)


def user_dir(anonymous_uuid: str) -> str:
    path = os.path.join(settings.data_dir, anonymous_uuid)
    os.makedirs(os.path.join(path, "photos"), exist_ok=True)
    os.makedirs(os.path.join(path, "thumbnails"), exist_ok=True)
    return path


def save_photo(anonymous_uuid: str, image_base64: str) -> tuple[str, str]:
    """Saves the photo + a thumbnail. Returns (filename, thumbnail_filename)."""
    base = user_dir(anonymous_uuid)
    raw = base64.b64decode(image_base64.split(",")[-1])
    image = Image.open(BytesIO(raw)).convert("RGB")

    today = datetime.utcnow().strftime("%Y-%m-%d")
    index = len(os.listdir(os.path.join(base, "photos"))) + 1
    filename = f"{today}-{index:03d}.jpg"
    thumbnail_filename = f"{today}-{index:03d}_thumb.jpg"

    image.save(os.path.join(base, "photos", filename), "JPEG", quality=85)

    thumb = image.copy()
    thumb.thumbnail(THUMBNAIL_SIZE)
    thumb.save(os.path.join(base, "thumbnails", thumbnail_filename), "JPEG", quality=80)

    return filename, thumbnail_filename


def photo_path(anonymous_uuid: str, filename: str) -> str:
    return os.path.join(settings.data_dir, anonymous_uuid, "photos", filename)


def thumbnail_path(anonymous_uuid: str, filename: str) -> str:
    return os.path.join(settings.data_dir, anonymous_uuid, "thumbnails", filename)


def write_metadata_cache(anonymous_uuid: str, data: dict) -> None:
    base = user_dir(anonymous_uuid)
    with open(os.path.join(base, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)
