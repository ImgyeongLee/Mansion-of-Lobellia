import { DungeonCard } from '@/app/_components/cards';
import prisma from '@/lib/db/prisma';
import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { getSub } from '@/lib/db/actions/cookies';

export default async function DungeonPage() {
    const dungeons = await prisma.dungeon.findMany();
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
        redirect('/dashboard/character');
    }

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">Dungeons</div>
                </div>
                <div className="grid grid-rows-3 items-center h-full -mt-10 mb-6">
                    {dungeons.length === 0 && <div className="col-span-3 text-center -mt-6">No dungeons found</div>}
                    {dungeons.length > 0 &&
                        dungeons.map((dungeon) => (
                            <DungeonCard key={dungeon.id} dungeon={dungeon} characterId={character.id} />
                        ))}
                </div>
            </div>
        </section>
    );
}
