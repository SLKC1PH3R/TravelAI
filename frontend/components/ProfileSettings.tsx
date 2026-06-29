"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchProfile, updateProfile } from "@/lib/api";

const CSS = `
  .ta-profile-root { background: #F4F3F1; color: #0D0D0D; -webkit-font-smoothing: antialiased; }
  .ta-profile-input { width: 100%; padding: 11px 14px; border: 1px solid rgba(0,0,0,0.15); border-radius: 10px; font-size: 14px; color: #0D0D0D; outline: none; background: #FAFAFA; }
  .ta-profile-input:focus { border-color: #0D0D0D; }
  .ta-profile-input:disabled { color: #B0B0B0; cursor: not-allowed; }
  .ta-profile-submit { transition: transform .18s ease, box-shadow .18s ease; }
  .ta-profile-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
  .ta-profile-submit:disabled { opacity: 0.5; cursor: default; transform: none; box-shadow: none; }
`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfileSettings() {
  const { data: session, update } = useSession();
  const email = session?.user?.email ?? "";

  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [name, setName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    fetchProfile(email)
      .then((profile) => {
        setIsLocked(profile.is_locked);
        setName(profile.name || session?.user?.name || "");
        setPseudo(profile.snap_pseudo || "");
        setLocation(profile.location || "");
        setAvatarUrl(profile.avatar_url || session?.user?.image || "");
      })
      .catch(() => setError("Impossible de charger le profil."))
      .finally(() => setLoading(false));
  }, [email, session?.user?.name, session?.user?.image]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isLocked) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile(email, {
        name: name.trim(),
        snap_pseudo: pseudo.trim(),
        avatar_url: avatarUrl.trim(),
        location: location.trim(),
      });
      await update({ name: name.trim(), image: avatarUrl.trim() });
      setMessage("Profil mis a jour.");
    } catch {
      setError("Impossible d'enregistrer les modifications.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="ta-profile-root" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#6B6B6B" }}>
        <style>{CSS}</style>
        Chargement...
      </div>
    );
  }

  return (
    <div className="ta-profile-root">
      <style>{CSS}</style>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 28px 64px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.6px", marginBottom: 6 }}>Mon profil</h1>
        <p style={{ fontSize: 13.5, color: "#6B6B6B", marginBottom: 28 }}>Gere tes informations personnelles affichees sur TravelAI.</p>

        {isLocked && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF8E1", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 12.5, color: "#92600E" }}>
            🔒 Ce compte de demonstration est verrouille : seul l&apos;administrateur peut le modifier.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #0D0D0D" }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FFFC00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>
                {(name || email || "?").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <Field label="URL de l'avatar">
                <input
                  className="ta-profile-input"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={isLocked}
                />
              </Field>
            </div>
          </div>

          <Field label="Email">
            <input className="ta-profile-input" value={email} disabled />
          </Field>

          <Field label="Nom">
            <input className="ta-profile-input" value={name} onChange={(e) => setName(e.target.value)} disabled={isLocked} />
          </Field>

          <Field label="Pseudo Snapchat">
            <input className="ta-profile-input" value={pseudo} onChange={(e) => setPseudo(e.target.value)} disabled={isLocked} />
          </Field>

          <Field label="Lieu de residence">
            <input
              className="ta-profile-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: Paris, France"
              disabled={isLocked}
            />
          </Field>

          {error && <p style={{ fontSize: 12.5, color: "#D02828", marginBottom: 14 }}>{error}</p>}
          {message && <p style={{ fontSize: 12.5, color: "#1B8A4A", marginBottom: 14 }}>{message}</p>}

          {!isLocked && (
            <button
              type="submit"
              disabled={saving}
              className="ta-profile-submit"
              style={{ width: "100%", background: "#FFFC00", border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, color: "#0D0D0D", cursor: "pointer" }}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
