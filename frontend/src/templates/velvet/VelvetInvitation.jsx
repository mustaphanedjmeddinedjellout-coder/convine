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
import '../../css/invitation.css';

export default function VelvetInvitation({ data, isDemo, onRsvp }) {
    const [drapeOpen, setDrapeOpen] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(drapeOpen);

    return (
        <div className="invitation-root velvet-invitation">
            {!drapeOpen && <DrapeOpening onComplete={() => setDrapeOpen(true)} />}

            <main className={`invitation-story${drapeOpen ? ' is-visible' : ''}`}>
                <CoupleNames
                    brideName={wedding.bride_name || 'Amina'}
                    groomName={wedding.groom_name || 'Yacine'}
                    visible={drapeOpen}
                />
                <DateReveal eventDate={wedding.event_date} visible={drapeOpen} />
                <WeddingTime eventTime={wedding.event_time} />
                <InvitationLetter
                    guestName={guest.name}
                    brideName={wedding.bride_name || 'Amina'}
                    groomName={wedding.groom_name || 'Yacine'}
                    message={wedding.message}
                />
                <PhotoStory photos={wedding.photos} />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} />
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
