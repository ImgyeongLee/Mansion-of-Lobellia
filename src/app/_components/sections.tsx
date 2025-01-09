'use client';

import { Button } from '@/components/ui/button';
import { ubuntu } from '@/static/fonts';
import { Character } from '@/static/types/character';
import { useRouter } from 'next/navigation';
import { CharacterInventory, CharacterSkillList } from './cards';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CharacterUpdateForm } from './forms';

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
                <div className="grid grid-cols-[1fr_2fr] items-center h-full -mt-6 mb-10">
                    <div
                        key={character.id}
                        className="bg-bright-red h-full"
                        style={{
                            backgroundImage: character.image ? `url(${character.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="h-full flex flex-col bg-wine-red p-9">
                        <div className="flex flex-col rounded-sm py-2 gap-1">
                            <div className="text-xl">Status</div>
                            <div>{character.class} Class</div>
                            <div className="flex flex-row justify-between items-center w-full">
                                <div>Hp</div>
                                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                    <div
                                        className="bg-bright-red h-full"
                                        style={{
                                            width: `${(character.currentHp / character.maxHp) * 100}%`,
                                        }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                                        <span className={`${ubuntu.className}`}>
                                            {character.currentHp} / {character.maxHp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center w-full">
                                <div>Cost</div>
                                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                    <div
                                        className="bg-bright-red h-full"
                                        style={{
                                            width: `${(character.currentCost / character.maxCost) * 100}%`,
                                        }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                                        <span className={`${ubuntu.className}`}>
                                            {character.currentCost} / {character.maxCost}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="my-2 text-center">✦</div>
                            <div className="flex flex-row gap-2 justify-center">
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>ATK</div>
                                    <div className={`${ubuntu.className} text-3xl`}>{character.attack}</div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>DEF</div>
                                    <div className={`${ubuntu.className} text-3xl`}>{character.defense}</div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>DODGE</div>
                                    <div className={`${ubuntu.className} text-3xl`}>
                                        {character.dodge}
                                        <span className="text-xl">%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>CRIT</div>
                                    <div className={`${ubuntu.className} text-3xl`}>
                                        {character.crit}
                                        <span className="text-xl">%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>SPD</div>
                                    <div className={`${ubuntu.className} text-3xl`}>{character.speed}</div>
                                </div>
                            </div>
                            <div className="my-2 text-center">✦ ✦</div>
                            <CharacterSkillList characterId={character.id} />
                            <div className="text-xl mt-2 mb-1">
                                Inventory{' '}
                                <span className={`${ubuntu.className} text-sm`}>
                                    &#40;Gold: {character.money}G&#41;
                                </span>
                            </div>
                            <CharacterInventory characterId={character.id} />
                            <div className="my-2 text-center">✦ ✦ ✦</div>
                            <div className="text-xl mt-2">Background Story</div>
                            {character.description && (
                                <div className="px-3 py-2 text-sm bg-middle-red overflow-y-auto h-[150px]">
                                    {character.description}
                                </div>
                            )}
                            {!character.description && <div>No Description</div>}
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Edit the profile</Button>
                            </DialogTrigger>
                            <DialogContent className="w-1/2 bg-bright-red border-none sm:rounded-none select-none max-w-[800px] min-w-[400px]">
                                <CharacterUpdateForm character={character} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </section>
    );
}
