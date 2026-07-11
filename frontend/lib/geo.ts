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

const FLAGS: Record<string, string> = {
  France: "🇫🇷",
  Italie: "🇮🇹",
  Italy: "🇮🇹",
  "Etats-Unis": "🇺🇸",
  "États-Unis": "🇺🇸",
  USA: "🇺🇸",
  Inde: "🇮🇳",
  India: "🇮🇳",
  Thailande: "🇹🇭",
  Thaïlande: "🇹🇭",
  Thailand: "🇹🇭",
  Mexique: "🇲🇽",
  Mexico: "🇲🇽",
  Chili: "🇨🇱",
  Chile: "🇨🇱",
  Grece: "🇬🇷",
  Grèce: "🇬🇷",
  Greece: "🇬🇷",
  Japon: "🇯🇵",
  Japan: "🇯🇵",
  Espagne: "🇪🇸",
  Spain: "🇪🇸",
  "Royaume-Uni": "🇬🇧",
  "United Kingdom": "🇬🇧",
  Allemagne: "🇩🇪",
  Germany: "🇩🇪",
  Chine: "🇨🇳",
  China: "🇨🇳",
  Vietnam: "🇻🇳",
  Cambodge: "🇰🇭",
  Cambodia: "🇰🇭",
  Indonesie: "🇮🇩",
  Indonésie: "🇮🇩",
  Indonesia: "🇮🇩",
  "Coree du Sud": "🇰🇷",
  "Corée du Sud": "🇰🇷",
  "South Korea": "🇰🇷",
  Turquie: "🇹🇷",
  Turkey: "🇹🇷",
  Perou: "🇵🇪",
  Pérou: "🇵🇪",
  Peru: "🇵🇪",
  Islande: "🇮🇸",
  Iceland: "🇮🇸",
  Egypte: "🇪🇬",
  Égypte: "🇪🇬",
  Egypt: "🇪🇬",
};

const CONTINENTS: Record<string, string> = {
  France: "Europe",
  Italie: "Europe",
  Italy: "Europe",
  Grece: "Europe",
  Grèce: "Europe",
  Greece: "Europe",
  Espagne: "Europe",
  Spain: "Europe",
  "Royaume-Uni": "Europe",
  "United Kingdom": "Europe",
  Allemagne: "Europe",
  Germany: "Europe",
  "Etats-Unis": "Amerique du Nord",
  "États-Unis": "Amerique du Nord",
  USA: "Amerique du Nord",
  Mexique: "Amerique du Nord",
  Mexico: "Amerique du Nord",
  Chili: "Amerique du Sud",
  Chile: "Amerique du Sud",
  Inde: "Asie",
  India: "Asie",
  Thailande: "Asie",
  Thaïlande: "Asie",
  Thailand: "Asie",
  Japon: "Asie",
  Japan: "Asie",
  Chine: "Asie",
  China: "Asie",
  Vietnam: "Asie",
  Cambodge: "Asie",
  Cambodia: "Asie",
  Indonesie: "Asie",
  Indonésie: "Asie",
  Indonesia: "Asie",
  "Coree du Sud": "Asie",
  "Corée du Sud": "Asie",
  "South Korea": "Asie",
  Turquie: "Asie",
  Turkey: "Asie",
  Perou: "Amerique du Sud",
  Pérou: "Amerique du Sud",
  Peru: "Amerique du Sud",
  Islande: "Europe",
  Iceland: "Europe",
  Egypte: "Afrique",
  Égypte: "Afrique",
  Egypt: "Afrique",
};

export function flagFor(country: string | null | undefined): string {
  if (!country) return "🏳️";
  return FLAGS[country.trim()] || "🏳️";
}

const ISO_CODES: Record<string, string> = {
  France: "fr",
  Italie: "it",
  Italy: "it",
  "Etats-Unis": "us",
  "États-Unis": "us",
  USA: "us",
  Inde: "in",
  India: "in",
  Thailande: "th",
  Thaïlande: "th",
  Thailand: "th",
  Mexique: "mx",
  Mexico: "mx",
  Chili: "cl",
  Chile: "cl",
  Grece: "gr",
  Grèce: "gr",
  Greece: "gr",
  Japon: "jp",
  Japan: "jp",
  Espagne: "es",
  Spain: "es",
  "Royaume-Uni": "gb",
  "United Kingdom": "gb",
  Allemagne: "de",
  Germany: "de",
  Chine: "cn",
  China: "cn",
  Vietnam: "vn",
  Cambodge: "kh",
  Cambodia: "kh",
  Indonesie: "id",
  Indonésie: "id",
  Indonesia: "id",
  "Coree du Sud": "kr",
  "Corée du Sud": "kr",
  "South Korea": "kr",
  Turquie: "tr",
  Turkey: "tr",
  Perou: "pe",
  Pérou: "pe",
  Peru: "pe",
  Islande: "is",
  Iceland: "is",
  Egypte: "eg",
  Égypte: "eg",
  Egypt: "eg",
};

export function isoFor(country: string | null | undefined): string | null {
  if (!country) return null;
  return ISO_CODES[country.trim()] || null;
}

export function continentFor(country: string | null | undefined): string {
  if (!country) return "Autre";
  return CONTINENTS[country.trim()] || "Autre";
}

export const ALL_CONTINENTS = ["Europe", "Asie", "Amerique du Nord", "Amerique du Sud", "Afrique", "Oceanie"];

export const TOTAL_COUNTRIES_IN_WORLD = 195;
