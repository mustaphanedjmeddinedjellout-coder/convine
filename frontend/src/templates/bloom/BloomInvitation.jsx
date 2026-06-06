import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import WeddingTime from '../../components/invitation/WeddingTime';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import BloomOpening from './BloomOpening';
import { BloomNames, BloomDate, BloomLetter, BloomPhotos } from './BloomScenes';
import '../../css/invitation.css';
import '../../css/bloom.css';

export default function BloomInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root bloom-invitation">
            {!opened && <BloomOpening onComplete={() => setOpened(true)} />}
            <main className={`invitation-story${opened ? ' is-visible' : ''}`}>
                <BloomNames bride={bride} groom={groom} visible={opened} />
                <BloomDate eventDate={wedding.event_date} />
                <WeddingTime eventTime={wedding.event_time} />
                <BloomLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <BloomPhotos photos={wedding.photos} />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} />
                <RSVP guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </main>
        </div>
    );
}
