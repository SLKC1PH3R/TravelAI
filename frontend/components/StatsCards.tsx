"use client";

export default function StatsCards({
  monumentsCount,
  countriesCount,
  conversationsCount,
}: {
  monumentsCount: number;
  countriesCount: number;
  conversationsCount: number;
}) {
  const stats = [
    { label: "Monuments visites", value: monumentsCount },
    { label: "Pays decouverts", value: countriesCount },
    { label: "Conversations", value: conversationsCount },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-brand-600">{stat.value}</p>
          <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
