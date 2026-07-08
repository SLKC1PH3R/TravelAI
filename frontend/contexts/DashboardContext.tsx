"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { downloadCarnet, fetchMe, fetchTrips, type Trip } from "@/lib/api";

type DashboardContextValue = {
  uuid: string;
  trips: Trip[];
  loading: boolean;
  firstCarnetExportAt: string | null;
  selectedTripId: string | null;
  setSelectedTripId: (id: string) => void;
  selectTrip: (id: string) => void;
  selectedTrip: Trip | null;
  downloading: boolean;
  handleDownload: () => Promise<void>;
  showMerge: boolean;
  setShowMerge: (v: boolean) => void;
  toggleMerge: () => void;
  reload: () => Promise<void>;
};

const DashboardCtx = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid") || "";

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [firstCarnetExportAt, setFirstCarnetExportAt] = useState<string | null>(null);

  function reloadMe() {
    if (!uuid) return Promise.resolve();
    return fetchMe(uuid)
      .then((me) => setFirstCarnetExportAt(me.first_carnet_export_at))
      .catch(() => {});
  }

  function reload() {
    if (!uuid) return Promise.resolve();
    setLoading(true);
    return fetchTrips(uuid)
      .then((data) => {
        setTrips(data);
        setSelectedTripId((current) => {
          const requested = searchParams.get("trip");
          if (requested && data.some((t) => t.id === requested)) return requested;
          return current && data.some((t) => t.id === current) ? current : data[0]?.id ?? null;
        });
      })
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reload();
    reloadMe();
  }, [uuid]);

  useEffect(() => {
    const requested = searchParams.get("trip");
    if (requested && trips.some((t) => t.id === requested)) setSelectedTripId(requested);
  }, [searchParams, trips]);

  useEffect(() => {
    if (searchParams.get("merge") === "1") setShowMerge(true);
  }, [searchParams]);

  const selectedTrip = trips.find((t) => t.id === selectedTripId) ?? null;

  async function handleDownload() {
    if (!selectedTrip) return;
    setDownloading(true);
    try {
      await downloadCarnet(selectedTrip.id, `carnet-${selectedTrip.title || selectedTrip.id}`);
      await reloadMe();
    } finally {
      setDownloading(false);
    }
  }

  function toggleMerge() {
    if (pathname !== "/dashboard") {
      router.push(`/dashboard?uuid=${encodeURIComponent(uuid)}&merge=1`);
    } else {
      setShowMerge((v) => !v);
    }
  }

  function selectTrip(id: string) {
    if (pathname === "/dashboard") {
      setSelectedTripId(id);
    } else {
      router.push(`/dashboard?uuid=${encodeURIComponent(uuid)}&trip=${id}`);
    }
  }

  return (
    <DashboardCtx.Provider
      value={{
        uuid,
        trips,
        loading,
        firstCarnetExportAt,
        selectedTripId,
        setSelectedTripId,
        selectTrip,
        selectedTrip,
        downloading,
        handleDownload,
        showMerge,
        setShowMerge,
        toggleMerge,
        reload,
      }}
    >
      {children}
    </DashboardCtx.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
