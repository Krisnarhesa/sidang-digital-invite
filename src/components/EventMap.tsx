"use client";
import { PinIcon } from "./Icons";

interface Props {
  place: string;
  campus: string;
}

export default function EventMap({ place, campus }: Props) {
  const query = encodeURIComponent(`${place}, ${campus}`);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const linkSrc = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const directionSrc = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="event-map-section animate-in">
      <div className="event-map-header">
        <span className="event-map-tag">— LOKASI —</span>
        <h3 className="event-map-title">Temukan Lokasi Acara</h3>
        <p className="event-map-place">
          <PinIcon size={14} /> {place}, {campus}
        </p>
      </div>
      <div className="event-map-frame">
        <span className="event-map-corner tl" aria-hidden />
        <span className="event-map-corner tr" aria-hidden />
        <span className="event-map-corner bl" aria-hidden />
        <span className="event-map-corner br" aria-hidden />
        <iframe
          title={`Peta lokasi ${place}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="event-map-overlay" aria-hidden />
      </div>
      <div className="event-map-actions">
        <a href={linkSrc} target="_blank" rel="noopener noreferrer" className="map-btn map-btn-ghost">
          <PinIcon size={14} /> Buka di Google Maps
        </a>
        <a href={directionSrc} target="_blank" rel="noopener noreferrer" className="map-btn map-btn-primary">
          <NavigationIcon /> Petunjuk Arah
        </a>
      </div>
    </div>
  );
}

function NavigationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
