'use client';

import { Button } from '@/components/ui/button';
import { Character } from '@/static/types/character';
import { useRouter } from 'next/navigation';

interface CharacterDetailSectionProps {
    character: Character;
}

export function CharacterDetailSection({ character }: CharacterDetailSectionProps) {
    const router = useRouter();

    async function handleDelete() {
        const result = await fetch(`/api/character/delete/${character.id}`, {
            method: 'DELETE',
        });
        if (result.ok) {
            router.refresh();
        }
    }

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">{character.name}</div>
                    <Button onClick={handleDelete}>Delete</Button>
                </div>
                <div className="grid grid-cols-3 items-center h-full -mt-10 mb-6"></div>
            </div>
        </section>
    );
}
