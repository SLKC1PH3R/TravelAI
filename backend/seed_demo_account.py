"""
Peuple le compte demo (DEMO_LOGIN = John_around_the_world) avec un jeu de donnees
riche : 15 voyages mono-pays de 10-12 jours (3 etapes chacun), sur les 6 continents,
des dizaines de sites UNESCO, des quiz, des conversations IA, et une serie de jours
consecutifs de decouvertes — de quoi debloquer tous les badges et servir de vitrine
produit aux futurs utilisateurs.

Photos : chaque monument peut reference un fichier dans backend/seed_photos/. S'il
existe, il est copie dans le stockage de l'utilisateur demo et attache au monument.
S'il n'existe pas encore, le monument est quand meme cree (sans photo) et la photo
sera attachee automatiquement la prochaine fois que ce script tourne, une fois le
fichier ajoute — inutile de tout fournir d'un coup.

Si un ancien compte de test "test-uuid-eiffel-001" existe, ses voyages sont
transferes vers le compte demo puis le compte de test est supprime.

Usage (depuis backend/, avec DATABASE_URL pointant vers la bonne base) :
    python seed_demo_account.py
"""
import os
import shutil
from datetime import datetime, timedelta

from PIL import Image

import models
import storage
from config import settings
from database import SessionLocal

OLD_TEST_UUID = "test-uuid-eiffel-001"
SEED_PHOTOS_DIR = os.path.join(os.path.dirname(__file__), "seed_photos")

now = datetime.utcnow()


def days_ago(n: int) -> datetime:
    return now - timedelta(days=n)


def seed_photo(anonymous_uuid: str, filename: str) -> tuple[str, str] | None:
    """Copie une photo depuis seed_photos/ vers le stockage de l'utilisateur. None si absente."""
    src = os.path.join(SEED_PHOTOS_DIR, filename)
    if not os.path.exists(src):
        return None

    base = storage.user_dir(anonymous_uuid)
    dest = os.path.join(base, "photos", filename)
    if not os.path.exists(dest):
        shutil.copyfile(src, dest)

    thumb_filename = f"{os.path.splitext(filename)[0]}_thumb.jpg"
    thumb_dest = os.path.join(base, "thumbnails", thumb_filename)
    if not os.path.exists(thumb_dest):
        image = Image.open(src).convert("RGB")
        image.thumbnail(storage.THUMBNAIL_SIZE)
        image.save(thumb_dest, "JPEG", quality=80)

    return filename, thumb_filename


