'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Character, CharacterSkill } from '@/static/types/character';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Skull } from 'lucide-react';
import { BattleRoom, Chat, ChatBody, TurnQueue } from '@/static/types/battle';
import { Entity } from '@/static/types/monster';
import { ubuntu } from '@/static/fonts';
import { supabase } from '@/lib/db/supabase/client';
import { createChat, getChats } from '@/lib/db/actions/chat';
import { getCharactersByRoomId } from '@/lib/db/actions/characters';
import { getEntitiesByRoomId } from '@/lib/db/actions/entity';
import { Item } from '@/static/types/item';
import { ItemCard, SkillCard } from '@/app/_components/cards';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ActionChat, BuffChat, DebuffChat, MyChat, OpponentChat, ResultChat, SystemChat } from './chats';
import { handleCharacterAction } from '@/lib/handlers/characterSkillHandler';
import { cn } from '@/lib/utils';
import { BattleState, EntityWithSkills } from '@/static/types/lambdaAi';

export function BattleSection({ activeCharacter }: { activeCharacter: Character }) {
    const { toast } = useToast();
    // Move the character and calculate the skill's range
    const { battleId } = useParams<{ battleId: string }>();
    const [currentCharacter, setCurrentCharacter] = useState<Character>(activeCharacter);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [proceedTurnDialog, setProceedTurnDialog] = useState<boolean>(false);
    const [waitMonster, setWaitMonster] = useState<boolean>(false);
    const [queue, setQueue] = useState<TurnQueue[]>([]);
    const [skill, setSkill] = useState<CharacterSkill>();
    const [currentTurn, setCurrentTurn] = useState<TurnQueue>();
    const [targetPosition, setTargetPosition] = useState<{
        rowIndex: number;
        colIndex: number;
    } | null>(null);
    const GRID_SIZE = 10;

    const isActive = () => {
        return !(
            currentCharacter.isDead ||
            (currentCharacter.hasMoved && currentCharacter.hasActioned) ||
            (currentTurn && currentCharacter.id != currentTurn.subjectId)
        );
    };

    const { data: roomData } = useQuery({
        queryKey: [battleId],
        queryFn: async () => {
            const response = await fetch(`/api/battle/info?battleId=${battleId}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch battle info');
            }

            const roomData = data.data as BattleRoom;

            setCharacters(roomData.participants);
            setEntities(roomData.entities);
            return roomData;
        },
    });

    useEffect(() => {
        const turnQueueChannel = supabase
            .channel('public:turnQueue')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'TurnQueue',
                    filter: `roomId=eq.${battleId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        setQueue((prev) => {
                            const updatedQueue = prev.map((q) =>
                                q.subjectId === payload.new.subjectId ? { ...q, ...payload.new } : q
                            );
                            setCurrentTurn(updatedQueue.sort((a: TurnQueue, b: TurnQueue) => a.order - b.order)[0]);
                            return updatedQueue.sort((a: TurnQueue, b: TurnQueue) => a.order - b.order);
                        });
                    }
                }
            )
            .subscribe();

        // character subscription
        const characterChannel = supabase
            .channel('public:character')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Character',
                    filter: `roomId=eq.${battleId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        setCharacters((prev) =>
                            prev.map((char) => (char.id === payload.new.id ? { ...char, ...payload.new } : char))
                        );
                        if (payload.new.id === activeCharacter.id) {
                            setCurrentCharacter((prev) => ({ ...prev, ...payload.new }));
                        }
                    } else if (payload.eventType === 'INSERT') {
                        setCharacters((prev) => [...prev, payload.new as Character]);
                    } else if (payload.eventType === 'DELETE') {
                        setCharacters((prev) => prev.filter((char) => char.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        // entity subscription
        const entityChannel = supabase
            .channel('public:entity')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Entity',
                    filter: `roomId=eq.${battleId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        setEntities((prev) =>
                            prev.map((entity) =>
                                entity.id === payload.new.id ? { ...entity, ...payload.new } : entity
                            )
                        );
                    } else if (payload.eventType === 'INSERT') {
                        setEntities((prev) => [...prev, payload.new as Entity]);
                    } else if (payload.eventType === 'DELETE') {
                        setEntities((prev) => prev.filter((entity) => entity.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        // Cleanup subscriptions
        return () => {
            supabase.removeChannel(characterChannel).catch(console.error);
            supabase.removeChannel(entityChannel).catch(console.error);
            supabase.removeChannel(turnQueueChannel).catch(console.error);
        };
    }, [battleId, activeCharacter.id]);

    useEffect(() => {
        const getAIResponse = async () => {
            if (roomData) {
                const roomState: BattleState = {
                    roomId: roomData.id,
                    round: roomData.round,
                    entities: roomData.entities as EntityWithSkills[],
                    characters: roomData.participants,
                };

                console.log('roomState == ', roomState);
                const result = await fetch('/api/ai/get_turn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(roomState),
                });
                if (result.ok) {
                    const data = await result.json();
                    if (data.body) {
                        const actualData = JSON.parse(data.body);
                        console.log(actualData);
                    }
                }
            }
        };

        if (currentTurn && currentTurn.subjectType === 'Monster' && roomData) {
            if (currentCharacter.id === roomData.hostId) {
                getAIResponse();
            }
        }
    }, [currentTurn, roomData]);

    // real-time subscriptions
    useEffect(() => {
        if (!battleId) return;

        const fetchTurnQueue = async () => {
            try {
                console.log('fetching turn queue...');
                const response = await fetch(`/api/battle/queue?battleId=${battleId}`);
                const data = await response.json();

                if (response.ok && data.success && data.data) {
                    setQueue(data.data.data.sort((a: TurnQueue, b: TurnQueue) => a.order - b.order));
                    setCurrentTurn(data.data.data.sort((a: TurnQueue, b: TurnQueue) => a.order - b.order)[0]);
                } else {
                    throw new Error(data.error || 'Failed to fetch turn queue');
                }
            } catch (error) {
                console.error('Error fetching TurnQueue:', error);
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Unknown error',
                    variant: 'destructive',
                });
            }
        };

        fetchTurnQueue();
    }, [battleId, toast]);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (skill) {
            // if clicked cell is within range
            if (isCellInRange(rowIndex, colIndex)) {
                setTargetPosition({ rowIndex, colIndex });
                setProceedTurnDialog(true);
            } else {
                toast({
                    title: 'This cell is out of range',
                    className: 'w-fit max-w-[256px] absolute right-4 bottom-5',
                });
            }
            return;
        }
        // if the user's character has not made a move yet
        if (!activeCharacter.hasMoved) {
            setTargetPosition({ rowIndex, colIndex });
            setShowDialog(true);
        }
        // if click is on the player's character
        const isActiveCharacter = activeCharacter.colPos === colIndex && activeCharacter.rowPos === rowIndex;
        if (!isActiveCharacter) return;
    };

    const useSkill = async () => {
        const targetEntity = entities.filter(
            (entity) => entity.colPos === targetPosition?.colIndex && entity.rowPos === targetPosition.rowIndex
        )[0];
        const targetCharacter = characters.filter(
            (character) => character.colPos === targetPosition?.colIndex && character.rowPos === targetPosition.rowIndex
        )[0];

        const targetEntities = [targetEntity];
        const targetCharacters = [targetCharacter];

        try {
            if (!skill) return;
            await handleCharacterAction(currentCharacter, skill, targetEntities, targetCharacters);
            await fetch('/api/character/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData: {
                        ...currentCharacter,
                    },
                }),
            });
            if (targetEntities.length > 0) {
                console.log('TARGET ENTITY = ', targetEntities);
                Promise.all(
                    targetEntities.map(async (entity) => {
                        if (entity) {
                            const { skills, items, createdAt, ...otherData } = entity;
                            await fetch('/api/entity/update', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    formData: {
                                        ...otherData,
                                    },
                                }),
                            });
                        }
                    })
                );
            }
            if (targetCharacters.length > 0) {
                Promise.all(
                    targetCharacters.map(async (character) => {
                        if (character) {
                            const { skills, inventory, createdAt, ...otherData } = character;
                            await fetch('/api/character/update', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    formData: {
                                        ...otherData,
                                    },
                                }),
                            });
                        }
                    })
                );
            }

            await fetch('/api/battle/process-round', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    battleId: battleId,
                }),
            });
            setProceedTurnDialog(false);
            setSkill(undefined);
        } catch (error) {
            console.error('Error with using character skill: ', error);
            toast({
                title: 'Failed to use skill',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'destructive',
            });
            setProceedTurnDialog(false);
            setSkill(undefined);
        }
    };

    const movePlayer = async () => {
        try {
            // Check if this was the initial position setting
            if (activeCharacter.colPos === -1 || activeCharacter.rowPos === -1) {
                await fetch('/api/battle/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        battleId: battleId,
                        characterId: activeCharacter.id,
                        rowIndex: targetPosition?.rowIndex,
                        colIndex: targetPosition?.colIndex,
                    }),
                });
            } else {
                // Update character position in database
                const response = await fetch(`/api/battle/move`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        characterId: activeCharacter.id,
                        rowIndex: targetPosition?.rowIndex,
                        colIndex: targetPosition?.colIndex,
                    }),
                });

                if (!response.ok) {
                    toast({
                        title: 'Failed to move character',
                        variant: 'destructive',
                    });
                }
            }
        } catch (error) {
            console.error('Error moving character:', error);
            toast({
                title: 'Failed to move character',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'destructive',
            });
        } finally {
            setTargetPosition(null);
            setShowDialog(false);
        }
    };

    // Define base patterns for different ranges
    const getRangePattern = (range: 'Self' | 'Narrow' | 'Normal' | 'Wide') => {
        const patterns = {
            Self: [[0, 0]],
            Narrow: [
                [0, 0],
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1], // cardinal
            ],
            Normal: [
                [0, 0], // center
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1], // cardinal
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1], // diagonals
            ],
            Wide: [
                [0, 0], // center
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1], // cardinal
                [2, 0],
                [-2, 0],
                [0, 2],
                [0, -2], // cardinal
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1], // diagonals
            ],
        };

        return patterns[range] || patterns.Self;
    };

    const getCellsInRange = (centerRow: number, centerCol: number, range: 'Self' | 'Narrow' | 'Normal' | 'Wide') => {
        return getRangePattern(range)
            .map(([rowOffset, colOffset]) => ({
                row: centerRow + rowOffset,
                col: centerCol + colOffset,
            }))
            .filter(({ row, col }) => row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE);
    };

    const isCellInRange = (rowIndex: number, colIndex: number) => {
        if (!skill || currentCharacter.rowPos === -1 || currentCharacter.colPos === -1) return false;

        const rangeCells = getCellsInRange(currentCharacter.rowPos, currentCharacter.colPos, skill.range);

        return rangeCells.some((cell) => cell.row === rowIndex && cell.col === colIndex);
    };

    return (
        <>
            <div className="w-full text-xl text-center p-10 select-none">
                <div>Round {roomData?.round}</div>
                {currentTurn && currentTurn.subjectName && (
                    <div className="text-sm">Current Turn: {currentTurn?.subjectName}</div>
                )}
            </div>
            <section className="w-full h-full overflow-y-auto overflow-x-auto p-10">
                <div className="flex flex-col items-center justify-center min-h-full gap-1">
                    {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex gap-1">
                            {Array.from({ length: GRID_SIZE }).map((_, colIndex) => {
                                const cellKey = `${rowIndex}-${colIndex}`;
                                const isActiveCharacter =
                                    currentCharacter.colPos === colIndex && currentCharacter.rowPos === rowIndex;
                                const isInRange = isCellInRange(rowIndex, colIndex);

                                return (
                                    <TooltipProvider key={cellKey}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                                    className={cn(
                                                        'w-[50px] h-[50px] rounded-none transition-colors duration-300',
                                                        {
                                                            'bg-[#5C595D]': !isInRange,
                                                            'bg-yellow-500 hover:bg-yellow-600': isInRange,
                                                            'hover:bg-yellow-500': !isInRange,
                                                        }
                                                    )}
                                                    style={{
                                                        transition: 'background-color 0.3s ease-in-out',
                                                    }}>
                                                    {entities && (
                                                        <div className={'flex flex-col'}>
                                                            {entities.map((enemy) => {
                                                                if (
                                                                    enemy.colPos === colIndex &&
                                                                    enemy.rowPos === rowIndex &&
                                                                    !enemy.isDead
                                                                ) {
                                                                    return (
                                                                        <Image
                                                                            key={enemy.id}
                                                                            src={
                                                                                enemy?.image ||
                                                                                '/placeholderAvatar.webp'
                                                                            }
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
                                                                (currentCharacter && isActiveCharacter ? ' mb-1' : '')
                                                            }>
                                                            {activeCharacter &&
                                                                isActiveCharacter &&
                                                                !currentCharacter.isDead && (
                                                                    <ChevronDown
                                                                        className={
                                                                            '-mb-3 animate-bounce self-center stroke-black'
                                                                        }
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
                                                                                            src={
                                                                                                character.image ||
                                                                                                '/placeholderAvatar.webp'
                                                                                            }
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
                                                    {((activeCharacter || entities) &&
                                                        entities &&
                                                        entities.find(
                                                            (entity) =>
                                                                entity.rowPos === rowIndex &&
                                                                entity.colPos === colIndex &&
                                                                !entity.isDead
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
            <UserMenuBar character={currentCharacter} isActive={isActive()} setSkill={setSkill} currentSkill={skill} />
            {showDialog && (
                <Dialog
                    title={'Set your character position here?'}
                    description={'This action cannot be undone.'}
                    onCancel={() => setShowDialog(false)}
                    onContinue={movePlayer}
                />
            )}
            {proceedTurnDialog && (
                <Dialog
                    title={
                        skill
                            ? `You are going to use ${skill.name} skill.`
                            : `You are not going to do anything for this turn.`
                    }
                    description={'Do you want to finish your turn? This action cannot be undone.'}
                    onCancel={() => setProceedTurnDialog(false)}
                    onContinue={useSkill}
                />
            )}
        </>
    );
}

export function InfoSidebar() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { battleId } = useParams<{ battleId: string }>();

    useEffect(() => {
        // character subscription
        const characterChannel = supabase
            .channel('public:characterInfo')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Character',
                    filter: `roomId=eq.${battleId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        console.log('??????? This should be called!!');
                        setCharacters((prev) =>
                            prev.map((char) => (char.id === payload.new.id ? { ...char, ...payload.new } : char))
                        );
                    } else if (payload.eventType === 'INSERT') {
                        setCharacters((prev) => [...prev, payload.new as Character]);
                    } else if (payload.eventType === 'DELETE') {
                        setCharacters((prev) => prev.filter((char) => char.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        // entity subscription
        const entityChannel = supabase
            .channel('public:entityInfo')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Entity',
                    filter: `roomId=eq.${battleId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        setEntities((prev) =>
                            prev.map((entity) =>
                                entity.id === payload.new.id ? { ...entity, ...payload.new } : entity
                            )
                        );
                    } else if (payload.eventType === 'INSERT') {
                        setEntities((prev) => [...prev, payload.new as Entity]);
                    } else if (payload.eventType === 'DELETE') {
                        setEntities((prev) => prev.filter((entity) => entity.id !== payload.old.id));
                    }
                }
            )
            .subscribe();
        // Cleanup subscriptions
        return () => {
            supabase.removeChannel(characterChannel).catch(console.error);
            supabase.removeChannel(entityChannel).catch(console.error);
        };
    }, [battleId]);

    useEffect(() => {
        if (!battleId) return;
        const fetchInitialData = async () => {
            setLoading(true);

            try {
                const charactersResult = await getCharactersByRoomId(battleId);
                const entitiesResult = await getEntitiesByRoomId(battleId);

                if (charactersResult.success && charactersResult.characters) setCharacters(charactersResult.characters);
                if (entitiesResult.success && entitiesResult.entities) setEntities(entitiesResult.entities);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
            setLoading(false);
        };

        fetchInitialData();
    }, [battleId]);

    return (
        <nav className="bg-[#101010] flex flex-col text-xl py-8 relative select-none">
            <div className="flex flex-col">
                <div className="text-2xl text-center mb-3">Info</div>
                <Image
                    src={'/simple-decorative-line.svg'}
                    alt="decorative-line"
                    width={150}
                    height={10}
                    className="-mt-16 -mb-24 self-center pl-1"
                />
                <div className="w-full p-3 space-y-1">
                    {loading && <Skeleton className="w-full rounded-sm h-10 bg-slate-500" />}
                    {!loading &&
                        characters.map((character) => (
                            <div key={character.id} className="w-full flex flex-col bg-main-black p-3 rounded-sm">
                                <div>{character.name}</div>
                                <div className="flex flex-row justify-between items-center w-full">
                                    <div className="text-sm">Hp</div>
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
                                    <div className="text-sm">Cost</div>
                                    <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                        <div
                                            className="bg-[#d4972e] h-full"
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
                            </div>
                        ))}
                </div>
                <Image
                    src={'/simple-decorative-line.svg'}
                    alt="decorative-line"
                    width={150}
                    height={10}
                    className="-mt-14 -mb-24 self-center pl-1"
                />
                <div className="w-full p-3 space-y-1">
                    {loading && <Skeleton className="w-full rounded-sm h-10 bg-slate-500" />}
                    {!loading &&
                        entities.map((entity) => (
                            <div key={entity.id} className="w-full flex flex-col bg-main-black p-3 rounded-sm">
                                <div>{entity.name}</div>
                                <div className="flex flex-row justify-between items-center w-full">
                                    <div className="text-sm">Hp</div>
                                    <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                        <div
                                            className="bg-bright-red h-full"
                                            style={{
                                                width: `${(entity.currentHp / entity.maxHp) * 100}%`,
                                            }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs">
                                            <span className={`${ubuntu.className}`}>
                                                {entity.currentHp} / {entity.maxHp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div
                className="hover:bg-middle-red px-6 py-3 transition ease-in-out hover:cursor-pointer absolute bottom-0 w-full"
                onClick={() => {
                    router.back();
                }}>
                Leave
            </div>
        </nav>
    );
}

export function InfoCharacterCard({ character }: { character: Character }) {
    return (
        <div key={character.id} className="w-full flex flex-col bg-main-black p-3 rounded-sm">
            <div>{character.name}</div>
            <div className="flex flex-row justify-between items-center w-full">
                <div className="text-sm">Hp</div>
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
                <div className="text-sm">Cost</div>
                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                    <div
                        className="bg-[#d4972e] h-full"
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
        </div>
    );
}

export function ChatSidebar({ character }: { character: Character }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [text, setText] = useState<string>('');
    const { battleId } = useParams<{ battleId: string }>();

    const fetchChats = async () => {
        try {
            const result = await getChats(battleId);
            if (result.success && result.chats) {
                setChats(result.chats);
            } else {
                throw new Error('Failed to fetch chats from getChats function');
            }
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        }
    };

    useEffect(() => {
        fetchChats();
        const channel = supabase
            .channel('public:chat')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat' }, (payload) => {
                const newChat = payload.new as Chat;
                if (newChat.roomId === battleId) {
                    setChats((prevChats) => [...prevChats, newChat]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [battleId]);

    const handleSendChat = async () => {
        if (text.trim() !== '') {
            const newChat: ChatBody = {
                roomId: battleId,
                sender: character.name,
                body: text,
                image: character.image ? character.image : null,
                chatType: 'Chat',
            };
            try {
                await createChat(newChat);
                setText('');
            } catch (error) {
                console.error('Failed to send chat:', error);
            }
        }
    };

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <div className="bg-[#101010] relative h-full">
            <div className="overflow-y-auto h-[calc(100vh-116px)] py-4 flex flex-col gap-1" ref={chatContainerRef}>
                {chats.map((chat) => {
                    if (chat.sender === character.name) {
                        return <MyChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Chat') {
                        return <OpponentChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Result') {
                        return <ResultChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Action') {
                        return <ActionChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'System') {
                        return <SystemChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Buff') {
                        return <BuffChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Debuff') {
                        return <DebuffChat key={chat.id} chat={chat} />;
                    }
                })}
            </div>
            <div className="absolute bottom-0 w-full p-3">
                <textarea
                    value={text}
                    className="bg-middle-red border-middle-red resize-none h-[100px] w-full rounded-md p-3 focus:outline-none"
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                        }
                    }}
                />
            </div>
        </div>
    );
}

export function UserMenuBar({
    character,
    isActive,
    setSkill,
    currentSkill,
}: {
    character: Character;
    isActive: boolean;
    setSkill: (skill: CharacterSkill | undefined) => void;
    currentSkill: CharacterSkill | undefined;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<CharacterSkill[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);

            try {
                const itemResult = await fetch(`/api/character/${character.id}/items`);
                const skillResult = await fetch(`/api/character/${character.id}/skills`);

                if (itemResult.ok) {
                    const characterItems = await itemResult.json();
                    if (characterItems.data) setItems(characterItems.data);
                }

                if (skillResult.ok) {
                    const characterSkills = await skillResult.json();
                    if (characterSkills.data) setSkills(characterSkills.data);
                }
            } catch (error) {
                console.error('Failed to fetch initial data for UserMenuBar:', error);
            }
            setIsLoading(false);
        };

        fetchInitialData();
    }, [character.id]);

    useEffect(() => {
        if (!character.id) return;

        const inventorySubscription = supabase
            .channel('public:characterInventory')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'CharacterInventory',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setItems((prev) => [...prev, payload.new as Item]);
                    } else if (payload.eventType === 'UPDATE') {
                        setItems((prev) =>
                            prev.map((item) => (item.id === payload.new.id ? (payload.new as Item) : item))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(inventorySubscription);
        };
    }, [character.id]);

    return (
        <div className="w-full px-12 h-full content-center">
            {isLoading ? (
                <Skeleton className="w-full bg-slate-600 h-16" />
            ) : (
                <div className="w-full bg-[#101010] h-16 rounded-md grid grid-cols-[1fr_2fr] self-center">
                    <div key={character.id} className="w-full flex flex-col p-3 rounded-sm">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="text-sm">Hp</div>
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
                            <div className="text-sm">Cost</div>
                            <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                <div
                                    className="bg-[#d4972e] h-full"
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
                    </div>
                    <div className="w-full bg-bright-red flex flex-row items-center gap-1 px-2">
                        {skills.map((skill) => {
                            return (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    isActive={isActive}
                                    isHighLight={currentSkill ? skill.id == currentSkill.id : false}
                                    onClick={() => {
                                        if (!currentSkill || currentSkill.id != skill.id) {
                                            setSkill(skill);
                                        } else if (currentSkill.id == skill.id) {
                                            setSkill(undefined);
                                        }
                                    }}
                                />
                            );
                        })}
                        {items.map((item) => {
                            return <ItemCard key={item.id} item={item} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function Dialog({
    title,
    description,
    onCancel,
    onContinue,
}: {
    title: string;
    description: string;
    onCancel: () => void;
    onContinue: () => void;
}) {
    return (
        <AlertDialog defaultOpen={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
