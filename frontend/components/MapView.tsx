"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { thumbnailUrl, type Monument } from "@/lib/api";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function photoIcon(photoId: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:48px;height:48px;border-radius:50%;overflow:hidden;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">
      <img src="${thumbnailUrl(photoId)}" style="width:100%;height:100%;object-fit:cover;" />
    </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
}

function iconForMonument(monument: Monument) {
  const storedPhoto = monument.photos.find((p) => p.stored);
  return storedPhoto ? photoIcon(storedPhoto.id) : defaultIcon;
}

export default function MapView({ monuments }: { monuments: Monument[] }) {
  const points = monuments.filter((m) => m.latitude !== 0 || m.longitude !== 0);
  const center: [number, number] = points.length
    ? [points[0].latitude, points[0].longitude]
    : [48.8566, 2.3522];

  return (
    <div className="h-96 w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer center={center} zoom={points.length ? 5 : 2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((monument) => (
          <Marker key={monument.id} position={[monument.latitude, monument.longitude]} icon={iconForMonument(monument)}>
            <Popup>
              <strong>{monument.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