# 15 voyages mono-pays, 10-12 jours, 3 etapes chacun.
TRIPS: list[dict] = [
    {
        "city": "Rome & Milan", "country": "Italie",
        "monuments": [
            dict(name="Colisee", lat=41.8902, lon=12.4922, photo="colisee.jpg", is_unesco=True, day_offset=302,
                 description="Le plus grand amphitheatre jamais construit, acheve en 80 apr. J.-C. sous l'empereur Titus. Il pouvait accueillir jusqu'a 80 000 spectateurs.",
                 trivia_question="En quelle annee le Colisee a-t-il ete acheve ?", trivia_answer="80 apres J.-C.",
                 questions=[("Qui a fait construire le Colisee ?", "Le Colisee a ete commande par l'empereur Vespasien et acheve par son fils Titus en 80 apr. J.-C.")]),
            dict(name="Forum Romain", lat=41.8925, lon=12.4853, photo="forum-romain.jpg", is_unesco=True, day_offset=300,
                 description="Le centre politique, religieux et economique de la Rome antique pendant plus de mille ans.",
                 trivia_question="Quel etait le role du Forum Romain ?", trivia_answer="Centre politique et religieux de la Rome antique",
                 questions=[]),
            dict(name="Duomo de Milan", lat=45.4642, lon=9.1900, photo="duomo-milan.jpg", is_unesco=False, day_offset=297,
                 description="Cathedrale gothique dont le chantier a dure pres de six siecles, couronnee par la statue doree de la Madonnina.",
                 trivia_question="En quelle annee le chantier du Duomo a-t-il debute ?", trivia_answer="1386",
                 questions=[("Combien de statues orne la cathedrale ?", "Plus de 3 400 statues et 135 fleches, ce qui en fait l'une des plus grandes cathedrales gothiques au monde.")]),
        ],
    },
    {
        "city": "Paris", "country": "France",
        "monuments": [
            dict(name="Notre-Dame de Paris", lat=48.8530, lon=2.3499, photo="notre-dame.png", is_unesco=True, day_offset=272,
                 description="Chef-d'oeuvre de l'architecture gothique, sa construction a commence en 1163.",
                 trivia_question="En quelle annee la construction de Notre-Dame a-t-elle commence ?", trivia_answer="1163",
                 questions=[("Qui a lance la construction de Notre-Dame ?", "L'eveque Maurice de Sully en 1163 ; la cathedrale a ete largement achevee au XIVe siecle.")]),
            dict(name="Tour Eiffel", lat=48.8584, lon=2.2945, photo="tour-eiffel.jpg", is_unesco=False, day_offset=269,
                 description="Construite par Gustave Eiffel pour l'Exposition universelle de 1889.",
                 trivia_question="Pour quel evenement la Tour Eiffel a-t-elle ete construite ?", trivia_answer="L'Exposition universelle de 1889",
                 questions=[]),
            dict(name="Mont Saint-Michel", lat=48.6361, lon=-1.5115, photo="mont-saint-michel.jpg", is_unesco=True, day_offset=266,
                 description="Abbaye benedictine dressee sur un ilot rocheux soumis a des marees parmi les plus fortes d'Europe.",
                 trivia_question="Depuis quand le Mont Saint-Michel est-il un lieu de pelerinage ?", trivia_answer="Depuis le Moyen Age",
                 questions=[("Pourquoi cet ilot est-il si particulier ?", "Lieu de pelerinage depuis le Moyen Age, il a aussi servi de prison avant de redevenir un haut lieu spirituel.")]),
        ],
    },
    {
        "city": "New York & Dakota du Sud", "country": "Etats-Unis",
        "monuments": [
            dict(name="Statue de la Liberte", lat=40.6892, lon=-74.0445, photo="statue-liberte.jpg", is_unesco=True, day_offset=246,
                 description="Cadeau de la France pour le centenaire de l'independance americaine, inaugure en 1886.",
                 trivia_question="Qui a sculpte la Statue de la Liberte ?", trivia_answer="Frederic Auguste Bartholdi",
                 questions=[("Qui a concu sa structure interne ?", "Gustave Eiffel a concu la structure en fer qui soutient la statue de l'interieur.")]),
            dict(name="Mont Rushmore", lat=43.8791, lon=-103.4591, photo="mont-rushmore.jpg", is_unesco=False, day_offset=243,
                 description="Memorial national representant quatre presidents americains sculptes dans le granit.",
                 trivia_question="Qui sont les quatre presidents sculptes ?", trivia_answer="Washington, Jefferson, Roosevelt et Lincoln",
                 questions=[("Qui a dirige les travaux ?", "Le sculpteur Gutzon Borglum a dirige les travaux de 1927 a 1941.")]),
            dict(name="Grand Canyon", lat=36.1069, lon=-112.1129, photo="grand-canyon.jpg", is_unesco=True, day_offset=240,
                 description="Gorge creusee par le fleuve Colorado sur plus de 400 kilometres, jusqu'a 1 800 metres de profondeur.",
                 trivia_question="Quel fleuve a creuse le Grand Canyon ?", trivia_answer="Le fleuve Colorado",
                 questions=[]),
        ],
    },
    {
        "city": "Yucatan", "country": "Mexique",
        "monuments": [
            dict(name="Chichen Itza", lat=20.6843, lon=-88.5678, photo="chichen-itza.jpg", is_unesco=True, day_offset=222,
                 description="Ancienne cite maya dominee par la pyramide de Kukulcan, un chef-d'oeuvre d'astronomie et d'architecture.",
                 trivia_question="A quelle civilisation appartient Chichen Itza ?", trivia_answer="La civilisation maya",
                 questions=[("Quel phenomene se produit aux equinoxes ?", "Une ombre en forme de serpent descend les marches de la pyramide de Kukulcan, simulant la descente du dieu-serpent.")]),
            dict(name="Teotihuacan", lat=19.6925, lon=-98.8438, photo="teotihuacan.jpg", is_unesco=True, day_offset=219,
                 description="Cite pre-colombienne abritant les immenses pyramides du Soleil et de la Lune.",
                 trivia_question="Comment s'appellent les deux plus grandes pyramides de Teotihuacan ?", trivia_answer="La pyramide du Soleil et la pyramide de la Lune",
                 questions=[]),
            dict(name="Tulum", lat=20.2145, lon=-87.4295, photo="tulum.jpg", is_unesco=False, day_offset=216,
                 description="Cite maya fortifiee perchee sur une falaise dominant la mer des Caraibes.",
                 trivia_question="Qu'est-ce qui rend Tulum unique parmi les sites mayas ?", trivia_answer="Sa position en bord de falaise face a la mer",
                 questions=[]),
        ],
    },
    {
        "city": "Chiang Rai & Bangkok", "country": "Thailande",
        "monuments": [
            dict(name="Wat Rong Khun (Temple Blanc)", lat=19.8558, lon=99.7379, photo="temple-blanc.jpg", is_unesco=False, day_offset=196,
                 description="Temple bouddhiste contemporain entierement blanc, orne de miroirs et de motifs saisissants.",
                 trivia_question="Quel artiste a concu le Temple Blanc ?", trivia_answer="Chalermchai Kositpipat",
                 questions=[("Pourquoi est-il entierement blanc ?", "Le blanc symbolise la purete du Bouddha, et les fragments de verre incrustes representent sa sagesse rayonnant dans le monde.")]),
            dict(name="Wat Arun", lat=13.7437, lon=100.4888, photo="wat-arun.jpg", is_unesco=False, day_offset=193,
                 description="Le Temple de l'Aube, reconnaissable a sa tour centrale khmere decoree de porcelaine.",
                 trivia_question="Que signifie le nom Wat Arun ?", trivia_answer="Temple de l'Aube",
                 questions=[("Pourquoi Wat Arun est-il decore de porcelaine ?", "Les navires europeens utilisaient la porcelaine comme lest ; les debris etaient recuperes pour decorer le temple.")]),
            dict(name="Ayutthaya", lat=14.3532, lon=100.5689, photo="ayutthaya.jpg", is_unesco=True, day_offset=190,
                 description="Ancienne capitale du royaume du Siam, aujourd'hui un vaste site de temples en ruine.",
                 trivia_question="De quel royaume Ayutthaya etait-elle la capitale ?", trivia_answer="Le royaume du Siam",
                 questions=[]),
        ],
    },
    {
        "city": "Siem Reap", "country": "Cambodge",
        "monuments": [
            dict(name="Angkor Wat", lat=13.4125, lon=103.8670, photo="angkor-wat.jpg", is_unesco=True, day_offset=172,
                 description="Le plus grand monument religieux au monde, construit au XIIe siecle par l'empire khmer.",
                 trivia_question="Quel roi a fait construire Angkor Wat ?", trivia_answer="Le roi khmer Suryavarman II",
                 questions=[("Au service de quelle religion a-t-il ete construit ?", "L'hindouisme a l'origine, avant de devenir un temple bouddhiste.")]),
            dict(name="Angkor Thom", lat=13.4412, lon=103.8570, photo="angkor-thom.jpg", is_unesco=True, day_offset=169,
                 description="Derniere et plus durable capitale de l'empire khmer, celebre pour ses tours a visages du Bayon.",
                 trivia_question="Quel temple celebre se trouve au centre d'Angkor Thom ?", trivia_answer="Le Bayon",
                 questions=[]),
            dict(name="Ta Prohm", lat=13.4344, lon=103.8890, photo="ta-prohm.jpg", is_unesco=True, day_offset=166,
                 description="Temple envahi par les racines gigantesques de fromagers, laisse volontairement a l'etat sauvage.",
                 trivia_question="Pourquoi Ta Prohm est-il reste envahi par la jungle ?", trivia_answer="Pour illustrer la reconquete de la nature sur les monuments khmers",
                 questions=[]),
        ],
    },
    {
        "city": "Athenes & Meteores", "country": "Grece",
        "monuments": [
            dict(name="Parthenon", lat=37.9715, lon=23.7267, photo="parthenon.jpg", is_unesco=True, day_offset=148,
                 description="Temple dorique dedie a la deesse Athena, dominant l'Acropole d'Athenes.",
                 trivia_question="A quelle deesse le Parthenon est-il dedie ?", trivia_answer="Athena",
                 questions=[("Quand a-t-il ete construit ?", "Entre 447 et 432 av. J.-C., il est considere comme l'un des sommets de l'architecture dorique antique.")]),
            dict(name="Meteores", lat=39.7217, lon=21.6306, photo="meteores.jpg", is_unesco=True, day_offset=145,
                 description="Monasteres orthodoxes perches au sommet de pitons rocheux vertigineux.",
                 trivia_question="Combien de monasteres des Meteores sont encore actifs ?", trivia_answer="Six",
                 questions=[]),
            dict(name="Santorin", lat=36.3932, lon=25.4615, photo="santorin.jpg", is_unesco=False, day_offset=142,
                 description="Ile volcanique celebre pour ses villages blancs et bleus perches sur la caldeira.",
                 trivia_question="Quel evenement a forme la caldeira de Santorin ?", trivia_answer="Une eruption volcanique massive vers 1600 av. J.-C.",
                 questions=[]),
        ],
    },
    {
        "city": "Agra, Jaipur & Delhi", "country": "Inde",
        "monuments": [
            dict(name="Taj Mahal", lat=27.1751, lon=78.0421, photo="taj-mahal.jpg", is_unesco=True, day_offset=124,
                 description="Mausolee de marbre blanc construit par l'empereur moghol Shah Jahan pour son epouse Mumtaz Mahal.",
                 trivia_question="Pour qui le Taj Mahal a-t-il ete construit ?", trivia_answer="Pour Mumtaz Mahal, epouse de l'empereur Shah Jahan",
                 questions=[("Combien de temps a pris sa construction ?", "Environ 20 ans, de 1632 a 1653, avec plus de 20 000 artisans mobilises.")]),
            dict(name="Chand Baori", lat=27.2153, lon=76.6017, photo="chand-baori.jpg", is_unesco=False, day_offset=121,
                 description="L'un des plus grands puits a marches du monde, avec plus de 3 500 marches symetriques.",
                 trivia_question="Combien de marches compte Chand Baori ?", trivia_answer="Plus de 3 500",
                 questions=[]),
            dict(name="Fort Rouge", lat=28.6562, lon=77.2410, photo="fort-rouge.jpg", is_unesco=True, day_offset=118,
                 description="Forteresse moghole de gres rouge a Delhi, siege du pouvoir pendant pres de 200 ans.",
                 trivia_question="En quelle pierre le Fort Rouge est-il construit ?", trivia_answer="Le gres rouge",
                 questions=[]),
        ],
    },
    {
        "city": "Zhangjiajie, Pekin & Xi'an", "country": "Chine",
        "monuments": [
            dict(name="Zhangjiajie", lat=29.3169, lon=110.4344, photo="zhangjiajie.jpg", is_unesco=True, day_offset=104,
                 description="Foret de pitons de gres qui a inspire les paysages flottants du film Avatar.",
                 trivia_question="Quel film culte s'est inspire des paysages de Zhangjiajie ?", trivia_answer="Avatar",
                 questions=[]),
            dict(name="Grande Muraille", lat=40.3596, lon=116.0142, photo="grande-muraille.jpg", is_unesco=True, day_offset=101,
                 description="Fortification longue de plusieurs milliers de kilometres, construite sur plus de deux mille ans.",
                 trivia_question="Sur combien de kilometres s'etend la Grande Muraille ?", trivia_answer="Plus de 21 000 km",
                 questions=[("Pourquoi a-t-elle ete construite ?", "Pour proteger les Etats et empires chinois des invasions des peuples nomades du nord.")]),
            dict(name="Armee de terre cuite", lat=34.3841, lon=109.2785, photo="armee-terre-cuite.jpg", is_unesco=True, day_offset=98,
                 description="Plus de 8 000 soldats en terre cuite grandeur nature, enterres pour proteger le premier empereur de Chine dans l'au-dela.",
                 trivia_question="Combien de soldats compte l'armee de terre cuite ?", trivia_answer="Plus de 8 000",
                 questions=[]),
        ],
    },
    {
        "city": "Cappadoce & Istanbul", "country": "Turquie",
        "monuments": [
            dict(name="Cappadoce", lat=38.6431, lon=34.8286, photo="cappadoce.jpg", is_unesco=True, day_offset=84,
                 description="Region aux cheminees de fees sculptees par l'erosion, avec des habitations troglodytes millenaires.",
                 trivia_question="Comment se nomment les formations rocheuses de Cappadoce ?", trivia_answer="Les cheminees de fees",
                 questions=[("Comment visite-t-on la region ?", "En montgolfiere au lever du soleil, une des experiences les plus celebres de Turquie.")]),
            dict(name="Sainte-Sophie", lat=41.0086, lon=28.9802, photo="sainte-sophie.jpg", is_unesco=True, day_offset=81,
                 description="Ancienne basilique byzantine devenue mosquee, celebre pour son immense dome.",
                 trivia_question="Quel empereur a fait construire Sainte-Sophie ?", trivia_answer="L'empereur byzantin Justinien Ier",
                 questions=[]),
            dict(name="Pamukkale", lat=37.9142, lon=29.1189, photo="pamukkale.jpg", is_unesco=True, day_offset=78,
                 description="Bassins de calcaire blancs formes par des sources thermales, surplombant la vallee.",
                 trivia_question="Que signifie Pamukkale en turc ?", trivia_answer="Chateau de coton",
                 questions=[]),
        ],
    },
    {
        "city": "Fjords norvegiens", "country": "Norvege",
        "monuments": [
            dict(name="Trolltunga", lat=60.1242, lon=6.7400, photo="trolltunga.jpg", is_unesco=False, day_offset=64,
                 description="Formation rocheuse en surplomb offrant une vue vertigineuse sur le lac Ringedalsvatnet.",
                 trivia_question="Que signifie Trolltunga en norvegien ?", trivia_answer="La langue du troll",
                 questions=[]),
            dict(name="Preikestolen", lat=58.9866, lon=6.1900, photo="preikestolen.jpg", is_unesco=False, day_offset=61,
                 description="Plateau rocheux culminant a 604 metres au-dessus du Lysefjord.",
                 trivia_question="Au-dessus de quel fjord surplombe Preikestolen ?", trivia_answer="Le Lysefjord",
                 questions=[]),
            dict(name="Geirangerfjord", lat=62.1049, lon=7.2062, photo="geiranger.jpg", is_unesco=True, day_offset=58,
                 description="Fjord classe encadre de cascades, dont les celebres Sept Soeurs.",
                 trivia_question="Comment s'appellent les cascades celebres du Geirangerfjord ?", trivia_answer="Les Sept Soeurs",
                 questions=[]),
        ],
    },
    {
        "city": "Cusco & Nazca", "country": "Perou",
        "monuments": [
            dict(name="Machu Picchu", lat=-13.1631, lon=-72.5450, photo="machu-picchu.jpg", is_unesco=True, day_offset=44,
                 description="Citadelle inca perchee a 2 430 metres d'altitude, redecouverte en 1911 par Hiram Bingham.",
                 trivia_question="En quelle annee Machu Picchu a-t-il ete redecouvert par les Occidentaux ?", trivia_answer="1911",
                 questions=[("Pourquoi les Espagnols n'ont-ils jamais trouve Machu Picchu ?", "Sa position isolee en altitude, cachee par la jungle andine, l'a protege des conquistadors espagnols.")]),
            dict(name="Lac Titicaca", lat=-15.8402, lon=-69.6501, photo="lac-titicaca.jpg", is_unesco=False, day_offset=41,
                 description="Plus haut lac navigable au monde, berceau legendaire de la civilisation inca.",
                 trivia_question="A quelle altitude se trouve le lac Titicaca ?", trivia_answer="Environ 3 812 metres",
                 questions=[]),
            dict(name="Lignes de Nazca", lat=-14.7390, lon=-75.1300, photo="lignes-nazca.jpg", is_unesco=True, day_offset=38,
                 description="Immenses geoglyphes traces dans le desert, visibles uniquement depuis les airs.",
                 trivia_question="Comment peut-on observer les lignes de Nazca ?", trivia_answer="Depuis les airs, en avion",
                 questions=[]),
        ],
    },
    {
        "city": "Le Caire & Assouan", "country": "Egypte",
        "monuments": [
            dict(name="Pyramides de Gizeh", lat=29.9792, lon=31.1342, photo="pyramides-gizeh.jpg", is_unesco=True, day_offset=24,
                 description="Derniere merveille du monde antique encore debout, tombeau des pharaons Kheops, Khephren et Mykerinos.",
                 trivia_question="Quel pharaon a fait construire la plus grande pyramide de Gizeh ?", trivia_answer="Kheops",
                 questions=[("Combien de temps a pris sa construction ?", "Environ 20 ans, avec des dizaines de milliers d'ouvriers, acheve vers 2560 av. J.-C.")]),
            dict(name="Sphinx", lat=29.9753, lon=31.1376, photo="sphinx.jpg", is_unesco=True, day_offset=21,
                 description="Statue monumentale a corps de lion et tete humaine, gardienne du plateau de Gizeh.",
                 trivia_question="Quelle est la particularite du Sphinx ?", trivia_answer="Un corps de lion et une tete humaine",
                 questions=[]),
            dict(name="Abou Simbel", lat=22.3372, lon=31.6258, photo="abou-simbel.jpg", is_unesco=True, day_offset=18,
                 description="Temples monumentaux tailles dans la roche par Ramses II, deplaces pour echapper aux eaux du Nil.",
                 trivia_question="Quel pharaon a fait construire Abou Simbel ?", trivia_answer="Ramses II",
                 questions=[("Pourquoi les temples ont-ils ete deplaces ?", "Pour les sauver de la montee des eaux causee par le barrage d'Assouan, ils ont ete decoupes et reconstruits plus haut dans les annees 1960.")]),
        ],
    },
    {
        "city": "Kyoto & Mont Fuji", "country": "Japon",
        "monuments": [
            dict(name="Mont Fuji", lat=35.3606, lon=138.7274, photo="mont-fuji.jpg", is_unesco=True, day_offset=6,
                 description="Plus haut sommet du Japon et volcan sacre, embleme du pays.",
                 trivia_question="Quelle est l'altitude du Mont Fuji ?", trivia_answer="3 776 metres",
                 questions=[]),
            dict(name="Fushimi Inari-taisha", lat=34.9671, lon=135.7727, photo="fushimi-inari.jpg", is_unesco=False, day_offset=5,
                 description="Sanctuaire celebre pour ses milliers de torii orange formant des allees a flanc de montagne.",
                 trivia_question="Combien de torii compte le sentier de Fushimi Inari ?", trivia_answer="Environ 10 000",
                 questions=[]),
            dict(name="Kinkaku-ji (Pavillon d'Or)", lat=35.0394, lon=135.7292, photo="kinkaku-ji.jpg", is_unesco=True, day_offset=4,
                 description="Temple zen dont les deux etages superieurs sont entierement recouverts de feuilles d'or.",
                 trivia_question="De quoi sont recouverts les etages superieurs du Kinkaku-ji ?", trivia_answer="De feuilles d'or",
                 questions=[("Pourquoi le Pavillon d'Or est-il dore ?", "Il symbolise la purete et la richesse spirituelle recherchee par le shogun Ashikaga Yoshimitsu, qui en fit sa villa de retraite avant qu'elle ne devienne un temple.")]),
        ],
    },
    {
        "city": "Uluru & Sydney", "country": "Australie",
        "monuments": [
            dict(name="Uluru", lat=-25.3444, lon=131.0369, photo="uluru.jpg", is_unesco=True, day_offset=3,
                 description="Monolithe sacre aborigene changeant de couleur au fil de la journee, au coeur du desert australien.",
                 trivia_question="Quel peuple considere Uluru comme sacre ?", trivia_answer="Les Anangu, peuple aborigene local",
                 questions=[]),
            dict(name="Opera de Sydney", lat=-33.8568, lon=151.2153, photo="opera-sydney.jpg", is_unesco=True, day_offset=2,
                 description="Salle de spectacle emblematique aux voiles blanches, symbole architectural de l'Australie.",
                 trivia_question="Qui a concu l'Opera de Sydney ?", trivia_answer="L'architecte danois Jorn Utzon",
                 questions=[]),
            dict(name="Grande Barriere de Corail", lat=-18.2871, lon=147.6992, photo="grande-barriere-corail.jpg", is_unesco=True, day_offset=1,
                 description="Plus grand ecosysteme corallien au monde, visible meme depuis l'espace.",
                 trivia_question="Sur combien de kilometres s'etend la Grande Barriere de Corail ?", trivia_answer="Plus de 2 300 km",
                 questions=[]),
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
            demo_user.first_carnet_export_at = days_ago(1)
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

        created_trips = created_monuments = added_photos = 0
        for trip_spec in TRIPS:
            trip_title = f"{trip_spec['country']} — {trip_spec['city']}"
            trip = (
                db.query(models.Trip)
                .filter(models.Trip.user_id == demo_user.id, models.Trip.country == trip_spec["country"])
                .first()
            )
            if trip is None:
                trip = models.Trip(
                    user_id=demo_user.id,
                    country=trip_spec["country"],
                    city=trip_spec["city"],
                    title=trip_title,
                    started_at=days_ago(max(m["day_offset"] for m in trip_spec["monuments"])),
                    ended_at=days_ago(min(m["day_offset"] for m in trip_spec["monuments"])),
                )
                db.add(trip)
                db.commit()
                db.refresh(trip)
                created_trips += 1

            for m in trip_spec["monuments"]:
                monument = (
                    db.query(models.Monument)
                    .filter(models.Monument.trip_id == trip.id, models.Monument.name == m["name"])
                    .first()
                )
                if monument is None:
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

                if m.get("photo"):
                    has_photo = db.query(models.Photo).filter(models.Photo.monument_id == monument.id).first()
                    if has_photo is None:
                        result = seed_photo(demo_user.anonymous_uuid, m["photo"])
                        if result:
                            filename, thumb = result
                            db.add(models.Photo(monument_id=monument.id, filename=filename, thumbnail_filename=thumb, stored=True))
                            db.commit()
                            added_photos += 1

        print(f"{created_trips} nouveau(x) voyage(s), {created_monuments} nouveau(x) monument(s), {added_photos} photo(s) ajoutee(s).")
        print("Termine.")
    finally:
        db.close()


if __name__ == "__main__":
    try:
        run()
    except Exception as exc:  # ne doit jamais empecher le demarrage du backend
        print(f"[seed_demo_account] echec (ignore) : {exc}")
