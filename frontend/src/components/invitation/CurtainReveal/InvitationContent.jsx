/**
 * InvitationContent — HTML overlay rendered behind the curtain
 *
 * Fades in as the curtain opens (opacity driven by openProgress).
 * Uses Arabic text and luxury typography matching the main invitation.
 */
import { useMemo } from 'react';

export default function InvitationContent({ openProgress = 0, data }) {
  // Only show after curtain is 75 % open
  const opacity = useMemo(() => {
    if (openProgress <= 0.75) return 0;
    return (openProgress - 0.75) / 0.25;
  }, [openProgress]);

  // Slow float-up and scale-in animation driven by the opening progress
  const transform = useMemo(() => {
    const scale = 0.94 + opacity * 0.06;
    const translateY = 15 * (1 - opacity);
    return `scale(${scale}) translateY(${translateY}px)`;
  }, [opacity]);

  const wedding = data?.wedding || {};
  const guest = data?.guest || {};

  const brideName = wedding.bride_name || 'Amina';
  const groomName = wedding.groom_name || 'Yacine';
  const eventDate = wedding.event_date || '';
  const venue = wedding.venue || '';

  // Format date in Arabic
  const formattedDate = useMemo(() => {
    if (!eventDate) return '';
    try {
      const d = new Date(eventDate);
      return d.toLocaleDateString('ar-DZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return eventDate;
    }
  }, [eventDate]);

  return (
    <div
      className="curtain-invitation-content"
      style={{ opacity }}
      aria-hidden={opacity < 0.1}
    >
      <div className="curtain-invitation-inner" style={{ transform, transition: 'transform 0.1s ease-out' }}>
        {/* Golden radial glow behind the names */}
        <div className="curtain-glow" aria-hidden="true" />

        <p className="curtain-eyebrow">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>

        <h1 className="curtain-names">
          <span className="curtain-name">{groomName}</span>
          <span className="curtain-ampersand">&amp;</span>
          <span className="curtain-name">{brideName}</span>
        </h1>

        <div className="curtain-divider" aria-hidden="true">
          <svg width="120" height="2" viewBox="0 0 120 2" fill="none">
            <line x1="0" y1="1" x2="120" y2="1" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {(formattedDate || venue) && (
          <p className="curtain-details">
            {formattedDate}
            {formattedDate && venue && <span className="curtain-dot"> · </span>}
            {venue}
          </p>
        )}

        {guest.name && (
          <p className="curtain-guest-line">
            عزيزي/عزيزتي {guest.name}، يسعدنا دعوتكم
          </p>
        )}
      </div>
    </div>
  );
}
