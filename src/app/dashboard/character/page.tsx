import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import prisma from '@/lib/db/prisma';
import { CharacterCreationForm } from '@/app/_components/forms';
import { CharacterDetailSection } from '@/app/_components/sections';
import { getSub } from '@/lib/db/actions/cookies';

export default async function CharactersPage() {
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
                <div className="col-start-2 content-center">
                    <CharacterCreationForm sub={currentUserSub} />
                </div>
            </section>
        );
    }

    return <CharacterDetailSection character={character} />;
}
