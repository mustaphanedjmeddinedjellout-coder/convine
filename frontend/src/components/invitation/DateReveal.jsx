import DateScratchReveal from '../shared/DateScratchReveal';

export default function DateReveal({ eventDate, visible }) {
    return (
        <DateScratchReveal
            eventDate={eventDate}
            visible={visible}
            theme="velvet"
            shape="circle"
            sceneClass="invite-scene date-scene"
            titleClass="date-scene-title"
            rowClass="date-reveal-row scratch-date-row"
            hintClass="date-reveal-hint"
            title="Our Wedding Date"
            hintScratch="Swipe your finger to brush away the coating"
            hintDone="Save the date in your heart"
        />
    );
}
