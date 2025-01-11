export const appearsFromBottomFadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'backInOut' } },
};

export const appearsFromRightFadeIn = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'backInOut' } },
};

export const appearsFromLeftFadeIn = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'backInOut' } },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: 'backInOut' } },
};
