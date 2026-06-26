"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Monument } from "@/lib/api";

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
          <Marker key={monument.id} position={[monument.latitude, monument.longitude]}>
            <Popup>
              <strong>{monument.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
