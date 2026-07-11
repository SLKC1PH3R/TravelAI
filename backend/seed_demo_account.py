"""
Peuple le compte demo (DEMO_LOGIN = John_around_the_world) avec un jeu de donnees
riche : voyages sur plusieurs continents, monuments UNESCO, quiz, conversations IA,
et une serie de 5 jours consecutifs de decouvertes — de quoi debloquer tous les
badges et servir de vitrine produit aux futurs utilisateurs.

Si un ancien compte de test "test-uuid-eiffel-001" existe, ses voyages sont
transferes vers le compte demo puis le compte de test est supprime.

Usage (depuis backend/, avec DATABASE_URL pointant vers la bonne base) :
    python seed_demo_account.py
"""
from datetime import datetime, timedelta

import models
from config import settings
from database import SessionLocal

OLD_TEST_UUID = "test-uuid-eiffel-001"

now = datetime.utcnow()


def days_ago(n: int) -> datetime:
    return now - timedelta(days=n)


# Chaque entree : (name, city, country, lat, lon, description, trivia_q, trivia_a, is_unesco, day_offset, questions)
TRIPS: list[dict] = [
    {
        "city": "Rome",
        "country": "Italie",
        "title": "Rome, Italie",
        "monuments": [
            dict(
                name="Colisee",
                lat=41.8902, lon=12.4922,
                description="Le plus grand amphitheatre jamais construit, acheve en 80 apr. J.-C. sous l'empereur Titus.\n\nAnecdote : il pouvait accueillir jusqu'a 80 000 spectateurs.",
                trivia_question="En quelle annee le Colisee a-t-il ete acheve ?",
                trivia_answer="80 apres J.-C.",
                is_unesco=True,
                day_offset=40,
                questions=[("Qui a fait construire le Colisee ?", "Le Colisee a ete commande par l'empereur Vespasien et acheve par son fils Titus en 80 apr. J.-C.")],
            ),
            dict(
                name="Forum Romain",
                lat=41.8925, lon=12.4853,
                description="Le centre politique, religieux et economique de la Rome antique pendant plus de mille ans.",
                trivia_question="Quel etait le role du Forum Romain ?",
                trivia_answer="Centre politique et religieux de la Rome antique",
                is_unesco=True,
                day_offset=40,
                questions=[],
            ),
        ],
    },
    {
        "city": "Kyoto",
        "country": "Japon",
        "title": "Kyoto, Japon",
        "monuments": [
            dict(
                name="Kinkaku-ji (Pavillon d'Or)",
                lat=35.0394, lon=135.7292,
                description="Un temple zen dont les deux etages superieurs sont entierement recouverts de feuilles d'or.",
                trivia_question="De quoi sont recouverts les etages superieurs du Kinkaku-ji ?",
                trivia_answer="De feuilles d'or",
                is_unesco=True,
                day_offset=9,
                questions=[("Pourquoi le Pavillon d'Or est-il dore ?", "Il symbolise la purete et la richesse spirituelle recherchee par le shogun Ashikaga Yoshimitsu, qui en fit sa villa de retraite avant qu'elle ne devienne un temple.")],
            ),
            dict(
                name="Fushimi Inari-taisha",
                lat=34.9671, lon=135.7727,
                description="Celebre pour ses milliers de torii orange formant des allees a flanc de montagne.",
                trivia_question="Combien de torii compte le sentier de Fushimi Inari ?",
                trivia_answer="Environ 10 000",
                is_unesco=False,
                day_offset=8,
                questions=[],
            ),
        ],
    },
    {
        "city": "Bangkok",
        "country": "Thailande",
        "title": "Bangkok, Thailande",
        "monuments": [
            dict(
                name="Wat Arun",
                lat=13.7437, lon=100.4888,
                description="Le Temple de l'Aube, reconnaissable a sa tour centrale khmere decoree de porcelaine.",
                trivia_question="Que signifie le nom Wat Arun ?",
                trivia_answer="Temple de l'Aube",
                is_unesco=False,
                day_offset=7,
                questions=[("Pourquoi Wat Arun est-il decore de porcelaine ?", "Les navires europeens utilisaient la porcelaine comme lest ; les debris etaient recuperes pour decorer le temple, une pratique tres economique a l'epoque.")],
            ),
        ],
    },
    {
        "city": "Agra",
        "country": "Inde",
        "title": "Agra, Inde",
        "monuments": [
            dict(
                name="Taj Mahal",
                lat=27.1751, lon=78.0421,
                description="Mausolee de marbre blanc construit par l'empereur moghol Shah Jahan pour son epouse Mumtaz Mahal.",
                trivia_question="Pour qui le Taj Mahal a-t-il ete construit ?",
                trivia_answer="Pour Mumtaz Mahal, epouse de l'empereur Shah Jahan",
                is_unesco=True,
                day_offset=6,
                questions=[("Combien de temps a pris sa construction ?", "Environ 20 ans, de 1632 a 1653, avec plus de 20 000 artisans mobilises.")],
            ),
        ],
    },
    {
        "city": "Xi'an",
        "country": "Chine",
        "title": "Xi'an, Chine",
        "monuments": [
            dict(
                name="Armee de terre cuite",
                lat=34.3841, lon=109.2785,
                description="Plus de 8 000 soldats en terre cuite grandeur nature, enterres pour proteger le premier empereur de Chine dans l'au-dela.",
                trivia_question="Combien de soldats compte l'armee de terre cuite ?",
                trivia_answer="Plus de 8 000",
                is_unesco=True,
                day_offset=5,
                questions=[],
            ),
        ],
    },
    {
        "city": "Ha Long",
        "country": "Vietnam",
        "title": "Baie d'Ha Long, Vietnam",
        "monuments": [
            dict(
                name="Baie d'Ha Long",
                lat=20.9101, lon=107.1839,
                description="Une baie parsemee de milliers d'ilots karstiques recouverts de foret tropicale.",
                trivia_question="Combien d'ilots compte la baie d'Ha Long ?",
                trivia_answer="Environ 1 600",
                is_unesco=True,
                day_offset=20,
                questions=[],
            ),
        ],
    },
    {
        "city": "Siem Reap",
        "country": "Cambodge",
        "title": "Siem Reap, Cambodge",
        "monuments": [
            dict(
                name="Angkor Wat",
                lat=13.4125, lon=103.8670,
                description="Le plus grand monument religieux au monde, construit au XIIe siecle par l'empire khmer.",
                trivia_question="Au service de quelle religion Angkor Wat a-t-il ete construit a l'origine ?",
                trivia_answer="L'hindouisme, avant de devenir un temple bouddhiste",
                is_unesco=True,
                day_offset=25,
                questions=[("Quel roi a fait construire Angkor Wat ?", "Le roi khmer Suryavarman II, au debut du XIIe siecle, en tant que temple d'Etat et capitale.")],
            ),
        ],
    },
    {
        "city": "Athenes",
        "country": "Grece",
        "title": "Athenes, Grece",
        "monuments": [
            dict(
                name="Acropole d'Athenes",
                lat=37.9715, lon=23.7267,
                description="Citadelle antique dominant Athenes, abritant le Parthenon dedie a la deesse Athena.",
                trivia_question="A quelle deesse le Parthenon est-il dedie ?",
                trivia_answer="Athena",
                is_unesco=True,
                day_offset=30,
                questions=[],
            ),
        ],
    },
    {
        "city": "Machu Picchu",
        "country": "Perou",
        "title": "Machu Picchu, Perou",
        "monuments": [
            dict(
                name="Machu Picchu",
                lat=-13.1631, lon=-72.5450,
                description="Citadelle inca perchee a 2 430 metres d'altitude, redecouverte en 1911 par Hiram Bingham.",
                trivia_question="En quelle annee Machu Picchu a-t-il ete redecouvert par les Occidentaux ?",
                trivia_answer="1911",
                is_unesco=True,
                day_offset=45,
                questions=[("Pourquoi les Espagnols n'ont-ils jamais trouve Machu Picchu ?", "Sa position isolee en altitude, cachee par la jungle andine, l'a protege des conquistadors espagnols qui ne l'ont jamais localise.")],
            ),
        ],
    },
    {
        "city": "Paris",
        "country": "France",
        "title": "Paris, France",
        "monuments": [
            dict(
                name="Notre-Dame de Paris",
                lat=48.8530, lon=2.3499,
                description="Chef-d'oeuvre de l'architecture gothique, sa construction a commence en 1163.",
                trivia_question="En quelle annee la construction de Notre-Dame a-t-elle commence ?",
                trivia_answer="1163",
                is_unesco=True,
                day_offset=60,
                questions=[("Qui a lance la construction de Notre-Dame ?", "L'eveque Maurice de Sully en 1163 ; la cathedrale a ete largement achevee au XIVe siecle.")],
            ),
            dict(
                name="Tour Eiffel",
                lat=48.8584, lon=2.2945,
                description="Construite par Gustave Eiffel pour l'Exposition universelle de 1889.",
                trivia_question="Pour quel evenement la Tour Eiffel a-t-elle ete construite ?",
                trivia_answer="L'Exposition universelle de 1889",
                is_unesco=False,
                day_offset=60,
                questions=[],
            ),
        ],
    },
]


