import { runWithAmplifyServerContext } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { CharacterCreationForm } from '@/app/_components/forms';

export default async function CharacterCreationPage() {
    let currentUserSub: string | undefined = undefined;

    const currentUser = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    currentUserSub = currentUser?.userId;

    if (currentUserSub === undefined) {
        redirect('/');
    }

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 content-center">
                <CharacterCreationForm sub={currentUserSub} />
            </div>
        </section>
    );
}
