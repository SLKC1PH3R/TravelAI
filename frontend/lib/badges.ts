import { type Monument, type Trip } from "@/lib/api";
import { continentFor } from "@/lib/geo";

export type Badge = {
  code: string;
  name: string;
  desc: string;
  unlocked: boolean;
  progress: number;
  target: number;
};

function longestConsecutiveDayStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = Array.from(
    new Set(dates.map((d) => Math.floor(d.getTime() / 86400000)))
  ).sort((a, b) => a - b);

  let longest = 1;
  let current = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function computeBadges(
  trips: Trip[],
  monuments: Monument[],
  firstCarnetExportAt: string | null
): Badge[] {
  const unescoCount = monuments.filter((m) => m.is_unesco).length;

  const asianCountries = new Set(
    trips
      .filter((t) => t.country && continentFor(t.country) === "Asie")
      .map((t) => t.country as string)
  );

  const streak = longestConsecutiveDayStreak(monuments.map((m) => new Date(m.visited_at)));

  return [
    {
      code: "unesco-10",
      name: "10 monuments UNESCO",
      desc: "Decouvre 10 sites classes au patrimoine mondial.",
      unlocked: unescoCount >= 10,
      progress: Math.min(unescoCount, 10),
      target: 10,
    },
    {
      code: "asia-explorer",
      name: "Explorateur de l'Asie",
      desc: "Scanne un monument dans 5 pays asiatiques differents.",
      unlocked: asianCountries.size >= 5,
      progress: Math.min(asianCountries.size, 5),
      target: 5,
    },
    {
      code: "streak-5",
      name: "Serie de 5 jours",
      desc: "5 jours consecutifs avec au moins une decouverte.",
      unlocked: streak >= 5,
      progress: Math.min(streak, 5),
      target: 5,
    },
    {
      code: "first-carnet",
      name: "Premier carnet complete",
      desc: "Exporte ton tout premier carnet de voyage en PDF.",
      unlocked: firstCarnetExportAt !== null,
      progress: firstCarnetExportAt !== null ? 1 : 0,
      target: 1,
    },
  ];
}
