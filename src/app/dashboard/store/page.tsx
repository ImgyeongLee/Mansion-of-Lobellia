import { ItemList } from '@/app/_components/cards';
import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import prisma from '@/lib/db/prisma';
import { getCharacterId, getSub } from '@/lib/db/actions/cookies';

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
                <div className="grid grid-rows-2 items-center h-full -mt-10 mb-6">
                    <div className="bg-slate-300 h-full grid grid-cols-2">
                        <div className="bg-slate-500 h-full p-5">
                            <div className="bg-green-500 h-full p-3">
                                <ItemList items={Storeitems} />
                            </div>
                        </div>
                        <div className="bg-amber-800 h-full"></div>
                    </div>
                    <div className="bg-slate-700 p-5 h-full">
                        <div className="bg-slate-800 p-2 h-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
