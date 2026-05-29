"use client";

import { useState } from "react";
import { submitRSVP } from "@/lib/storage";
import confetti from "canvas-confetti";

export function RSVPForm({ eventId, defaultName = "" }: { eventId: string; defaultName?: string }) {
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState<"hadir" | "tidak_hadir" | "mungkin">("hadir");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const code = await submitRSVP(eventId, name, status, message);
      if (status === "hadir") {
        setQrCode(code);
        // Trigger a nice confetti burst for attendees
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c9b59c", "#a89072", "#d4af37", "#f0e0c8"]
        });
      } else {
        setQrCode("DONE"); // Just to show success state
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (qrCode) {
    return (
      <div className="rsvp-success rsvp-success-animate" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--ink)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--gold)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="rsvp-success-bg-glow"></div>
        <div className="rsvp-success-content" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          <div className="success-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="success-check-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 style={{ color: 'var(--gold)', fontSize: '1.8rem', marginTop: '1rem', textShadow: '0 2px 10px rgba(201, 181, 156, 0.3)' }}>Terima Kasih, {name}!</h3>
          {status === "hadir" ? (
            <>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem', fontStyle: 'italic', opacity: 0.9 }}>Konfirmasi kehadiran Anda telah kami terima. Kami sangat menantikan kehadiran Anda!</p>
              <div style={{ marginTop: '2rem', marginBottom: '1rem', transform: 'scale(1)', transition: 'transform 0.3s ease' }}>
                <img src="/thankyou.png" alt="Thank You" className="thankyou-img-animate" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }} />
              </div>
            </>
          ) : (
              <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.8 }}>Terima kasih atas konfirmasinya. Kami menghargai doa dan dukungan Anda!</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-form-container">
      <h3 className="rsvp-title">Konfirmasi Kehadiran</h3>
      <p className="rsvp-subtitle">Mohon isi form berikut untuk konfirmasi kehadiran Anda.</p>
      
      {error && <div className="rsvp-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="rsvp-form">
        <div className="form-group">
          <label>Nama Anda</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Masukkan nama lengkap"
            required 
            readOnly={!!defaultName}
            className={defaultName ? "input-readonly" : ""}
          />
        </div>
        
        <div className="form-group">
          <label>Apakah Anda akan hadir?</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="hadir">Ya, Saya akan hadir</option>
            <option value="tidak_hadir">Maaf, saya tidak bisa hadir</option>
            <option value="mungkin">Mungkin hadir</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Pesan & Doa (Opsional)</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Tulis ucapan untuk para peserta sidang..."
            rows={3}
          />
        </div>
        
        <button type="submit" className="btn btn-primary rsvp-btn" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Konfirmasi"}
        </button>
      </form>
    </div>
  );
}
