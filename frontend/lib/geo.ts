export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const PARIS = { latitude: 48.8566, longitude: 2.3522 };

type Continent = "Europe" | "Asie" | "Amerique du Nord" | "Amerique du Sud" | "Afrique" | "Oceanie";

/**
 * Liste des ~195 pays (193 membres de l'ONU + Vatican + Palestine), avec leurs
 * alias (francais, parfois anglais), code ISO 3166-1 alpha-2 et continent.
 * L'Amerique centrale et les Caraibes sont regroupees dans "Amerique du Nord".
 */
const COUNTRIES: { names: string[]; iso: string; continent: Continent }[] = [
  // ===== Afrique =====
  { names: ["Afrique du Sud", "South Africa"], iso: "za", continent: "Afrique" },
  { names: ["Algerie", "Algérie"], iso: "dz", continent: "Afrique" },
  { names: ["Angola"], iso: "ao", continent: "Afrique" },
  { names: ["Benin", "Bénin"], iso: "bj", continent: "Afrique" },
  { names: ["Botswana"], iso: "bw", continent: "Afrique" },
  { names: ["Burkina Faso"], iso: "bf", continent: "Afrique" },
  { names: ["Burundi"], iso: "bi", continent: "Afrique" },
  { names: ["Cap-Vert"], iso: "cv", continent: "Afrique" },
  { names: ["Cameroun"], iso: "cm", continent: "Afrique" },
  { names: ["Republique centrafricaine", "République centrafricaine"], iso: "cf", continent: "Afrique" },
  { names: ["Comores"], iso: "km", continent: "Afrique" },
  { names: ["Congo"], iso: "cg", continent: "Afrique" },
  { names: ["Republique democratique du Congo", "République démocratique du Congo"], iso: "cd", continent: "Afrique" },
  { names: ["Cote d'Ivoire", "Côte d'Ivoire"], iso: "ci", continent: "Afrique" },
  { names: ["Djibouti"], iso: "dj", continent: "Afrique" },
  { names: ["Egypte", "Égypte", "Egypt"], iso: "eg", continent: "Afrique" },
  { names: ["Erythree", "Érythrée"], iso: "er", continent: "Afrique" },
  { names: ["Eswatini"], iso: "sz", continent: "Afrique" },
  { names: ["Ethiopie", "Éthiopie"], iso: "et", continent: "Afrique" },
  { names: ["Gabon"], iso: "ga", continent: "Afrique" },
  { names: ["Gambie"], iso: "gm", continent: "Afrique" },
  { names: ["Ghana"], iso: "gh", continent: "Afrique" },
  { names: ["Guinee", "Guinée"], iso: "gn", continent: "Afrique" },
  { names: ["Guinee-Bissau", "Guinée-Bissau"], iso: "gw", continent: "Afrique" },
  { names: ["Guinee equatoriale", "Guinée équatoriale"], iso: "gq", continent: "Afrique" },
  { names: ["Kenya"], iso: "ke", continent: "Afrique" },
  { names: ["Lesotho"], iso: "ls", continent: "Afrique" },
  { names: ["Liberia", "Libéria"], iso: "lr", continent: "Afrique" },
  { names: ["Libye"], iso: "ly", continent: "Afrique" },
  { names: ["Madagascar"], iso: "mg", continent: "Afrique" },
  { names: ["Malawi"], iso: "mw", continent: "Afrique" },
  { names: ["Mali"], iso: "ml", continent: "Afrique" },
  { names: ["Maroc"], iso: "ma", continent: "Afrique" },
  { names: ["Maurice"], iso: "mu", continent: "Afrique" },
  { names: ["Mauritanie"], iso: "mr", continent: "Afrique" },
  { names: ["Mozambique"], iso: "mz", continent: "Afrique" },
  { names: ["Namibie"], iso: "na", continent: "Afrique" },
  { names: ["Niger"], iso: "ne", continent: "Afrique" },
  { names: ["Nigeria", "Nigéria"], iso: "ng", continent: "Afrique" },
  { names: ["Ouganda"], iso: "ug", continent: "Afrique" },
  { names: ["Rwanda"], iso: "rw", continent: "Afrique" },
  { names: ["Sao Tome-et-Principe", "Sao Tomé-et-Principe"], iso: "st", continent: "Afrique" },
  { names: ["Senegal", "Sénégal"], iso: "sn", continent: "Afrique" },
  { names: ["Seychelles"], iso: "sc", continent: "Afrique" },
  { names: ["Sierra Leone"], iso: "sl", continent: "Afrique" },
  { names: ["Somalie"], iso: "so", continent: "Afrique" },
  { names: ["Soudan"], iso: "sd", continent: "Afrique" },
  { names: ["Soudan du Sud"], iso: "ss", continent: "Afrique" },
  { names: ["Tanzanie"], iso: "tz", continent: "Afrique" },
  { names: ["Tchad"], iso: "td", continent: "Afrique" },
  { names: ["Togo"], iso: "tg", continent: "Afrique" },
  { names: ["Tunisie"], iso: "tn", continent: "Afrique" },
  { names: ["Zambie"], iso: "zm", continent: "Afrique" },
  { names: ["Zimbabwe"], iso: "zw", continent: "Afrique" },

  // ===== Asie =====
  { names: ["Afghanistan"], iso: "af", continent: "Asie" },
  { names: ["Arabie saoudite"], iso: "sa", continent: "Asie" },
  { names: ["Armenie", "Arménie"], iso: "am", continent: "Asie" },
  { names: ["Azerbaidjan", "Azerbaïdjan"], iso: "az", continent: "Asie" },
  { names: ["Bahrein", "Bahreïn"], iso: "bh", continent: "Asie" },
  { names: ["Bangladesh"], iso: "bd", continent: "Asie" },
  { names: ["Bhoutan"], iso: "bt", continent: "Asie" },
  { names: ["Brunei"], iso: "bn", continent: "Asie" },
  { names: ["Cambodge", "Cambodia"], iso: "kh", continent: "Asie" },
  { names: ["Chine", "China"], iso: "cn", continent: "Asie" },
  { names: ["Coree du Nord", "Corée du Nord"], iso: "kp", continent: "Asie" },
  { names: ["Coree du Sud", "Corée du Sud", "South Korea"], iso: "kr", continent: "Asie" },
  { names: ["Emirats arabes unis", "Émirats arabes unis"], iso: "ae", continent: "Asie" },
  { names: ["Georgie", "Géorgie"], iso: "ge", continent: "Asie" },
  { names: ["Inde", "India"], iso: "in", continent: "Asie" },
  { names: ["Indonesie", "Indonésie", "Indonesia"], iso: "id", continent: "Asie" },
  { names: ["Irak"], iso: "iq", continent: "Asie" },
  { names: ["Iran"], iso: "ir", continent: "Asie" },
  { names: ["Israel", "Israël"], iso: "il", continent: "Asie" },
  { names: ["Japon", "Japan"], iso: "jp", continent: "Asie" },
  { names: ["Jordanie"], iso: "jo", continent: "Asie" },
  { names: ["Kazakhstan"], iso: "kz", continent: "Asie" },
  { names: ["Kirghizistan"], iso: "kg", continent: "Asie" },
  { names: ["Koweit", "Koweït"], iso: "kw", continent: "Asie" },
  { names: ["Laos"], iso: "la", continent: "Asie" },
  { names: ["Liban"], iso: "lb", continent: "Asie" },
  { names: ["Malaisie"], iso: "my", continent: "Asie" },
  { names: ["Maldives"], iso: "mv", continent: "Asie" },
  { names: ["Mongolie"], iso: "mn", continent: "Asie" },
  { names: ["Myanmar"], iso: "mm", continent: "Asie" },
  { names: ["Nepal", "Népal"], iso: "np", continent: "Asie" },
  { names: ["Oman"], iso: "om", continent: "Asie" },
  { names: ["Ouzbekistan", "Ouzbékistan"], iso: "uz", continent: "Asie" },
  { names: ["Pakistan"], iso: "pk", continent: "Asie" },
  { names: ["Palestine"], iso: "ps", continent: "Asie" },
  { names: ["Philippines"], iso: "ph", continent: "Asie" },
  { names: ["Qatar"], iso: "qa", continent: "Asie" },
  { names: ["Singapour"], iso: "sg", continent: "Asie" },
  { names: ["Sri Lanka"], iso: "lk", continent: "Asie" },
  { names: ["Syrie"], iso: "sy", continent: "Asie" },
  { names: ["Tadjikistan"], iso: "tj", continent: "Asie" },
  { names: ["Taiwan"], iso: "tw", continent: "Asie" },
  { names: ["Thailande", "Thaïlande", "Thailand"], iso: "th", continent: "Asie" },
  { names: ["Timor oriental"], iso: "tl", continent: "Asie" },
  { names: ["Turkmenistan"], iso: "tm", continent: "Asie" },
  { names: ["Turquie", "Turkey"], iso: "tr", continent: "Asie" },
  { names: ["Vietnam"], iso: "vn", continent: "Asie" },
  { names: ["Yemen", "Yémen"], iso: "ye", continent: "Asie" },

  // ===== Europe =====
  { names: ["Albanie"], iso: "al", continent: "Europe" },
  { names: ["Allemagne", "Germany"], iso: "de", continent: "Europe" },
  { names: ["Andorre"], iso: "ad", continent: "Europe" },
  { names: ["Autriche"], iso: "at", continent: "Europe" },
  { names: ["Belarus"], iso: "by", continent: "Europe" },
  { names: ["Belgique"], iso: "be", continent: "Europe" },
  { names: ["Bosnie-Herzegovine", "Bosnie-Herzégovine"], iso: "ba", continent: "Europe" },
  { names: ["Bulgarie"], iso: "bg", continent: "Europe" },
  { names: ["Chypre"], iso: "cy", continent: "Europe" },
  { names: ["Croatie"], iso: "hr", continent: "Europe" },
  { names: ["Danemark"], iso: "dk", continent: "Europe" },
  { names: ["Espagne", "Spain"], iso: "es", continent: "Europe" },
  { names: ["Estonie"], iso: "ee", continent: "Europe" },
  { names: ["Finlande"], iso: "fi", continent: "Europe" },
  { names: ["France"], iso: "fr", continent: "Europe" },
  { names: ["Grece", "Grèce", "Greece"], iso: "gr", continent: "Europe" },
  { names: ["Hongrie"], iso: "hu", continent: "Europe" },
  { names: ["Irlande"], iso: "ie", continent: "Europe" },
  { names: ["Islande", "Iceland"], iso: "is", continent: "Europe" },
  { names: ["Italie", "Italy"], iso: "it", continent: "Europe" },
  { names: ["Kosovo"], iso: "xk", continent: "Europe" },
  { names: ["Lettonie"], iso: "lv", continent: "Europe" },
  { names: ["Liechtenstein"], iso: "li", continent: "Europe" },
  { names: ["Lituanie"], iso: "lt", continent: "Europe" },
  { names: ["Luxembourg"], iso: "lu", continent: "Europe" },
  { names: ["Macedoine du Nord", "Macédoine du Nord"], iso: "mk", continent: "Europe" },
  { names: ["Malte"], iso: "mt", continent: "Europe" },
  { names: ["Moldavie"], iso: "md", continent: "Europe" },
  { names: ["Monaco"], iso: "mc", continent: "Europe" },
  { names: ["Montenegro", "Monténégro"], iso: "me", continent: "Europe" },
  { names: ["Norvege", "Norvège", "Norway"], iso: "no", continent: "Europe" },
  { names: ["Pays-Bas"], iso: "nl", continent: "Europe" },
  { names: ["Pologne"], iso: "pl", continent: "Europe" },
  { names: ["Portugal"], iso: "pt", continent: "Europe" },
  { names: ["Republique tcheque", "République tchèque"], iso: "cz", continent: "Europe" },
  { names: ["Roumanie"], iso: "ro", continent: "Europe" },
  { names: ["Royaume-Uni", "United Kingdom"], iso: "gb", continent: "Europe" },
  { names: ["Russie"], iso: "ru", continent: "Europe" },
  { names: ["Saint-Marin"], iso: "sm", continent: "Europe" },
  { names: ["Serbie"], iso: "rs", continent: "Europe" },
  { names: ["Slovaquie"], iso: "sk", continent: "Europe" },
  { names: ["Slovenie", "Slovénie"], iso: "si", continent: "Europe" },
  { names: ["Suede", "Suède"], iso: "se", continent: "Europe" },
  { names: ["Suisse"], iso: "ch", continent: "Europe" },
  { names: ["Ukraine"], iso: "ua", continent: "Europe" },
  { names: ["Vatican"], iso: "va", continent: "Europe" },

  // ===== Amerique du Nord (incl. Amerique centrale et Caraibes) =====
  { names: ["Antigua-et-Barbuda"], iso: "ag", continent: "Amerique du Nord" },
  { names: ["Bahamas"], iso: "bs", continent: "Amerique du Nord" },
  { names: ["Barbade"], iso: "bb", continent: "Amerique du Nord" },
  { names: ["Belize"], iso: "bz", continent: "Amerique du Nord" },
  { names: ["Canada"], iso: "ca", continent: "Amerique du Nord" },
  { names: ["Costa Rica"], iso: "cr", continent: "Amerique du Nord" },
  { names: ["Cuba"], iso: "cu", continent: "Amerique du Nord" },
  { names: ["Dominique"], iso: "dm", continent: "Amerique du Nord" },
  { names: ["El Salvador"], iso: "sv", continent: "Amerique du Nord" },
  { names: ["Etats-Unis", "États-Unis", "USA"], iso: "us", continent: "Amerique du Nord" },
  { names: ["Grenade"], iso: "gd", continent: "Amerique du Nord" },
  { names: ["Guatemala"], iso: "gt", continent: "Amerique du Nord" },
  { names: ["Haiti", "Haïti"], iso: "ht", continent: "Amerique du Nord" },
  { names: ["Honduras"], iso: "hn", continent: "Amerique du Nord" },
  { names: ["Jamaique", "Jamaïque"], iso: "jm", continent: "Amerique du Nord" },
  { names: ["Mexique", "Mexico"], iso: "mx", continent: "Amerique du Nord" },
  { names: ["Nicaragua"], iso: "ni", continent: "Amerique du Nord" },
  { names: ["Panama"], iso: "pa", continent: "Amerique du Nord" },
  { names: ["Republique dominicaine", "République dominicaine"], iso: "do", continent: "Amerique du Nord" },
  { names: ["Saint-Kitts-et-Nevis"], iso: "kn", continent: "Amerique du Nord" },
  { names: ["Saint-Vincent-et-les-Grenadines"], iso: "vc", continent: "Amerique du Nord" },
  { names: ["Sainte-Lucie"], iso: "lc", continent: "Amerique du Nord" },
  { names: ["Trinite-et-Tobago", "Trinité-et-Tobago"], iso: "tt", continent: "Amerique du Nord" },

  // ===== Amerique du Sud =====
  { names: ["Argentine"], iso: "ar", continent: "Amerique du Sud" },
  { names: ["Bolivie"], iso: "bo", continent: "Amerique du Sud" },
  { names: ["Bresil", "Brésil"], iso: "br", continent: "Amerique du Sud" },
  { names: ["Chili", "Chile"], iso: "cl", continent: "Amerique du Sud" },
  { names: ["Colombie"], iso: "co", continent: "Amerique du Sud" },
  { names: ["Equateur", "Équateur"], iso: "ec", continent: "Amerique du Sud" },
  { names: ["Guyana"], iso: "gy", continent: "Amerique du Sud" },
  { names: ["Paraguay"], iso: "py", continent: "Amerique du Sud" },
  { names: ["Perou", "Pérou", "Peru"], iso: "pe", continent: "Amerique du Sud" },
  { names: ["Suriname"], iso: "sr", continent: "Amerique du Sud" },
  { names: ["Uruguay"], iso: "uy", continent: "Amerique du Sud" },
  { names: ["Venezuela"], iso: "ve", continent: "Amerique du Sud" },

  // ===== Oceanie =====
  { names: ["Australie", "Australia"], iso: "au", continent: "Oceanie" },
  { names: ["Fidji"], iso: "fj", continent: "Oceanie" },
  { names: ["Iles Marshall", "Îles Marshall"], iso: "mh", continent: "Oceanie" },
  { names: ["Iles Salomon", "Îles Salomon"], iso: "sb", continent: "Oceanie" },
  { names: ["Kiribati"], iso: "ki", continent: "Oceanie" },
  { names: ["Micronesie", "Micronésie"], iso: "fm", continent: "Oceanie" },
  { names: ["Nauru"], iso: "nr", continent: "Oceanie" },
  { names: ["Nouvelle-Zelande", "Nouvelle-Zélande"], iso: "nz", continent: "Oceanie" },
  { names: ["Palaos"], iso: "pw", continent: "Oceanie" },
  { names: ["Papouasie-Nouvelle-Guinee", "Papouasie-Nouvelle-Guinée"], iso: "pg", continent: "Oceanie" },
  { names: ["Samoa"], iso: "ws", continent: "Oceanie" },
  { names: ["Tonga"], iso: "to", continent: "Oceanie" },
  { names: ["Tuvalu"], iso: "tv", continent: "Oceanie" },
  { names: ["Vanuatu"], iso: "vu", continent: "Oceanie" },
];

const ISO_CODES: Record<string, string> = {};
const CONTINENTS: Record<string, Continent> = {};
for (const { names, iso, continent } of COUNTRIES) {
  for (const name of names) {
    ISO_CODES[name] = iso;
    CONTINENTS[name] = continent;
  }
}

export function isoFor(country: string | null | undefined): string | null {
  if (!country) return null;
  return ISO_CODES[country.trim()] || null;
}

export function continentFor(country: string | null | undefined): string {
  if (!country) return "Autre";
  return CONTINENTS[country.trim()] || "Autre";
}

export const ALL_CONTINENTS = ["Europe", "Asie", "Amerique du Nord", "Amerique du Sud", "Afrique", "Oceanie"];

export const TOTAL_COUNTRIES_IN_WORLD = COUNTRIES.length;
