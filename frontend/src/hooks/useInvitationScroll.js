import { useEffect } from 'react';

export function useInvitationScroll(enabled) {
    useEffect(() => {
        document.documentElement.classList.add('invitation-active');

        if (!enabled) {
            document.documentElement.classList.add('invitation-locked');
        } else {
            document.documentElement.classList.remove('invitation-locked');
        }

        return () => {
            document.documentElement.classList.remove('invitation-active', 'invitation-locked');
        };
    }, [enabled]);
}
