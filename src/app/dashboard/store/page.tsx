import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import prisma from '@/lib/db/prisma';
import { getCharacterId, getSub } from '@/lib/db/actions/cookies';
import { StoreSection } from './storeCards';

export default async function StorePage() {
    let currentCharacterId = await getCharacterId();
    let currentSub = await getSub();

    if (!currentSub) {
        const currentUser = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec) => getCurrentUser(contextSpec),
        });
        const currentUserSub = currentUser?.userId;

        if (currentUserSub === undefined) {
            redirect('/');
        }
        currentSub = currentUserSub;
    }

    if (!currentCharacterId && currentSub) {
        const character = await prisma.character.findFirst({
            where: {
                userId: currentSub,
            },
        });

        if (character) {
            currentCharacterId = character.id;
        }
    }

    const Storeitems = await prisma.item.findMany({
        where: {
            isStoreItem: true,
        },
    });

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">Store</div>
                </div>
                <StoreSection storeItems={Storeitems} characterId={currentCharacterId as string} />
            </div>
        </section>
    );
}
