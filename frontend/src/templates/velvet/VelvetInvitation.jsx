import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import DrapeOpening from '../../components/invitation/DrapeOpening';
import CoupleNames from '../../components/invitation/CoupleNames';
import DateReveal from '../../components/invitation/DateReveal';
import WeddingTime from '../../components/invitation/WeddingTime';
import InvitationLetter from '../../components/invitation/InvitationLetter';
import PhotoStory from '../../components/invitation/PhotoStory';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import GoldenParticles from '../../components/invitation/GoldenParticles';
import OrnamentalDivider from '../../components/invitation/OrnamentalDivider';
import CeremonySchedule from '../../components/invitation/CeremonySchedule';
import AddToCalendar from '../../components/invitation/AddToCalendar';
import InvitationFooter from '../../components/invitation/InvitationFooter';
import '../../css/invitation.css';

export default function VelvetInvitation({ data, isDemo, onRsvp }) {
    const [startedOpening, setStartedOpening] = useState(false);
    const [drapeOpen, setDrapeOpen] = useState(false);
    const { guest, wedding } = data;

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    useInvitationScroll(drapeOpen);

    return (
        <div className="invitation-root velvet-invitation">
            {/* Floating golden particles background */}
            {startedOpening && <GoldenParticles />}

            {!drapeOpen && (
                <DrapeOpening
                    onStart={() => setStartedOpening(true)}
                    onComplete={() => setDrapeOpen(true)}
                    data={data}
                />
            )}

            <main className={`invitation-story${startedOpening ? ' is-visible' : ''}`}>
                {/* ── Section 1: Couple Names ── */}
                <CoupleNames
                    brideName={bride}
                    groomName={groom}
                    visible={startedOpening}
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
