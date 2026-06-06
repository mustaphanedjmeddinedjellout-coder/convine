import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import WeddingTime from '../../components/invitation/WeddingTime';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import NoirOpening from './NoirOpening';
import { NoirNames, NoirDate, NoirLetter, NoirPhotos } from './NoirScenes';
import '../../css/invitation.css';
import '../../css/noir.css';

export default function NoirInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root noir-invitation">
            {!opened && <NoirOpening onComplete={() => setOpened(true)} />}
            <main className={`invitation-story${opened ? ' is-visible' : ''}`}>
                <NoirNames bride={bride} groom={groom} visible={opened} />
                <NoirDate eventDate={wedding.event_date} />
                <WeddingTime eventTime={wedding.event_time} />
                <NoirLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <NoirPhotos photos={wedding.photos} />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} />
                <RSVP guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </main>
        </div>
    );
}
