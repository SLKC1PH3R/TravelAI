import base64
import json
import re
from io import BytesIO

import google.generativeai as genai
from PIL import Image

from config import settings

genai.configure(api_key=settings.gemini_api_key)

MODEL_NAME = "gemini-2.5-flash"

VISION_PROMPT = """Tu es un guide touristique expert. Analyse cette image.
Si c'est un monument, donne : nom, pays, ville, description courte (3 phrases),
anecdote historique. Reponds uniquement en JSON valide, sans markdown, au format :
{{"name": "...", "country": "...", "city": "...", "description": "...", "anecdote": "...", "answer": "..."}}

Question de l'utilisateur : {question}
"""

TEXT_PROMPT = """Tu es un guide touristique expert qui repond a une question de suivi
sur le monument "{monument_name}" ({city}, {country}).
Description connue : {description}

Question : {question}
Reponds de facon concise et informative en francais.
"""


def _extract_json(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON found in Gemini response: {text}")
    return json.loads(match.group(0))


def analyze_image(image_base64: str, question: str) -> dict:
    raw = base64.b64decode(image_base64.split(",")[-1])
    image = Image.open(BytesIO(raw)).convert("RGB")

    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content([VISION_PROMPT.format(question=question), image])
    return _extract_json(response.text)


def ask_followup(monument_name: str, city: str, country: str, description: str, question: str) -> str:
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = TEXT_PROMPT.format(
        monument_name=monument_name,
        city=city,
        country=country,
        description=description or "",
        question=question,
    )
    response = model.generate_content(prompt)
    return response.text.strip()
