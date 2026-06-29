const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Photo = {
  id: string;
  filename: string;
  thumbnail_filename: string | null;
  taken_at: string;
  stored: boolean;
};

export type Conversation = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type Monument = {
  id: string;
  trip_id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string | null;
  visited_at: string;
  is_favorite: boolean;
  trivia_question: string | null;
  trivia_answer: string | null;
  photos: Photo[];
  conversations: Conversation[];
};

export type Trip = {
  id: string;
  user_id: string;
  country: string | null;
  city: string | null;
  started_at: string;
  ended_at: string | null;
  title: string | null;
  monuments: Monument[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export function fetchTrips(uuid: string): Promise<Trip[]> {
  return request(`/trips?uuid=${encodeURIComponent(uuid)}`);
}

export function fetchTrip(tripId: string): Promise<Trip> {
  return request(`/trips/${tripId}`);
}

export function fetchMonument(monumentId: string): Promise<Monument> {
  return request(`/monuments/${monumentId}`);
}

export function setFavorite(monumentId: string, isFavorite: boolean): Promise<Monument> {
  return request(`/monuments/${monumentId}/favorite`, {
    method: "PATCH",
    body: JSON.stringify({ is_favorite: isFavorite }),
  });
}

export function askFollowup(monumentId: string, question: string): Promise<Conversation> {
  return request(`/conversations/monument/${monumentId}?question=${encodeURIComponent(question)}`, {
    method: "POST",
  });
}

export function mergeTrips(params: {
  uuid: string;
  title: string;
  startDate: string;
  endDate: string;
  country?: string;
  city?: string;
}): Promise<Trip> {
  return request(`/trips/merge`, {
    method: "POST",
    body: JSON.stringify({
      uuid: params.uuid,
      title: params.title,
      start_date: params.startDate,
      end_date: params.endDate,
      country: params.country || null,
      city: params.city || null,
    }),
  });
}

export function generateCarnetUrl(tripId: string): string {
  return `${API_URL}/carnet/${tripId}`;
}

export async function downloadCarnet(tripId: string, filename: string): Promise<void> {
  const res = await fetch(generateCarnetUrl(tripId), { method: "POST" });
  if (!res.ok) throw new Error("Echec de generation du carnet");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export type OnboardingUser = {
  id: string;
  email: string | null;
  name: string | null;
  anonymous_uuid: string;
  snap_pseudo: string | null;
};

export function submitOnboarding(params: {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  login: string;
  pseudo: string;
}): Promise<OnboardingUser> {
  return request(`/users/onboarding`, {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      name: params.name || null,
      avatar_url: params.avatarUrl || null,
      login: params.login,
      pseudo: params.pseudo,
    }),
  });
}

export function photoUrl(photoId: string): string {
  return `${API_URL}/photos/${photoId}/file`;
}

export function thumbnailUrl(photoId: string): string {
  return `${API_URL}/photos/${photoId}/thumbnail`;
}
