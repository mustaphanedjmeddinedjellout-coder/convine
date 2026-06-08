import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { parseEventDate } from '../../lib/formatWeddingDate';

gsap.registerPlugin(ScrollTrigger);

/**
 * Generates a Google Calendar URL from event details.
 */
function buildGoogleCalendarUrl({ title, date, time, venue, address }) {
    const { day, month, year } = parseEventDate(date);
    // Build date string: YYYYMMDD
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    const dateStr = `${year}${String(monthNum).padStart(2, '0')}${String(day).padStart(2, '0')}`;

    let startStr = dateStr;
    let endStr = dateStr;

    if (time) {
        const [h, m] = time.split(':').map(Number);
        startStr = `${dateStr}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
        // Default 4 hour event
        const endH = h + 4;
        endStr = `${dateStr}T${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    }

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title || 'Wedding Celebration',
        dates: `${startStr}/${endStr}`,
        details: `You are invited to celebrate with us!`,
        location: [venue, address].filter(Boolean).join(', '),
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an .ics file content string.
 */
function buildIcsContent({ title, date, time, venue, address }) {
    const { day, month, year } = parseEventDate(date);
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    const dateStr = `${year}${String(monthNum).padStart(2, '0')}${String(day).padStart(2, '0')}`;

    let dtStart = dateStr;
    let dtEnd = dateStr;

    if (time) {
        const [h, m] = time.split(':').map(Number);
        dtStart = `${dateStr}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
        const endH = h + 4;
        dtEnd = `${dateStr}T${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    }

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Convine//Wedding//EN',
        'BEGIN:VEVENT',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${title || 'Wedding Celebration'}`,
        `LOCATION:${[venue, address].filter(Boolean).join(', ')}`,
        'DESCRIPTION:You are invited to celebrate with us!',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
}

export default function AddToCalendar({ eventDate, eventTime, venue, venueAddress, brideName, groomName }) {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);

    const title = `${brideName || 'Bride'} & ${groomName || 'Groom'}'s Wedding`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 30, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 80%' },
                },
            );
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    const handleGoogle = useCallback(() => {
        const url = buildGoogleCalendarUrl({
            title, date: eventDate, time: eventTime, venue, address: venueAddress,
        });
        window.open(url, '_blank', 'noopener,noreferrer');
    }, [title, eventDate, eventTime, venue, venueAddress]);

    const handleIcs = useCallback(() => {
        const ics = buildIcsContent({
            title, date: eventDate, time: eventTime, venue, address: venueAddress,
        });
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wedding-invitation.ics';
        a.click();
        URL.revokeObjectURL(url);
    }, [title, eventDate, eventTime, venue, venueAddress]);

    return (
        <section ref={sceneRef} className="invite-scene invite-scene--compact calendar-scene">
            <div ref={contentRef} className="calendar-card">
                {/* Decorative calendar icon */}
                <div className="calendar-icon" aria-hidden="true">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <rect x="4" y="8" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M4 18H40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        <path d="M14 4V12M30 4V12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                        <path d="M16 26L20 30L28 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <p className="calendar-title">Save This Date</p>
                <p className="calendar-subtitle">Add our special day to your calendar so you never forget</p>

                <div className="calendar-buttons">
                    <button type="button" className="calendar-btn calendar-btn--google btn-shimmer" onClick={handleGoogle}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" />
                            <path d="M1 7H15" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                            <path d="M5 1V5M11 1V5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                        Google Calendar
                    </button>
                    <button type="button" className="calendar-btn calendar-btn--ics btn-shimmer" onClick={handleIcs}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 1H10L14 5V14C14 14.6 13.6 15 13 15H4C3.4 15 3 14.6 3 14V2C3 1.4 3.4 1 4 1Z" stroke="currentColor" strokeWidth="1" />
                            <path d="M10 1V5H14" stroke="currentColor" strokeWidth="0.8" />
                            <path d="M6 9H11M6 11.5H9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        Download .ics
                    </button>
                </div>
            </div>
        </section>
    );
}
