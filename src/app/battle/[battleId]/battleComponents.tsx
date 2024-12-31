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

export function BattleGrid({ activeCharacter }: { activeCharacter: Character }) {
    // Move the character and calculate the skill's range
    const { battleId } = useParams<{ battleId: string }>();
    const [roomData, setRoomData] = useState<BattleRoom>();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [enemies, setEnemies] = useState<Entity[]>([]);
    const [gridSize, setGridSize] = useState<number>(0);

    useEffect(() => {
        // Get BattleRoom Info
    }, []);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        // Handle cell click logic here
    };

    return (
        <section className="bg-litania-dark-bg max-h-screen pt-32 overflow-y-auto pb-48">
            <div className="flex flex-col items-center justify-center min-h-full p-6">
                {Array.from({ length: gridSize }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex">
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
                                                style={{ transition: 'background-color 0.3s ease-in-out' }}>
                                                {enemies && (
                                                    <div className={'flex flex-col '}>
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
                                            <span className="text-litania-white">
                                                {((activeCharacter || enemies) &&
                                                    enemies &&
                                                    enemies.find(
                                                        (enemy) =>
                                                            enemy.rowPos === rowIndex &&
                                                            enemy.colPos === colIndex &&
                                                            !enemy.isDead
                                                    )?.name) ||
                                                    rowIndex + ',' + colIndex}
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
    );
}
