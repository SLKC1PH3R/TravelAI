# TravelAI

Guide de voyage IA : identification de monuments via Gemini Vision (depuis une Lens Snapchat ou tout client qui envoie une photo), historique des conversations, et generation d'un carnet de voyage PDF.

## Stack

- **Backend** : FastAPI + SQLAlchemy + Alembic + PostgreSQL
- **Frontend** : Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth** : NextAuth.js v5 (Google OAuth + Email simplifie)
- **IA** : Google Gemini Vision (`gemini-1.5-flash`)
- **PDF** : ReportLab
- **Stockage photos** : fichiers locaux sous `/data/users/{uuid}/photos` et `/thumbnails`

## Structure

```
backend/    API FastAPI (routers: analyze, users, trips, monuments, photos, conversations, carnet)
frontend/   App Next.js (landing, dashboard, trips, monuments/[id], carnet/[tripId])
data/       Stockage des photos utilisateurs (monte en volume, ignore par git)
docker-compose.yml
.env.example
```

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner :

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Cle API Google AI Studio (Gemini Vision) |
| `DATABASE_URL` | URL Postgres, ex : `postgresql://travelai:password@postgres:5432/travelai` |
| `NEXTAUTH_SECRET` | Secret aleatoire (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL publique du frontend (ex : `https://travelai.digitalstack.cloud`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Identifiants OAuth Google (console Google Cloud) |
| `NEXT_PUBLIC_API_URL` | URL publique de l'API backend (ex : `https://api.travelai.digitalstack.cloud`) |

> Note auth Email : NextAuth v5 "Email provider" (magic link) necessite normalement un adapter de base de donnees pour stocker les jetons de verification + un serveur SMTP. Pour rester simple ici, l'auth par email est implementee via un provider Credentials sans mot de passe. Pour une vraie auth magic-link, brancher un adapter (`@auth/pg-adapter`) sur la meme base Postgres et ajouter les variables `EMAIL_SERVER` / `EMAIL_FROM`.

## Lancement local (developpement)

```bash
# Backend
cd backend
python -m venv .venv && .venv/Scripts/activate  # ou source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

La base de donnees doit etre accessible via `DATABASE_URL`. Au demarrage, l'API cree automatiquement les tables (`Base.metadata.create_all`) ; les migrations Alembic (`backend/alembic/versions/0001_initial.py`) sont aussi disponibles pour un suivi de schema propre (`alembic upgrade head`).

## Endpoint principal

`POST /analyze`

```json
{
  "image_base64": "...",
  "question": "Quel est ce monument ?",
  "uuid": "uuid-anonyme-genere-par-la-lens"
}
```

Logique : trouve/cree l'utilisateur via `anonymous_uuid` -> analyse l'image avec Gemini Vision si fournie -> trouve/cree le voyage du jour (meme ville/pays) -> cree le monument -> sauvegarde la photo si `photo_consent=true` -> enregistre la conversation -> retourne `{answer, monument_id, trip_id, monument_name}`.

## Deploiement sur Dokploy

Ce repo est concu pour etre deploye tel quel via Dokploy (Docker Compose) :

1. **Pousser le repo** sur GitHub/GitLab.
2. Dans Dokploy, creer une nouvelle application de type **Docker Compose**, pointer sur ce repo (fichier `docker-compose.yml` a la racine).
3. Renseigner les variables d'environnement du projet dans Dokploy (memes cles que `.env.example`) :
   - `GEMINI_API_KEY`, `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`.
4. **Volumes persistants** : Dokploy doit monter un volume persistant sur `./data/users` (cote backend) pour ne pas perdre les photos a chaque redeploiement, et un volume sur les donnees Postgres (`postgres_data`, deja defini dans le compose).
5. **Domaines** : configurer deux domaines/sous-domaines dans Dokploy (un proxy par service). Le champ **Port** doit correspondre au port que le conteneur ecoute reellement (pas un port hote a inventer) :
   - frontend -> port `3000` -> ex. `travelai.digitalstack.cloud`
   - backend -> port `8000` -> ex. `api.travelai.digitalstack.cloud`
   Ces URLs doivent correspondre a `NEXTAUTH_URL` et `NEXT_PUBLIC_API_URL`.
   `docker-compose.yml` n'expose plus de port hote (`ports:`) pour `backend`/`frontend`, uniquement `expose:` -> c'est le reseau interne de Dokploy/Traefik qui route vers le conteneur via le port configure dans la Domain. Si Dokploy a precedemment suggere d'autres ports (ex. `3125`, `8125`), les remplacer par `3000` et `8000` pour qu'ils correspondent a ce que le conteneur ecoute reellement.
6. **Google OAuth** : dans la console Google Cloud, ajouter `https://travelai.digitalstack.cloud/api/auth/callback/google` comme URI de redirection autorisee.
7. Lancer le deploiement. Dokploy build les images `backend` et `frontend` via leurs `Dockerfile` respectifs et execute `docker-compose up`.
8. Au premier demarrage, le backend cree les tables automatiquement (et `alembic upgrade head` s'execute au lancement du conteneur).

### Important pour `NEXT_PUBLIC_API_URL`

Cette variable est injectee **au build** du frontend (Next.js inline les variables `NEXT_PUBLIC_*` cote client). Verifier que Dokploy passe bien `NEXT_PUBLIC_API_URL` comme **build arg** (deja configure dans `docker-compose.yml` via `build.args`) et pas seulement comme variable d'environnement runtime, sinon le frontend buildera avec l'URL par defaut (`http://localhost:8000`).

## Stockage des photos

```
/data
  /users
    /{anonymous_uuid}
      /photos/2026-06-26-001.jpg
      /thumbnails/2026-06-26-001_thumb.jpg
      /metadata.json
```

Une photo n'est ecrite sur disque que si `users.photo_consent = true` (consentement RGPD) ET qu'une image a ete envoyee a `/analyze`.
# TravelAI
