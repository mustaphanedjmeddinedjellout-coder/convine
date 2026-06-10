import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import DrapeOpening from '../../components/invitation/DrapeOpening';
import InvitationCard from '../../components/invitation/InvitationCard/InvitationCard';
import DateReveal from '../../components/invitation/DateReveal';
import WeddingTime from '../../components/invitation/WeddingTime';
import InvitationLetter from '../../components/invitation/InvitationLetter';
import PhotoStory from '../../components/invitation/PhotoStory';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import OrnamentalDivider from '../../components/invitation/OrnamentalDivider';
import CeremonySchedule from '../../components/invitation/CeremonySchedule';
import AddToCalendar from '../../components/invitation/AddToCalendar';
import InvitationFooter from '../../components/invitation/InvitationFooter';
import '../../css/invitation.css';

export default function VelvetInvitation({ data, isDemo, onRsvp }) {
    const skipCurtain = typeof window !== 'undefined' && window.location.search.includes('skipCurtain');
    const [startedOpening, setStartedOpening] = useState(skipCurtain);
    const [drapeOpen, setDrapeOpen] = useState(skipCurtain);
    const { guest, wedding } = data;

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    useInvitationScroll(drapeOpen);

    return (
        <div className="invitation-root velvet-invitation">
            {!drapeOpen && (
                <DrapeOpening
                    onStart={() => setStartedOpening(true)}
                    onComplete={() => setDrapeOpen(true)}
                />
            )}

            <main className={`invitation-story${startedOpening ? ' is-visible' : ''}`}>
                {/* ── Section 1: The Card ──
                    Reveal begins the moment the guest touches the curtain,
                    so the card is rising behind the parting drapes — one
                    continuous gesture, no dead frame between scenes. */}
                <InvitationCard
                    revealed={startedOpening}
                    data={data}
                />

                <OrnamentalDivider variant="diamond" />

                {/* ── Section 2: Save the Date (Scratch Reveal) ── */}
                <DateReveal eventDate={wedding.event_date} visible={startedOpening} />

                <OrnamentalDivider variant="arabesque" />

                {/* ── Section 3: Ceremony Time ── */}
                <WeddingTime eventTime={wedding.event_time} />

                <OrnamentalDivider variant="dots" />

                {/* ── Section 4: Personal Letter ── */}
                <InvitationLetter
                    guestName={guest.name}
                    brideName={bride}
                    groomName={groom}
                    message={wedding.message}
                />

                <OrnamentalDivider variant="diamond" />

                {/* ── Section 5: Our Love Story (Photos) ── */}
                <PhotoStory photos={wedding.photos} />

                <OrnamentalDivider variant="arabesque" />

                {/* ── Section 6: The Celebration Timeline ── */}
                <CeremonySchedule schedule={wedding.schedule} />

                <OrnamentalDivider variant="dots" />

                {/* ── Section 7: Countdown Timer ── */}
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />

                <OrnamentalDivider variant="arabesque" />

                {/* ── Section 8: Venue & Directions ── */}
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />

                <OrnamentalDivider variant="dots" />

                {/* ── Section 9: Add to Calendar ── */}
                <AddToCalendar
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    venueAddress={wedding.venue_address}
                    googleMapsUrl={wedding.google_maps_url}
                    brideName={bride}
                    groomName={groom}
                />

                <OrnamentalDivider variant="diamond" />

                {/* ── Section 10: RSVP ── */}
                <RSVP
                    guestName={guest.name}
                    initialStatus={guest.rsvp_status}
                    onSubmit={onRsvp}
                    isDemo={isDemo}
                />

                {/* ── Elegant Footer ── */}
                <InvitationFooter brideName={bride} groomName={groom} />
            </main>
        </div>
    );
}
