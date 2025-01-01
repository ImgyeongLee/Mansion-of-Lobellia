import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import prisma from '@/lib/db/prisma';
import { getSub } from '@/lib/db/actions/cookies';
import { BattleSection, InfoSidebar, ChatSidebar } from './battleComponents';

export default async function BattlePage() {
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
            <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
                <div className="col-start-2 content-center">NONE</div>
            </section>
        );
    }

    return (
        <section className="grid grid-cols-[1.2fr_3fr_1.2fr] h-screen w-full">
            <InfoSidebar />
            <div className="grid grid-rows-[1fr_7fr_1.5fr] h-screen w-full overflow-hidden">
                <BattleSection activeCharacter={character} />
            </div>
            <ChatSidebar />
        </section>
    );
}
