"use client";
import {
  CalendarIcon,
  CapIcon,
  CapTasselIcon,
  ClockIcon,
  DiamondIcon,
  LaurelLeftIcon,
  LaurelRightIcon,
  MailIcon,
  PinIcon,
} from "@/components/Icons";
import { RSVPForm } from "@/components/RSVPForm";
import { EventConfig, Member } from "@/data/members";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { getCelebrationVariantFor, playCelebrationFor } from "@/lib/celebrationAudio";
import { fetchActiveEvent, fetchEventById } from "@/lib/storage";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";

// Heavy / interaction-only components are code-split so they stay out of the
// initial bundle. They rely on browser APIs (canvas, window), so ssr: false.
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });
const ConfettiCanvas = dynamic(() => import("@/components/ConfettiCanvas"), { ssr: false });
const CelebrationEffect = dynamic(() => import("@/components/CelebrationEffect"), { ssr: false });
const CongratsOverlay = dynamic(() => import("@/components/CongratsOverlay"), { ssr: false });
const DegreeRevealCard = dynamic(() => import("@/components/DegreeRevealCard"), { ssr: false });
const EventMap = dynamic(() => import("@/components/EventMap"), { ssr: false });
const AudioPlayer = dynamic(() => import("@/components/AudioPlayer"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { ssr: false });
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });

