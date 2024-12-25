import { create } from 'zustand';

interface UserStateProps {
    email: string;
    setEmail: (email: string) => void;
}

export const useUserStateStore = create<UserStateProps>((set) => ({
    email: '',
    setEmail: (email: string) => {
        set({ email: email });
    },
}));
