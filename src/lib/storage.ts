import { supabase, BUCKET_NAME, isSupabaseConfigured as supabaseReady } from "./supabase";
import { EventConfig, Member, RSVP, DEFAULT_EVENTS } from "@/data/members";

// ─── Check if Supabase is configured ─────────────────
function isSupabaseConfigured(): boolean {
  return supabaseReady;
}

// ─── Supabase API ─────────────────────────────────────

export async function fetchEvents(): Promise<EventConfig[]> {
  if (!isSupabaseConfigured()) return getEventsLocal();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !events) return getEventsLocal();

  const result: EventConfig[] = [];
  for (const ev of events) {
    const { data: members } = await supabase
      .from("members")
      .select("*")
      .eq("event_id", ev.id)
      .order("created_at", { ascending: true });

    result.push({
      id: ev.id,
      title: ev.title,
      date: ev.date,
      time: ev.time,
      place: ev.place,
      campus: ev.campus,
      prodi: ev.prodi,
      batch: ev.batch,
      isActive: ev.is_active,
      createdAt: ev.created_at,
      members: (members || []).map((m) => ({
        id: m.id,
        name: m.name,
        degree: m.degree,
        nim: m.nim || "",
        topic: m.topic || "",
        type: m.type as "skripsi" | "proposal",
        emoji: m.emoji || "👨‍💻",
        photoUrl: m.photo_url || "",
        celebrationAudioUrl: m.celebration_audio_url || "",
      })),
    });
  }
  return result;
}

export async function fetchEventById(id: string): Promise<EventConfig | null> {
  if (!isSupabaseConfigured()) {
    return getEventsLocal().find((e) => e.id === id) || null;
  }

  const { data: ev } = await supabase.from("events").select("*").eq("id", id).single();
  if (!ev) return null;

  const { data: members } = await supabase.from("members").select("*").eq("event_id", id);

  return {
    id: ev.id, title: ev.title, date: ev.date, time: ev.time,
    place: ev.place, campus: ev.campus, prodi: ev.prodi,
    batch: ev.batch, isActive: ev.is_active, createdAt: ev.created_at,
    members: (members || []).map((m) => ({
      id: m.id, name: m.name, degree: m.degree, nim: m.nim || "",
      topic: m.topic || "", type: m.type, emoji: m.emoji || "👨‍💻",
      photoUrl: m.photo_url || "",
      celebrationAudioUrl: m.celebration_audio_url || "",
    })),
  };
}

export async function fetchActiveEvent(): Promise<EventConfig | null> {
  if (!isSupabaseConfigured()) {
    return getEventsLocal().find((e) => e.isActive) || null;
  }

  const { data: ev } = await supabase
    .from("events").select("*").eq("is_active", true).single();
  if (!ev) return null;
  return fetchEventById(ev.id);
}

export async function saveEvent(event: Omit<EventConfig, "members" | "createdAt">): Promise<string> {
  if (!isSupabaseConfigured()) {
    return saveEventLocal(event);
  }

  const payload = {
    title: event.title, date: event.date, time: event.time,
    place: event.place, campus: event.campus, prodi: event.prodi,
    batch: event.batch, is_active: event.isActive,
  };

  if (event.id) {
    await supabase.from("events").update(payload).eq("id", event.id);
    return event.id;
  } else {
    const { data } = await supabase.from("events").insert(payload).select("id").single();
    return data?.id || "";
  }
}

export async function deleteEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured()) { deleteEventLocal(id); return; }
  await supabase.from("events").delete().eq("id", id);
}

export async function toggleEventActive(id: string): Promise<void> {
  if (!isSupabaseConfigured()) { toggleActiveLocal(id); return; }
  // Deactivate all first
  await supabase.from("events").update({ is_active: false }).neq("id", "");
  // Then activate the selected one
  const events = await fetchEvents();
  const target = events.find((e) => e.id === id);
  if (target && !target.isActive) {
    await supabase.from("events").update({ is_active: true }).eq("id", id);
  }
}

export async function saveMember(eventId: string, member: Omit<Member, "id"> & { id?: string; photoUrl?: string; celebrationAudioUrl?: string }): Promise<string> {
  if (!isSupabaseConfigured()) { return saveMemberLocal(eventId, member); }

  const id = member.id || generateId();
  const payload = {
    id,
    event_id: eventId, name: member.name, degree: member.degree,
    nim: member.nim, topic: member.topic, type: member.type,
    emoji: member.emoji, photo_url: member.photoUrl || null,
    celebration_audio_url: member.celebrationAudioUrl || null,
  };

  // upsert: INSERT a new member or UPDATE an existing one in one path.
  // The old code keyed off `member.id`, but the admin form always supplies an
  // id, so a brand-new member always hit the UPDATE branch and matched 0 rows.
  const { error } = await supabase.from("members").upsert(payload);
  if (error) {
    console.error("[saveMember]", error.message);
    throw new Error(`Gagal menyimpan anggota ke database: ${error.message}`);
  }
  return id;
}

