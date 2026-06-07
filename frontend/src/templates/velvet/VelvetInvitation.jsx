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
import '../../css/invitation.css';

export default function VelvetInvitation({ data, isDemo, onRsvp }) {
    const [startedOpening, setStartedOpening] = useState(false);
    const [drapeOpen, setDrapeOpen] = useState(false);
    const { guest, wedding } = data;

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
                <CoupleNames
                    brideName={wedding.bride_name || 'Amina'}
                    groomName={wedding.groom_name || 'Yacine'}
                    visible={startedOpening}
                />

                <OrnamentalDivider variant="diamond" />

                <DateReveal eventDate={wedding.event_date} visible={startedOpening} />

                <OrnamentalDivider variant="arabesque" />

                <WeddingTime eventTime={wedding.event_time} />

                <OrnamentalDivider variant="dots" />

                <InvitationLetter
                    guestName={guest.name}
                    brideName={wedding.bride_name || 'Amina'}
                    groomName={wedding.groom_name || 'Yacine'}
                    message={wedding.message}
                />

                <OrnamentalDivider variant="diamond" />

                <PhotoStory photos={wedding.photos} />

                <OrnamentalDivider variant="arabesque" />

                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />

                <OrnamentalDivider variant="dots" />

                <Location venue={wedding.venue} venueAddress={wedding.venue_address} />

                <OrnamentalDivider variant="diamond" />

                <RSVP
                    guestName={guest.name}
                    initialStatus={guest.rsvp_status}
                    onSubmit={onRsvp}
                    isDemo={isDemo}
                />
            </main>
        </div>
    );
}
