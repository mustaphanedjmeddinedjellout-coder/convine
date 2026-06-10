import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import GoldLine from '../../shared/GoldLine';
import WaxSeal from '../../shared/WaxSeal';

/**
 * InvitationCard — the engraved cotton-paper card, pure HTML/CSS.
 *
 * The reveal is timed against the curtain: `revealed` flips the moment
 * the guest touches the drapes, and the card begins rising ~0.9s later,
 * so the widening gap between the panels discovers it already in motion.
 * Contents then arrive in reading order; the gold rules draw outward
 * from their centre dots; the wax seal is pressed in last. Afterwards
 * the card breathes — a 3px, 3.6s sine float, felt rather than seen.
 */
export default function InvitationCard({ revealed = false, data }) {
  const cardRef = useRef(null);
  const eyebrowRef = useRef(null);
  const monogramRef = useRef(null);
  const namesRef = useRef(null);
  const ruleRef = useRef(null);
  const detailsRef = useRef(null);
  const guestRef = useRef(null);
  const sealRef = useRef(null);
  const hintRef = useRef(null);
  const didReveal = useRef(false);

  const wedding = data?.wedding || {};
  const guest = data?.guest || {};

  const brideName = wedding.bride_name || 'Amina';
  const groomName = wedding.groom_name || 'Yacine';
  const venue = wedding.venue || '';
  const eventTime = wedding.event_time || '';

  const formattedDate = useMemo(() => {
    if (!wedding.event_date) return '';
    try {
      return new Date(wedding.event_date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return wedding.event_date;
    }
  }, [wedding.event_date]);

  const sealInitial = (groomName || 'A').trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!revealed || didReveal.current || !cardRef.current) return;
    didReveal.current = true;

    const blocks = [
      eyebrowRef.current,
      monogramRef.current,
      namesRef.current,
      ruleRef.current,
      detailsRef.current,
      guestRef.current,
      sealRef.current,
    ].filter(Boolean);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set([cardRef.current, ...blocks], { opacity: 1, y: 0 });
      if (hintRef.current) gsap.set(hintRef.current, { opacity: 0.55 });
      return;
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(cardRef);

      // Gold rules start undrawn — lines grow outward from the centre dot
      gsap.set(q('.gl-line--left'), { transformOrigin: '100% 50%', scaleX: 0 });
      gsap.set(q('.gl-line--right'), { transformOrigin: '0% 50%', scaleX: 0 });
      gsap.set(q('.gl-ring, .gl-dot'), { transformOrigin: '50% 50%', scale: 0 });

      // 0.9s after the touch the curtain gap is widening — the card is
      // discovered mid-rise rather than appearing from nothing.
      const tl = gsap.timeline({ delay: 0.9 });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' },
      );

      // Reading order
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=1.2');
      tl.fromTo(monogramRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.7');
      tl.to(q('.invitation-card__monogram .gl-ring, .invitation-card__monogram .gl-dot'), { scale: 1, duration: 0.5, ease: 'power2.out' }, '<');
      tl.to(q('.invitation-card__monogram .gl-line'), { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<0.1');
      tl.fromTo(namesRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out' }, '-=0.8');
      tl.fromTo(ruleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.6');
      tl.to(q('.invitation-card__rule .gl-ring, .invitation-card__rule .gl-dot'), { scale: 1, duration: 0.5, ease: 'power2.out' }, '<');
      tl.to(q('.invitation-card__rule .gl-line'), { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<0.1');
      tl.fromTo(detailsRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.7');
      if (guestRef.current) {
        tl.fromTo(guestRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.7');
      }

      // The seal is pressed in — scale settles with a slight rotation
      tl.fromTo(
        sealRef.current,
        { opacity: 0, scale: 0.55, rotation: -6 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.4)' },
        '-=0.5',
      );

      // Scroll affordance appears once the card has fully arrived
      if (hintRef.current) {
        tl.to(hintRef.current, { opacity: 0.55, duration: 1.2, ease: 'power2.out' }, '+=0.4');
      }

      // Idle breath — felt, not seen. Created here (not in a callback)
      // so the context reverts it if the component unmounts mid-flight.
      const breath = gsap.to(cardRef.current, {
        y: -3,
        duration: 3.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      tl.call(() => breath.play());
    }, cardRef);

    return () => ctx.revert();
  }, [revealed]);

  return (
    <section className="invite-scene card-scene">
      {/* Starts hidden; GSAP discovers it as the curtain parts */}
      <article ref={cardRef} className="invitation-card" style={{ opacity: 0 }}>
        <p ref={eyebrowRef} className="label invitation-card__eyebrow">
          Together with their families
        </p>

        <div ref={monogramRef} className="invitation-card__monogram">
          <GoldLine width={90} />
        </div>

        <h1 ref={namesRef} className="invitation-card__names">
          <span className="names">{groomName}</span>
          <span className="ampersand">&amp;</span>
          <span className="names">{brideName}</span>
        </h1>

        <div ref={ruleRef} className="invitation-card__rule">
          <GoldLine width={150} />
        </div>

        {(formattedDate || eventTime || venue) && (
          <p ref={detailsRef} className="body invitation-card__details">
            {formattedDate && <span>{formattedDate}</span>}
            {eventTime && <span>{eventTime}</span>}
            {venue && <span>{venue}</span>}
          </p>
        )}

        {guest.name && (
          <p ref={guestRef} className="body invitation-card__guest">
            Dear {guest.name}, you are cordially invited
          </p>
        )}

        <div ref={sealRef} className="invitation-card__seal">
          <WaxSeal initial={sealInitial} />
        </div>
      </article>

      {/* Scroll affordance — fades in after the reveal, scrolls away naturally */}
      <div ref={hintRef} className="scroll-hint" aria-hidden="true" style={{ opacity: 0 }}>
        <span>Scroll</span>
        <i className="scroll-hint-line" />
      </div>
    </section>
  );
}
