'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Character } from '@/static/types/character';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Skull } from 'lucide-react';
import { BattleRoom } from '@/static/types/battle';
import { Entity } from '@/static/types/monster';
import { ubuntu } from '@/static/fonts';
import { Textarea } from '@/components/ui/textarea';

export function BattleSection({ activeCharacter }: { activeCharacter: Character }) {
    // Move the character and calculate the skill's range
    const { battleId } = useParams<{ battleId: string }>();
    const [roomData, setRoomData] = useState<BattleRoom>();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [enemies, setEnemies] = useState<Entity[]>([]);
    const [gridSize, setGridSize] = useState<number>(10);

    useEffect(() => {
        // Get BattleRoom Info
    }, []);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        // Handle cell click logic here
    };

    return (
        <>
            <div className="w-full text-xl text-center p-10 select-none">Round</div>
            <section className="w-full h-full overflow-y-auto overflow-x-auto p-10">
                <div className="flex flex-col items-center justify-center min-h-full gap-1">
                    {Array.from({ length: gridSize }).map((_, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex gap-1">
                            {Array.from({ length: gridSize }).map((_, colIndex) => {
                                const cellKey = `${rowIndex}-${colIndex}`;
                                const isActiveCharacter =
                                    activeCharacter.colPos === colIndex && activeCharacter.rowPos === rowIndex;

                                return (
                                    <TooltipProvider key={cellKey}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                                    className="bg-[#5C595D] w-[50px] h-[50px] rounded-none hover:bg-yellow-500"
                                                    style={{ transition: 'background-color 0.3s ease-in-out' }}>
                                                    {enemies && (
                                                        <div className={'flex flex-col'}>
                                                            {enemies.map((enemy) => {
                                                                if (
                                                                    enemy.colPos === colIndex &&
                                                                    enemy.rowPos === rowIndex &&
                                                                    !enemy.isDead
                                                                ) {
                                                                    return (
                                                                        <Image
                                                                            key={enemy.id}
                                                                            src={`somewhere`}
                                                                            alt="icon"
                                                                            width={100}
                                                                            height={100}
                                                                        />
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    )}
                                                    {roomData && (
                                                        <div
                                                            className={
                                                                'flex flex-col ' +
                                                                (activeCharacter && isActiveCharacter ? ' mb-1' : '')
                                                            }>
                                                            {activeCharacter &&
                                                                isActiveCharacter &&
                                                                !activeCharacter.isDead && (
                                                                    <ChevronDown
                                                                        className={'-mb-3 animate-bounce self-center'}
                                                                    />
                                                                )}
                                                            {characters.map((character) => {
                                                                if (
                                                                    character.colPos === colIndex &&
                                                                    character.rowPos === rowIndex &&
                                                                    !character.isDead
                                                                ) {
                                                                    return (
                                                                        <TooltipProvider key={character.id}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    {character.isDead ? (
                                                                                        <Skull className="text-litania-red" />
                                                                                    ) : (
                                                                                        <Image
                                                                                            src={`/icon/${character.image}`}
                                                                                            alt="icon"
                                                                                            width={100}
                                                                                            height={100}
                                                                                        />
                                                                                    )}
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <span>{character.name}</span>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-black bg-opacity-80">
                                                <span className={`${ubuntu.className} text-main-white`}>
                                                    {((activeCharacter || enemies) &&
                                                        enemies &&
                                                        enemies.find(
                                                            (enemy) =>
                                                                enemy.rowPos === rowIndex &&
                                                                enemy.colPos === colIndex &&
                                                                !enemy.isDead
                                                        )?.name) ||
                                                        '[ ' + rowIndex + ',' + colIndex + ' ]'}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
            <UserMenuBar />
        </>
    );
}

export function InfoSidebar() {
    return (
        <nav className="bg-bright-red flex flex-col text-xl py-8">
            <div className="flex flex-col">
                <div>User Info section</div>
                <div>Monster Info section</div>
            </div>
            <div className="flex flex-col mt-6">
                <div
                    className="hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer"
                    onClick={() => {
                        console.log('??');
                    }}>
                    Leave
                </div>
            </div>
        </nav>
    );
}

export function ChatSidebar() {
    return (
        <div className="bg-[#101010] relative h-full">
            <div className="overflow-y-auto h-[calc(100vh-116px)] py-4 flex flex-col gap-1"></div>
            <div className="bg-bright-red absolute bottom-0 w-full p-3">
                <Textarea className="bg-middle-red border-middle-red resize-none h-[100px]" />
            </div>
        </div>
    );
}

export function UserMenuBar() {
    return (
        <div className="w-full px-12 h-full content-center">
            <div className="w-full bg-middle-red h-16 rounded-md grid grid-cols-[1fr_2fr] self-center">
                <div className="w-full bg-slate-500"></div>
                <div className="w-full bg-lime-950"></div>
            </div>
        </div>
    );
}
