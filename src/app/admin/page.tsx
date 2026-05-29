"use client";
import {
  CalendarIcon,
  CameraIcon,
  CheckIcon, ChevronDownIcon, ChevronUpIcon,
  ClockIcon,
  EditIcon,
  EyeIcon,
  GearIcon,
  LinkIcon,
  MailIcon,
  PinIcon,
  PlusIcon,
  PowerIcon,
  SaveIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/Icons";
import { EventConfig, Member, RSVP } from "@/data/members";
import { deleteEvent, deleteMember, fetchEvents, fetchRSVPs, generateId, saveEvent, saveMember, toggleEventActive, uploadCelebrationAudio, uploadPhoto } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import "./admin.css";

const EMPTY_MEMBER: Omit<Member, "id"> = {
  name: "", degree: "S.Kom", nim: "", topic: "", type: "skripsi", emoji: "👨‍💻",
};
const EMOJIS = ["👨‍💻","👩‍💻","🧑‍💻","👨‍🎓","👩‍🎓","👩‍🔬","👨‍🔬","🧑‍🎓"];

export default function AdminPage() {
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editEvent, setEditEvent] = useState<EventConfig | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [rsvps, setRsvps] = useState<Record<string, RSVP[]>>({});

  const [eventForm, setEventForm] = useState({
    title: "", date: "", time: "09:00", place: "", campus: "",
    prodi: "PROGRAM STUDI TEKNOLOGI INFORMASI", batch: "ANGKATAN 2022",
  });
  const [memberForm, setMemberForm] = useState<Omit<Member, "id">>(EMPTY_MEMBER);

  // Auth States
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [customGuest, setCustomGuest] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const load = useCallback(async () => {
    if (!session) return;
    const data = await fetchEvents();
    setEvents(data);
    
    const rsvpMap: Record<string, RSVP[]> = {};
    for (const ev of data) {
      rsvpMap[ev.id] = await fetchRSVPs(ev.id);
    }
    setRsvps(rsvpMap);
  }, [session]);

  useEffect(() => {
    if (session) {
      load();
    }
  }, [load, session]);

  const openNewEvent = () => {
    setEditEvent(null);
    setEventForm({ title: "", date: "", time: "09:00", place: "", campus: "", prodi: "PROGRAM STUDI TEKNOLOGI INFORMASI", batch: "ANGKATAN 2022" });
    setShowEventModal(true);
  };

  const openEditEvent = (ev: EventConfig) => {
    setEditEvent(ev);
    setEventForm({ title: ev.title, date: ev.date, time: ev.time, place: ev.place, campus: ev.campus, prodi: ev.prodi, batch: ev.batch });
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date) return;
    setSaving(true);
    await saveEvent({
      id: editEvent?.id || "",
      ...eventForm,
      isActive: editEvent?.isActive || false,
    });
    await load();
    setSaving(false);
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Hapus event ini beserta semua anggotanya?")) return;
    await deleteEvent(id);
    await load();
  };

  const handleToggleActive = async (id: string) => {
    await toggleEventActive(id);
    await load();
  };

  const openNewMember = (eventId: string) => {
    setActiveEventId(eventId);
    setEditMember(null);
    setMemberForm(EMPTY_MEMBER);
    setPhotoFile(null);
    setAudioFile(null);
    setShowMemberModal(true);
  };

  const openEditMember = (eventId: string, member: Member) => {
    setActiveEventId(eventId);
    setEditMember(member);
    setMemberForm({ name: member.name, degree: member.degree, nim: member.nim, topic: member.topic, type: member.type, emoji: member.emoji });
    setPhotoFile(null);
    setAudioFile(null);
    setShowMemberModal(true);
  };

  const handleSaveMember = async () => {
    if (!memberForm.name || !activeEventId) return;
    setSaving(true);

    const memberId = editMember?.id || generateId();
    let photoUrl = editMember?.photoUrl || "";
    let celebrationAudioUrl = editMember?.celebrationAudioUrl || "";

    if (photoFile) {
      try {
        photoUrl = await uploadPhoto(photoFile, memberId);
      } catch (e) {
        console.error("Photo upload failed:", e);
        alert((e as Error).message || "Upload foto gagal. Cek console untuk detail.");
        setSaving(false);
        return;
      }
    }

    if (audioFile) {
      try {
        celebrationAudioUrl = await uploadCelebrationAudio(audioFile, memberId);
      } catch (e) {
        console.error("Audio upload failed:", e);
        alert((e as Error).message || "Upload audio gagal. Cek console untuk detail.");
        setSaving(false);
        return;
      }
    }

    try {
      await saveMember(activeEventId, {
        ...(editMember ? { id: editMember.id } : { id: memberId }),
        ...memberForm,
        ...(photoUrl ? { photoUrl } : {}),
        ...(celebrationAudioUrl ? { celebrationAudioUrl } : {}),
      });
    } catch (e) {
      console.error("Save member failed:", e);
      alert((e as Error).message || "Gagal menyimpan anggota. Cek console untuk detail.");
      setSaving(false);
      return;
    }

    await load();
    setSaving(false);
    setShowMemberModal(false);
    setPhotoFile(null);
    setAudioFile(null);
  };

  const handleDeleteMember = async (memberId: string) => {
    await deleteMember(memberId);
    await load();
  };

  const copyLink = (ev: EventConfig, guestName?: string) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    let url = base;
    if (ev.isActive) {
      url += guestName ? `/?to=${encodeURIComponent(guestName)}` : `/`;
    } else {
      url += guestName ? `/?event=${ev.id}&to=${encodeURIComponent(guestName)}` : `/?event=${ev.id}`;
    }
    navigator.clipboard.writeText(url);
    setCopied(guestName || ev.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
    catch { return d; }
  };

  if (authLoading) {
    return (
      <div className="admin-page">
        <div className="admin-login-container">
          <div className="admin-loading-spinner">Memeriksa autentikasi...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h2>Login Bang Admin</h2>
            <p>Silakan Masuk MinTI</p>
            {loginError && <div className="admin-login-error">{loginError}</div>}
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <PowerIcon size={16} />
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1><GearIcon size={22} /> Admin Panel</h1>
          <p>Kelola undangan sidang skripsi</p>
        </div>
        <div className="admin-header-actions">
          <a href="/" className="btn btn-ghost"><EyeIcon size={14} /> Lihat Undangan</a>
          <button className="btn btn-ghost" onClick={handleLogout}><PowerIcon size={14} /> Logout</button>
          <button className="btn btn-primary" onClick={openNewEvent}><PlusIcon size={14} /> Buat Event Baru</button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><MailIcon size={48} /></div>
          <p>Belum ada event. Buat event baru untuk mulai!</p>
        </div>
      ) : (
        <div className="event-list">
          {events.map((ev) => (
            <div key={ev.id} className={`event-item ${ev.isActive ? "active-event" : ""}`}>
              <div className="event-top">
                <div>
                  <div className="event-title">{ev.title}</div>
                  <div className="event-meta">
                    <span><CalendarIcon size={14} /> {formatDate(ev.date)}</span>
                    <span><ClockIcon size={14} /> {ev.time}</span>
                    <span><PinIcon size={14} /> {ev.place}</span>
                    <span><UsersIcon size={14} /> {ev.members.length} peserta</span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span className={`status-badge ${ev.isActive ? "status-active" : "status-inactive"}`}>
                      {ev.isActive ? "● AKTIF" : "○ NONAKTIF"}
                    </span>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(ev.id)}>
                    <PowerIcon size={12} /> {ev.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEditEvent(ev)}>
                    <EditIcon size={12} /> Edit
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => copyLink(ev)}>
                    <LinkIcon size={12} /> Link
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setExpandedEvent(expandedEvent === ev.id ? null : ev.id)}>
                    {expandedEvent === ev.id ? <><ChevronUpIcon size={12} /> Tutup</> : <><ChevronDownIcon size={12} /> Detail</>}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEvent(ev.id)} aria-label="Hapus event">
                    <TrashIcon size={12} />
                  </button>
                </div>
              </div>

              {copied === ev.id && <div className="link-copied"><CheckIcon size={12} /> Link tersalin</div>}

              {expandedEvent === ev.id && (
                <>
                  <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
                    <span className="section-comment">— Anggota Kelompok —</span>
                    <button className="btn btn-primary btn-sm" onClick={() => openNewMember(ev.id)}>
                      <PlusIcon size={12} /> Tambah Anggota
                    </button>
                  </div>
                  {ev.members.length === 0 ? (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-soft)", fontSize: "1rem", marginTop: "1.2rem", textAlign: "center" }}>
                      Belum ada anggota. Tambahkan peserta sidang.
                    </p>
                  ) : (
                    <div className="members-table">
                      <table>
                        <thead><tr><th></th><th>Nama</th><th>NIM</th><th>Gelar</th><th>Jenis</th><th>Topik</th><th>Link</th><th></th></tr></thead>
                        <tbody>
                          {ev.members.map((m) => (
                            <tr key={m.id}>
                              <td>
                                {m.photoUrl ? (
                                  <img src={m.photoUrl} alt={m.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                                ) : (
                                  <span style={{ fontSize: "1.4rem" }}>{m.emoji}</span>
                                )}
                              </td>
                              <td style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{m.name}</td>
                              <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "var(--mocha-deep)" }}>{m.nim}</td>
                              <td>{m.degree}</td>
                              <td>
                                <span className={`status-badge ${m.type === "skripsi" ? "status-active" : "status-inactive"}`}>
                                  {m.type === "skripsi" ? "Skripsi" : "Proposal"}
                                </span>
                              </td>
                              <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontStyle: "italic" }}>{m.topic}</td>
                              <td>
                                <button className="btn btn-ghost btn-sm" onClick={() => copyLink(ev, m.name)} aria-label="Salin link">
                                  <LinkIcon size={12} />
                                </button>
                                {copied === m.name && <span className="link-copied"><CheckIcon size={10} /></span>}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button className="btn btn-ghost btn-sm" onClick={() => openEditMember(ev.id, m)} aria-label="Edit anggota">
                                    <EditIcon size={12} />
                                  </button>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMember(m.id)} aria-label="Hapus anggota">
                                    <TrashIcon size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="section-comment">— Daftar RSVP —</span>
                  </div>
                  {(!rsvps[ev.id] || rsvps[ev.id].length === 0) ? (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-soft)", fontSize: "1rem", marginTop: "1.2rem", textAlign: "center" }}>
                      Belum ada tamu yang mengonfirmasi kehadiran.
                    </p>
                  ) : (
                    <div className="members-table">
                      <table>
                        <thead><tr><th>Nama Tamu</th><th>Status</th><th>Pesan</th><th>Tiket QR</th></tr></thead>
                        <tbody>
                          {rsvps[ev.id].map((r) => (
                            <tr key={r.id}>
                              <td style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{r.guestName}</td>
                              <td>
                                <span className={`status-badge ${r.status === "hadir" ? "status-active" : r.status === "mungkin" ? "status-warning" : "status-inactive"}`}>
                                  {r.status === "hadir" ? "Hadir" : r.status === "mungkin" ? "Mungkin" : "Tidak Hadir"}
                                </span>
                              </td>
                              <td style={{ fontStyle: "italic", fontSize: "0.85rem", maxWidth: "200px", opacity: 0.8 }}>{r.message || "-"}</td>
                              <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "var(--mocha)" }}>
                                {r.status === "hadir" ? r.qrCode : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="link-box">
                    <label><LinkIcon size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> Link Undangan Umum</label>
                    <div className="link-url" onClick={() => copyLink(ev)}>
                      {typeof window !== "undefined" ? window.location.origin : ""}{ev.isActive ? "/" : `/?event=${ev.id}`}
                    </div>
                  </div>

                  <div className="link-box" style={{ marginTop: "1rem" }}>
                    <label><LinkIcon size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> Link Khusus Tamu</label>
                    <p style={{ fontSize: "0.75rem", color: "var(--ink-soft)", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
                      Ketik nama tamu untuk membuat link khusus yang akan menyapa mereka di halaman awal.
                    </p>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                      <input 
                        type="text" 
                        placeholder="Contoh: Budi Santoso" 
                        value={customGuest} 
                        onChange={(e) => setCustomGuest(e.target.value)}
                        style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--surface-2)", color: "var(--ink)", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => copyLink(ev, customGuest || undefined)} disabled={!customGuest.trim()}>
                        Salin Link
                      </button>
                    </div>
                    {customGuest.trim() && (
                      <div className="link-url" onClick={() => copyLink(ev, customGuest)}>
                        {typeof window !== "undefined" ? window.location.origin : ""}{ev.isActive ? `/?to=${encodeURIComponent(customGuest)}` : `/?event=${ev.id}&to=${encodeURIComponent(customGuest)}`}
                      </div>
                    )}
                    {copied === customGuest && customGuest && <div className="link-copied" style={{ marginTop: "8px" }}><CheckIcon size={12} /> Link untuk {customGuest} tersalin!</div>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editEvent ? <><EditIcon size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Edit Event</> : <><PlusIcon size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Buat Event Baru</>}</div>
            <div className="form-group">
              <label>Judul Event</label>
              <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Sidang Skripsi Batch TI 2022" />
            </div>
            <div className="form-row">
              <div className="form-group"><label>Tanggal</label><input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} /></div>
              <div className="form-group"><label>Waktu</label><input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Tempat</label><input value={eventForm.place} onChange={(e) => setEventForm({ ...eventForm, place: e.target.value })} placeholder="Ruang Sidang Lt. 3" /></div>
              <div className="form-group"><label>Kampus</label><input value={eventForm.campus} onChange={(e) => setEventForm({ ...eventForm, campus: e.target.value })} placeholder="Universitas XYZ" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Program Studi</label><input value={eventForm.prodi} onChange={(e) => setEventForm({ ...eventForm, prodi: e.target.value })} /></div>
              <div className="form-group"><label>Angkatan</label><input value={eventForm.batch} onChange={(e) => setEventForm({ ...eventForm, batch: e.target.value })} /></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowEventModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveEvent} disabled={saving}>
                <SaveIcon size={14} /> {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editMember ? <><EditIcon size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Edit Anggota</> : <><PlusIcon size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Tambah Anggota</>}</div>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="form-row">
              <div className="form-group"><label>NIM</label><input value={memberForm.nim} onChange={(e) => setMemberForm({ ...memberForm, nim: e.target.value })} placeholder="2022101001" /></div>
              <div className="form-group"><label>Gelar</label><input value={memberForm.degree} onChange={(e) => setMemberForm({ ...memberForm, degree: e.target.value })} placeholder="S.Kom" /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Jenis Sidang</label>
                <select value={memberForm.type} onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value as "skripsi" | "proposal" })}>
                  <option value="skripsi">Sidang Skripsi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Emoji</label>
                <select value={memberForm.emoji} onChange={(e) => setMemberForm({ ...memberForm, emoji: e.target.value })}>
                  {EMOJIS.map((em) => <option key={em} value={em}>{em}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Judul Skripsi</label>
              <input value={memberForm.topic} onChange={(e) => setMemberForm({ ...memberForm, topic: e.target.value })} placeholder="Implementasi Machine Learning untuk..." />
            </div>
            <div className="form-group">
              <label><CameraIcon size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> Foto (opsional)</label>
              {(photoFile || editMember?.photoUrl) && (
                <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={photoFile ? URL.createObjectURL(photoFile) : editMember?.photoUrl}
                    alt="Preview"
                    style={{
                      width: 64, height: 64, borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid var(--glass-border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                    {photoFile ? `Baru: ${photoFile.name}` : "Foto saat ini"}
                  </span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </div>
            <div className="form-group">
              <label>♪ Audio Selebrasi (opsional, MP3 — diputar saat lepas gelar)</label>
              {(audioFile || editMember?.celebrationAudioUrl) && (
                <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <audio
                    controls
                    src={audioFile ? URL.createObjectURL(audioFile) : editMember?.celebrationAudioUrl}
                    style={{ height: 36, maxWidth: "100%" }}
                  />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                    {audioFile ? `Baru: ${audioFile.name}` : "Audio saat ini"}
                  </span>
                </div>
              )}
              <input type="file" accept="audio/*,.mp3,.wav,.ogg" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-mute)", fontSize: "0.85rem", marginTop: 6 }}>
                Tip: pakai sound effect pendek (1-3 detik) seperti &quot;cihuy!&quot;, applause, atau cheer. Kosongkan untuk pakai chord default.
              </p>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowMemberModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveMember} disabled={saving}>
                <SaveIcon size={14} /> {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
