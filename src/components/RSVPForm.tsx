"use client";

import { useState } from "react";
import { submitRSVP } from "@/lib/storage";

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
      <div className="rsvp-success" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--ink)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--gold)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.5s ease forwards' }}>
        <div className="rsvp-success-content" style={{ width: '100%' }}>
          <h3 style={{ color: 'var(--gold)' }}>Terima Kasih, {name}!</h3>
          {status === "hadir" ? (
            <>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.8 }}>Terima kasih atas konfirmasinya. Kami menghargai doa dan dukungan Anda!</p>
              <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <img src="/thankyou.png" alt="Thank You" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} />
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
