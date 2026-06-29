"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { DASHBOARD_CHROME_CSS, DashboardSidebar, DashboardTopNav, MobileTripBar } from "@/components/DashboardChrome";

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { uuid, trips, selectedTripId, selectTrip, downloading, handleDownload, showMerge, toggleMerge } = useDashboard();
  const active = pathname === "/dashboard/stats" ? "profil" : pathname === "/dashboard" ? "voyages" : undefined;

  return (
    <div style={{ background: "#F4F3F1", minHeight: "100vh" }}>
      <style>{DASHBOARD_CHROME_CSS}</style>
      <DashboardTopNav uuid={uuid} active={active} isAdmin={session?.user?.isAdmin} />

      <div style={{ display: "flex", paddingTop: 60, minHeight: "100vh" }}>
        <DashboardSidebar
          uuid={uuid}
          email={session?.user?.email ?? null}
          avatarUrl={session?.user?.image ?? null}
          trips={trips}
          selectedTripId={selectedTripId}
          onSelectTrip={selectTrip}
          downloading={downloading}
          onDownload={handleDownload}
          showMerge={showMerge}
          onToggleMerge={toggleMerge}
        />

        <main className="ta-main-pad" style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "#F4F3F1" }}>
          <MobileTripBar
            uuid={uuid}
            trips={trips}
            selectedTripId={selectedTripId}
            onSelectTrip={selectTrip}
            downloading={downloading}
            onDownload={handleDownload}
            showMerge={showMerge}
            onToggleMerge={toggleMerge}
          />
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4F3F1" }} />}>
      <DashboardProvider>
        <ShellInner>{children}</ShellInner>
      </DashboardProvider>
    </Suspense>
  );
}