export async function deleteMember(memberId: string): Promise<void> {
  if (!isSupabaseConfigured()) { deleteMemberLocal(memberId); return; }
  await supabase.from("members").delete().eq("id", memberId);
}

// ─── Photo Upload ─────────────────────────────────────

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadPhoto(file: File, memberId: string): Promise<string> {
  return uploadAsset(file, `photos/${memberId}.${(file.name.split(".").pop() || "jpg").toLowerCase()}`);
}

export async function uploadCelebrationAudio(file: File, memberId: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "mp3").toLowerCase();
  return uploadAsset(file, `audio/${memberId}.${ext}`);
}

async function uploadAsset(file: File, path: string): Promise<string> {
  // Supabase not configured (local dev): base64 fallback is acceptable.
  if (!isSupabaseConfigured()) {
    return await fileToDataURL(file);
  }

  // Supabase IS configured: a failed upload must surface, not silently
  // fall back to a base64 blob stored inside the database.
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
      cacheControl: "3600",
    });

  if (uploadError) {
    console.error("[uploadAsset]", path, uploadError.message);
    throw new Error(
      `Upload ke Storage gagal: ${uploadError.message}. ` +
        `Cek bucket "${BUCKET_NAME}" sudah ada & policy upload sudah dijalankan (supabase-storage-fix.sql).`
    );
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("Upload berhasil tapi gagal mendapatkan public URL.");
  }
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function submitRSVP(eventId: string, guestName: string, status: "hadir" | "tidak_hadir" | "mungkin", message: string = ""): Promise<string> {
  const qrCode = `RSVP-${generateId().split("-")[0].toUpperCase()}`;
  
  if (!isSupabaseConfigured()) {
    console.warn("Supabase belum dikonfigurasi. RSVP tidak tersimpan di database.");
    return qrCode;
  }
  
  const { error } = await supabase.from("rsvps").insert({
    event_id: eventId,
    guest_name: guestName,
    status,
    message,
    qr_code: qrCode
  });
  
  if (error) throw new Error("Gagal mengirim RSVP: " + error.message);
  return qrCode;
}

export async function fetchRSVPs(eventId: string): Promise<RSVP[]> {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
    
  if (error || !data) return [];
  
  return data.map((d: any) => ({
    id: d.id,
    eventId: d.event_id,
    guestName: d.guest_name,
    status: d.status,
    message: d.message,
    qrCode: d.qr_code,
    createdAt: d.created_at
  }));
}

// ─── localStorage Fallback ────────────────────────────

const STORAGE_KEY = "undangan-sidang-events";

function getEventsLocal(): EventConfig[] {
  if (typeof window === "undefined") return DEFAULT_EVENTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS)); return DEFAULT_EVENTS; }
  try { return JSON.parse(raw); } catch { return DEFAULT_EVENTS; }
}

function saveEventsLocal(events: EventConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function saveEventLocal(event: Omit<EventConfig, "members" | "createdAt">): string {
  const events = getEventsLocal();
  const existing = events.findIndex((e) => e.id === event.id);
  if (existing >= 0) {
    events[existing] = { ...events[existing], ...event };
  } else {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    events.push({ ...event, id, members: [], createdAt: new Date().toISOString() });
    saveEventsLocal(events);
    return id;
  }
  saveEventsLocal(events);
  return event.id;
}

function deleteEventLocal(id: string) {
  saveEventsLocal(getEventsLocal().filter((e) => e.id !== id));
}

function toggleActiveLocal(id: string) {
  const events = getEventsLocal();
  const target = events.find((e) => e.id === id);
  saveEventsLocal(events.map((e) => ({ ...e, isActive: e.id === id ? !target?.isActive : false })));
}

function saveMemberLocal(eventId: string, member: Omit<Member, "id"> & { id?: string; photoUrl?: string; celebrationAudioUrl?: string }): string {
  const events = getEventsLocal();
  const ev = events.find((e) => e.id === eventId);
  if (!ev) return "";
  const id = member.id || generateId();
  const idx = ev.members.findIndex((m) => m.id === id);
  if (idx >= 0) {
    ev.members[idx] = { ...ev.members[idx], ...member, id } as Member;
  } else {
    ev.members.push({ ...member, id } as Member);
  }
  saveEventsLocal(events);
  return id;
}

function deleteMemberLocal(memberId: string) {
  const events = getEventsLocal();
  events.forEach((e) => { e.members = e.members.filter((m) => m.id !== memberId); });
  saveEventsLocal(events);
}

export function generateId(): string {
  // Must be a valid UUID: members.id is a Postgres UUID column, so a non-UUID
  // string is rejected with "invalid input syntax for type uuid".
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
