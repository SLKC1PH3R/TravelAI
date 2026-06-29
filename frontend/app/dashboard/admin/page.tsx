"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { deleteAdminUser, fetchAdminUsers, updateAdminUser, type AdminUser } from "@/lib/api";

const CSS = `
  .ta-admin-root { background: #F4F3F1; min-height: 100vh; color: #0D0D0D; -webkit-font-smoothing: antialiased; }
  .ta-admin-root *, .ta-admin-root *::before, .ta-admin-root *::after { box-sizing: border-box; }
  .ta-admin-input { border: 1px solid rgba(0,0,0,0.15); border-radius: 10px; padding: 9px 14px; font-size: 13px; outline: none; background: #FAFAFA; color: #0D0D0D; }
  .ta-admin-input:focus { border-color: #0D0D0D; }
  .ta-admin-row:hover { background: #FAFAF8; }
  .ta-admin-btn { transition: opacity .15s; cursor: pointer; }
  .ta-admin-btn:hover { opacity: 0.8; }
`;

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function initials(label: string) {
  return label.slice(0, 2).toUpperCase();
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const requesterEmail = session?.user?.email ?? "";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editLogin, setEditLogin] = useState("");
  const [editPseudo, setEditPseudo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.isAdmin) {
      router.replace("/dashboard/stats");
    }
  }, [status, session, router]);

  function reload() {
    if (!requesterEmail) return;
    setLoading(true);
    fetchAdminUsers(requesterEmail)
      .then(setUsers)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (session?.user?.isAdmin) reload();
  }, [session?.user?.isAdmin, requesterEmail]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.name, u.anonymous_uuid, u.snap_pseudo].some((v) => v?.toLowerCase().includes(q))
    );
  }, [users, query]);

  const stats = useMemo(
    () => ({
      total: users.length,
      onboarded: users.filter((u) => u.snap_pseudo).length,
      admins: users.filter((u) => u.is_admin).length,
      trips: users.reduce((s, u) => s + u.trips_count, 0),
    }),
    [users]
  );

  function openEdit(u: AdminUser) {
    setEditing(u);
    setEditLogin(u.anonymous_uuid);
    setEditPseudo(u.snap_pseudo || "");
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      await updateAdminUser(editing.id, requesterEmail, {
        anonymous_uuid: editLogin.trim(),
        snap_pseudo: editPseudo.trim(),
      });
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u: AdminUser) {
    if (!window.confirm(`Supprimer le compte de ${u.email || u.anonymous_uuid} ? Cette action est irreversible.`)) return;
    await deleteAdminUser(u.id, requesterEmail);
    reload();
  }

  if (status === "loading" || !session?.user?.isAdmin) {
    return (
      <div className="ta-admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#6B6B6B" }}>
        <style>{CSS}</style>
        Chargement...
      </div>
    );
  }

  return (
    <div className="ta-admin-root">
      <style>{CSS}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.6px" }}>Administration</h1>
            <p style={{ fontSize: 13.5, color: "#6B6B6B", marginTop: 4 }}>Gestion des comptes inscrits sur TravelAI.</p>
          </div>
          <button
            className="ta-admin-btn"
            onClick={() => router.push("/dashboard/stats")}
            style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#0D0D0D" }}
          >
            ← Retour au dashboard
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            ["Utilisateurs", stats.total],
            ["Profils Snap complets", stats.onboarded],
            ["Administrateurs", stats.admins],
            ["Voyages enregistres", stats.trips],
          ].map(([label, value]) => (
            <div key={label as string} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Comptes ({filtered.length})</span>
            <input
              className="ta-admin-input"
              placeholder="Rechercher (email, login, pseudo)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: 260 }}
            />
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", fontSize: 13, color: "#6B6B6B" }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", fontSize: 13, color: "#6B6B6B" }}>Aucun utilisateur trouve.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Utilisateur", "Login Snapchat", "Pseudo", "Role", "Voyages", "Inscrit le", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontSize: 10.5, fontWeight: 700, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFAF8", borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="ta-admin-row" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFC00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                            {initials(u.email || u.anonymous_uuid)}
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{u.email || "—"}</div>
                          {u.name && <div style={{ fontSize: 11, color: "#8A8A8A" }}>{u.name}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", fontFamily: "monospace", fontSize: 12 }}>{u.anonymous_uuid}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13 }}>{u.snap_pseudo || <span style={{ color: "#B0B0B0" }}>—</span>}</td>
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: u.is_admin ? "#FFFC00" : "#F7F7F7", color: "#0D0D0D" }}>
                        {u.is_admin ? "Admin" : "Utilisateur"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: 13 }}>{u.trips_count}</td>
                    <td style={{ padding: "12px 20px", fontSize: 12, color: "#8A8A8A" }}>{fmtDate(u.created_at)}</td>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="ta-admin-btn"
                          onClick={() => openEdit(u)}
                          style={{ background: "#F7F7F7", border: "0.5px solid rgba(0,0,0,0.09)", borderRadius: 7, padding: "6px 11px", fontSize: 11.5, fontWeight: 600 }}
                        >
                          Editer
                        </button>
                        {u.email !== requesterEmail && (
                          <button
                            className="ta-admin-btn"
                            onClick={() => handleDelete(u)}
                            style={{ background: "#FDECEC", border: "0.5px solid rgba(208,40,40,0.25)", borderRadius: 7, padding: "6px 11px", fontSize: 11.5, fontWeight: 600, color: "#D02828" }}
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, width: 380, boxShadow: "0 24px 70px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Editer le profil</h2>
            <p style={{ fontSize: 12.5, color: "#8A8A8A", marginBottom: 20 }}>{editing.email}</p>

            <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Login Snapchat
            </label>
            <input className="ta-admin-input" value={editLogin} onChange={(e) => setEditLogin(e.target.value)} style={{ width: "100%", marginBottom: 14 }} />

            <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Pseudo
            </label>
            <input className="ta-admin-input" value={editPseudo} onChange={(e) => setEditPseudo(e.target.value)} style={{ width: "100%", marginBottom: 22 }} />

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                className="ta-admin-btn"
                onClick={() => setEditing(null)}
                style={{ background: "#F7F7F7", border: "0.5px solid rgba(0,0,0,0.09)", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 600 }}
              >
                Annuler
              </button>
              <button
                className="ta-admin-btn"
                disabled={saving}
                onClick={handleSaveEdit}
                style={{ background: "#FFFC00", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