def run() -> None:
    db = SessionLocal()
    try:
        demo_user = db.query(models.User).filter(models.User.anonymous_uuid == settings.demo_login).first()
        if demo_user is None:
            demo_user = models.User(anonymous_uuid=settings.demo_login)
            db.add(demo_user)

        demo_user.email = settings.demo_email
        demo_user.name = settings.demo_name
        demo_user.snap_pseudo = settings.demo_pseudo
        demo_user.avatar_url = settings.demo_avatar_url
        demo_user.photo_consent = True
        demo_user.location = "Paris, France"
        if demo_user.first_carnet_export_at is None:
            demo_user.first_carnet_export_at = days_ago(3)
        db.commit()
        db.refresh(demo_user)
        print(f"Compte demo pret : {demo_user.anonymous_uuid} (id={demo_user.id})")

        old_user = db.query(models.User).filter(models.User.anonymous_uuid == OLD_TEST_UUID).first()
        if old_user is not None:
            moved = (
                db.query(models.Trip)
                .filter(models.Trip.user_id == old_user.id)
                .update({"user_id": demo_user.id})
            )
            db.commit()
            db.delete(old_user)
            db.commit()
            print(f"{moved} voyage(s) transfere(s) depuis {OLD_TEST_UUID} vers le compte demo, ancien compte supprime.")

        created_trips = 0
        created_monuments = 0
        for trip_spec in TRIPS:
            existing = (
                db.query(models.Trip)
                .filter(
                    models.Trip.user_id == demo_user.id,
                    models.Trip.title == trip_spec["title"],
                )
                .first()
            )
            if existing is not None:
                continue

            trip = models.Trip(
                user_id=demo_user.id,
                country=trip_spec["country"],
                city=trip_spec["city"],
                title=trip_spec["title"],
                started_at=days_ago(max(m["day_offset"] for m in trip_spec["monuments"])),
                ended_at=days_ago(min(m["day_offset"] for m in trip_spec["monuments"])),
            )
            db.add(trip)
            db.commit()
            db.refresh(trip)
            created_trips += 1

            for m in trip_spec["monuments"]:
                monument = models.Monument(
                    trip_id=trip.id,
                    name=m["name"],
                    latitude=m["lat"],
                    longitude=m["lon"],
                    description=m["description"],
                    visited_at=days_ago(m["day_offset"]),
                    trivia_question=m["trivia_question"],
                    trivia_answer=m["trivia_answer"],
                    is_unesco=m["is_unesco"],
                )
                db.add(monument)
                db.commit()
                db.refresh(monument)
                created_monuments += 1

                for question, answer in m["questions"]:
                    db.add(models.Conversation(monument_id=monument.id, question=question, answer=answer))
                db.commit()

        print(f"{created_trips} nouveau(x) voyage(s) et {created_monuments} nouveau(x) monument(s) ajoutes.")
        print("Termine.")
    finally:
        db.close()


if __name__ == "__main__":
    try:
        run()
    except Exception as exc:  # ne doit jamais empecher le demarrage du backend
        print(f"[seed_demo_account] echec (ignore) : {exc}")
