import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import prisma from '@/lib/db/prisma';
import { CharacterCreationForm } from '@/app/_components/forms';

export default async function CharactersPage() {
    let currentUserSub: string | undefined = undefined;

    const currentUser = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    currentUserSub = currentUser?.userId;

    if (currentUserSub === undefined) {
        redirect('/');
    }

    const character = await prisma.character.findFirst({
        where: {
            userId: currentUserSub,
        },
        orderBy: {
            name: 'asc',
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

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">{character.name}</div>
                </div>
                <div className="grid grid-cols-3 items-center h-full -mt-10 mb-6"></div>
            </div>
        </section>
    );
}
