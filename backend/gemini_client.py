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
Si c'est un monument, fournis les informations suivantes :
- name : nom du monument
- country : pays
- city : ville
- description : description courte du monument (3 phrases)
- anecdote : une anecdote historique interessante
- answer : reponds directement a la question de l'utilisateur de facon concise en francais
  (si la question est generique comme "identifie ce monument", resume la description en 2 phrases)
- trivia_question : une question de quiz sur ce monument (annee de construction, architecte, hauteur...)
- trivia_answer : la reponse courte a cette question de quiz

Reponds uniquement en JSON valide, sans markdown, au format :
{{"name": "...", "country": "...", "city": "...", "description": "...", "anecdote": "...",
"answer": "...", "trivia_question": "...", "trivia_answer": "..."}}

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


GPS_PROMPT = """Tu es un guide touristique expert.
Un utilisateur se trouve aux coordonnees GPS : latitude {lat}, longitude {lng}.
Identifie le monument ou lieu touristique le plus connu a proximite de ces coordonnees.
Reponds uniquement en JSON valide, sans markdown, au format :
{{"name": "...", "country": "...", "city": "...", "description": "...", "anecdote": "...",
"answer": "description concise du monument en 2 phrases en francais", "trivia_question": "...", "trivia_answer": "..."}}

Question de l'utilisateur : {question}
"""


TEXT_ONLY_PROMPT = """Tu es un guide touristique expert.
L'utilisateur pose une question sur un monument ou lieu touristique.
Identifie le monument mentionne dans la question et reponds directement.
Si aucun monument n'est mentionne, reponds de facon generique sur les monuments.
Reponds uniquement en JSON valide, sans markdown, au format :
{{"name": "...", "country": "...", "city": "...", "description": "...", "anecdote": "...",
"answer": "reponse concise en francais", "trivia_question": "...", "trivia_answer": "..."}}

Question : {question}
"""


def analyze_by_text(question: str) -> dict:
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(TEXT_ONLY_PROMPT.format(question=question))
    return _extract_json(response.text)


def analyze_by_gps(lat: float, lng: float, question: str) -> dict:
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = GPS_PROMPT.format(lat=lat, lng=lng, question=question)
    response = model.generate_content(prompt)
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
