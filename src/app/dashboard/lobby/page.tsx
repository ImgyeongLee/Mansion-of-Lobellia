import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import prisma from '@/lib/db/prisma';
import { getSub } from '@/lib/db/actions/cookies';
import { RedirectWithToast } from '@/app/_components/redirectToast';
import { getUserDungeonsWithInfo } from '@/lib/db/actions/lobby';
import { BattleRoom } from '@/static/types/battle';
import { LobbySection, NonLobbySection } from '@/app/_components/sections';

export default async function LobbyPage() {
    let currentUserSub = await getSub();

    if (!currentUserSub) {
        const currentUser = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec) => getCurrentUser(contextSpec),
        });
        currentUserSub = currentUser?.userId;

        if (currentUserSub === undefined) {
            redirect('/');
        }
    }

    const character = await prisma.character.findFirst({
        where: {
            userId: currentUserSub,
        },
    });

    if (!character) {
        return (
            <RedirectWithToast
                href={'/dashboard/character'}
                title={'No character found'}
                description={'Redirecting you to character creation...'}
                variant={'destructive'}
            />
        );
    }

    const battleResult = await getUserDungeonsWithInfo(currentUserSub);

    if (!battleResult.data || !character.roomId) {
        return <NonLobbySection character={character} />;
    }

    const battleInfo: BattleRoom = battleResult.data;

    return <LobbySection character={character} battleInfo={battleInfo} />;
}
