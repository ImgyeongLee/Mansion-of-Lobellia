'use client';

import useAuthUser from '@/hooks/use-auth-user';

export function CharacterBoard() {
    const user = useAuthUser();
    console.log(user);
    return <div>Board</div>;
}