function InvitationContent() {
  const searchParams = useSearchParams();

  // Robust param extraction - support both ?to= and accidentally double ?, plus aliases
  const getParam = (...keys: string[]): string => {
    for (const k of keys) {
      const v = searchParams.get(k);
      if (v) return v;
    }
    if (typeof window !== "undefined") {
      const raw = window.location.search.slice(1).replace(/\?/g, "&");
      const sp = new URLSearchParams(raw);
      for (const k of keys) {
        const v = sp.get(k);
        if (v) return v;
      }
    }
    return "";
  };

  const guestName = getParam("to", "name", "guest", "untuk");
  const eventId = getParam("event", "id");

  const [entered, setEntered] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [celebrationStarted, setCelebrationStarted] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [celebrationVariant, setCelebrationVariant] = useState(0);
  const [congratsMember, setCongratsMember] = useState<Member | null>(null);
  const [event, setEvent] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionsRef = useRef<HTMLDivElement>(null);

  const typingTexts = guestName
    ? [`Kepada Yth. ${guestName}...`, "Anda Diundang untuk Hadir", "Sidang Skripsi"]
    : ["Dengan Hormat Kami Mengundang Anda...", "Sidang Skripsi"];
  const typed = useTypingEffect(typingTexts);

  useEffect(() => {
    async function loadEvent() {
      let ev: EventConfig | null = null;
      if (eventId) {
        ev = await fetchEventById(eventId);
      }
      if (!ev) {
        ev = await fetchActiveEvent();
      }
      setEvent(ev);
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!entered || !sectionsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { 
        let staggerCount = 0;
        entries.forEach((e) => { 
          if (e.isIntersecting) {
            staggerCount++;
            setTimeout(() => {
              e.target.classList.add("visible");
            }, staggerCount * 150);
            observer.unobserve(e.target);
          } 
        }); 
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    const timeoutId = setTimeout(() => {
      if (sectionsRef.current) {
        sectionsRef.current.querySelectorAll(".animate-in").forEach((el) => observer.observe(el));
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [entered]);

  const handleReveal = (member: Member) => {
    setCongratsMember(member);
    setConfettiActive(false);
    setCelebrationVariant(getCelebrationVariantFor(member.id));
    setTimeout(() => {
      setConfettiActive(true);
      setCelebrationKey((k) => k + 1);
      playCelebrationFor(member.id, member.celebrationAudioUrl);
    }, 50);
  };

  const handleCloseCongrats = () => {
    setCongratsMember(null);
    setConfettiActive(false);
  };

  if (loading) return null;

  // No active event = no invitation
  if (!event) {
    return (
      <>
        <ParticleBackground />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div className="empty-invitation">
            <div className="empty-ornament">✦</div>
            <h1>Tidak Ada Undangan Aktif</h1>
            <p>Saat ini tidak ada sidang atau seminar yang dijadwalkan.</p>
            <div className="empty-ornament bottom">✦</div>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
    catch { return d; }
  };

  const eventCards = [
    { Icon: CalendarIcon, label: "Tanggal", value: formatDate(event.date) },
    { Icon: ClockIcon, label: "Waktu", value: event.time + " WITA" },
    { Icon: PinIcon, label: "Tempat", value: event.place },
    { Icon: CapIcon, label: "Kampus", value: event.campus },
  ];

  return (
    <>
      <ParticleBackground />
      <ConfettiCanvas active={confettiActive} />
      <CelebrationEffect key={celebrationKey} active={confettiActive} variant={celebrationVariant} />
      <AudioPlayer autoPlay={entered} />
      <ThemeToggle />
      <CongratsOverlay member={congratsMember} onClose={handleCloseCongrats} />

      {!entered && (
        <LoadingScreen onEnter={() => setEntered(true)} guestName={guestName} />
      )}

      <main className={`main-content ${entered ? "" : "hidden"}`} ref={sectionsRef}>
        {/* Guest greeting badge */}
        {guestName && (
          <div className="guest-badge">
            <span className="guest-badge-icon"><MailIcon size={14} /></span>
            <span>Kepada: <strong>{guestName}</strong></span>
          </div>
        )}

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-grid-overlay" />
          <div className="hero-frame tl" />
          <div className="hero-frame tr" />
          <div className="hero-frame bl" />
          <div className="hero-frame br" />
          <div className="hero-laurel left"><LaurelLeftIcon size={140} /></div>
          <div className="hero-laurel right"><LaurelRightIcon size={140} /></div>
          <div className="hero-ornament top-left">✦</div>
          <div className="hero-ornament top-right">✦</div>
          <div className="hero-ornament bottom-left">✦</div>
          <div className="hero-ornament bottom-right">✦</div>
          <div className="hero-content">
            <div className="tech-badge animate-in">
              <span className="badge-dot" />
              <span>{event.prodi}</span>
            </div>
            <div className="hero-emblem">
              <div className="logo-circle">
                <img src="/logo_hmti.png" alt="HMTI Udayana" className="hero-emblem-img" />
              </div>
            </div>
            <h1 className="hero-title animate-in">
              <span className="title-line line-1">UNDANGAN</span>
              <span className="title-line line-2">SIDANG <span className="text-gradient">SKRIPSI</span></span>
            </h1>
            <p className="hero-subtitle animate-in">
              <span>{typed}</span>
              <span className="cursor-blink">|</span>
            </p>
            <div className="scroll-indicator animate-in">
              <div className="mouse"><div className="wheel" /></div>
              <span>Scroll Down</span>
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="event-section">
          <div className="section-header animate-in">
            <div className="section-ornament">— ✦ —</div>
            <h2 className="section-title">Detail Acara</h2>
            <p className="section-subtitle">{event.title}</p>
          </div>
          <div className="event-cards">
            {eventCards.map((c, i) => (
              <div className="event-card animate-in" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="card-icon"><c.Icon size={32} /></div>
                <div className="card-label">{c.label}</div>
                <div className="card-value">{c.value}</div>
                <div className="card-glow" />
              </div>
            ))}
          </div>
          <EventMap place={event.place} campus={event.campus} />
        </section>

        {/* Batch Members */}
        <section className="batch-section">
          <div className="section-header animate-in">
            <div className="section-ornament">— ✦ —</div>
            <h2 className="section-title">Peserta Sidang</h2>
            <div className="batch-label">TEKNOLOGI INFORMASI — {event.batch}</div>
          </div>
          <div className="members-grid">
            {event.members.map((m, i) => (
              <div className="member-card animate-in" key={m.id} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="member-card-border" />
                <div className="member-avatar">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} className="member-photo" />
                  ) : (
                    <span className="member-emoji">{m.emoji}</span>
                  )}
                </div>
                <div className="member-info">
                  <div className="member-name">{m.name}</div>
                  <div className="member-nim">NIM: {m.nim}</div>
                  <div className="member-topic">{m.topic}</div>
                  <span className={`member-badge ${m.type === "skripsi" ? "badge-skripsi" : "badge-proposal"}`}>
                    {m.type === "skripsi" ? "SIDANG SKRIPSI" : "SEMINAR PROPOSAL"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="closing-section">
          <div className="animate-in">
            <div className="closing-ornament">✦</div>
            <div className="closing-icon"><CapTasselIcon size={64} /></div>
            <h2 className="closing-title">Suatu Kehormatan</h2>
            <p className="closing-text">
              Apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
              dalam acara sidang skripsi kami.
            </p>
            <div className="closing-quote-wrap">
              <DiamondIcon size={20} />
              <div className="closing-quote">
                "Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program"
              </div>
              <DiamondIcon size={20} />
            </div>
            <div className="closing-quote-author">
              <span className="author-name">— Linus Torvalds —</span>
              <span className="author-title">Creator of Linux</span>
            </div>
            <div className="tech-footer">
              <span className="code-comment">— Crafted with passion &amp; perseverance —</span>
              <span className="code-comment">{event.batch}</span>
            </div>
            <div className="closing-ornament bottom">✦</div>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="rsvp-section" style={{ padding: "4rem 1rem", position: "relative", zIndex: 10 }}>
          <RSVPForm eventId={event.id} defaultName={guestName || ""} />
        </section>

        {/* Degree Reveal — only for skripsi members */}
        {event.members.some((m) => m.type === "skripsi") && (
          <section className="reveal-section">
            <div className="section-header animate-in">
              <div className="section-ornament">— ✦ —</div>
              <h2 className="section-title">Reveal Gelar 🎓</h2>
              <p className="reveal-instruction">Klik pada plester hitam untuk reveal gelar!</p>
            </div>
            <div className="reveal-cards">
              {event.members.filter((m) => m.type === "skripsi").map((m, i) => (
                <div className="animate-in" key={m.id} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <DegreeRevealCard member={m} onReveal={handleReveal} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <InvitationContent />
    </Suspense>
  );
}
