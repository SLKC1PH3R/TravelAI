"use client";

import { photoUrl, thumbnailUrl, type Photo } from "@/lib/api";

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const stored = photos.filter((p) => p.stored);

  if (stored.length === 0) {
    return <p className="text-sm text-slate-500">Aucune photo conservee pour ce monument.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {stored.map((photo) => (
        <a
          key={photo.id}
          href={photoUrl(photo.id)}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-lg border border-slate-200"
        >
          <img
            src={photo.thumbnail_filename ? thumbnailUrl(photo.id) : photoUrl(photo.id)}
            alt="Photo de voyage"
            className="h-32 w-full object-cover transition hover:scale-105"
          />
        </a>
      ))}
    </div>
  );
}
