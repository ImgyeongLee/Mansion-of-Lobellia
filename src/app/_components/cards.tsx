'use client';

import { ubuntu } from '@/static/fonts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Character, CharacterSkill } from '@/static/types/character';
import { cn } from '@/lib/utils';
import { Dungeon } from '@/static/types/dungeon';
import { Monster } from '@/static/types/monster';
import React, { useEffect, useState } from 'react';
import { Item } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { BattleRoomCreationForm } from './forms';
import { motion } from 'framer-motion';
import { appearsFromRightFadeIn, fadeIn } from '@/lib/motionVariants';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillCardProps {
    skill: CharacterSkill;
    isDisplay?: boolean;
    isHighLight?: boolean;
    isActive?: boolean;
    onClick?: () => void;
}

export function SkillCard({ skill, isDisplay, isActive, isHighLight, onClick }: SkillCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!onClick) return;
        onClick();
    };
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button
                        disabled={isActive ? !isActive : false}
                        onClick={handleClick}
                        className={cn(
                            'bg-wine-red p-2 w-[50px] h-[50px] rounded-sm text-center flex flex-col justify-center hover:scale-105 ease-in-out trnasition',
                            {
                                'border-white border-2': isHighLight,
                                'border-none': !isHighLight,
                                'bg-black': isDisplay,
                            }
                        )}
                        style={{
                            backgroundImage: skill.image ? `url(${skill.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}></Button>
                </TooltipTrigger>
                <TooltipContent className={cn('bg-black w-[150px] flex flex-col')}>
                    <div className="text-center text-lg">{skill.name}</div>
                    <div className={`${ubuntu.className} mb-2 text-center`}>{skill.description}</div>
                    {skill.requiredHp > 0 && (
                        <div className={`${ubuntu.className}`}>Required HP: {skill.requiredHp}</div>
                    )}
                    {skill.requiredCost > 0 && (
                        <div className={`${ubuntu.className}`}>Required Cost: {skill.requiredCost}</div>
                    )}
                    {skill.type && skill.range && (
                        <div className={`${ubuntu.className}`}>
                            <p>Type: {skill.type}</p>
                            <p>Range: {skill.range}</p>
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

interface DungeonCardProps {
    characterId: string;
    dungeon: Dungeon;
}

export function DungeonCard({ dungeon, characterId }: DungeonCardProps) {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const handleClick = () => {
        if (isFormOpen) {
            setIsFormOpen(false);
        } else {
            setIsFormOpen(true);
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className="relative cursor-pointer bg-black w-full h-[200px] hover:translate-x-3 transition ease-in-out">
                    <div className="absolute right-0 bottom-0 text-3xl p-5">{dungeon.name}</div>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="w-1/2 bg-bright-red border-none sm:rounded-none select-none max-w-[800px] min-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">{dungeon.name}</DialogTitle>
                    <DialogDescription className="text-base">{dungeon.description}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2">
                    <div>
                        <div className="mb-2">Featured Monsters</div>
                        <MonsterList dungeonId={dungeon.id} />
                    </div>
                    <div className="flex flex-col">
                        <div>
                            Difficulty: <span className={`${ubuntu.className}`}>{dungeon.difficulty}</span>
                        </div>
                        <div>
                            Recommended Party Size:{' '}
                            <span className={`${ubuntu.className}`}>
                                {dungeon.minMember} - {dungeon.maxMember}
                            </span>
                        </div>
                        <div>
                            Size: <span className={`${ubuntu.className}`}>{dungeon.size}</span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleClick}
                    type="submit"
                    className="shadow-none justify-self-center bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                    {isFormOpen ? 'Cancel' : 'Create Party'}
                </Button>
                {isFormOpen && <BattleRoomCreationForm dungeon={dungeon} characterId={characterId} />}
            </DialogContent>
        </Dialog>
    );
}

interface MonsterListProps {
    dungeonId: string;
}

export function MonsterList({ dungeonId }: MonsterListProps) {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonsters = async () => {
            try {
                const response = await fetch(`/api/dungeon/${dungeonId}/monsters`);
                if (response.ok) {
                    const data = await response.json();
                    setMonsters(data.data);
                } else {
                    console.error('Failed to fetch monsters:', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch monsters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMonsters();
    }, [dungeonId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-row gap-2">
            {monsters.map((monster) => (
                <MonsterCard key={monster.id} monster={monster} />
            ))}
        </div>
    );
}

interface MonsterCardProps {
    monster: Monster;
}

function MonsterCard({ monster }: MonsterCardProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className="bg-wine-red p-2 w-[50px] h-[50px] rounded-sm text-center flex flex-col justify-center hover:scale-105 ease-in-out trnasition"
                        style={{
                            backgroundImage: monster.image ? `url(${monster.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}></div>
                </TooltipTrigger>
                <TooltipContent className={cn('bg-black w-[150px] flex flex-col text-center')}>
                    <div className="text-center text-base leading-tight">{monster.name}</div>
                    <div className={`${ubuntu.className} mb-2`}>{monster.description}</div>
                    <div className={`${ubuntu.className}`}>HP {monster.maxHp}</div>
                    <div className={`${ubuntu.className}`}>
                        ATK {monster.attack} DEF {monster.defense} SPD {monster.speed}
                    </div>
                    <div className={`${ubuntu.className}`}>
                        DODGE {monster.dodge} CRIT {monster.crit}%
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

interface ItemCardProps {
    item: Item;
    children?: React.ReactNode;
}

export function ItemCard({ item, children }: ItemCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-pointer w-[50px] h-[50px] rounded-sm bg-black hover:scale-105 transition ease-in-out">
                    <div className=""></div>
                </div>
            </DialogTrigger>
            <DialogContent className="w-1/2 bg-bright-red border-none sm:rounded-none select-none max-w-[400px] min-w-[320px]">
                <div className="flex flex-col justify-center w-full items-center">
                    <div className="bg-slate-700 w-[100px] h-[100px] mb-4"></div>
                    <Image
                        src={'/simple-decorative-line.svg'}
                        alt="decorative-line"
                        width={150}
                        height={10}
                        className="-mt-16 -mb-24 self-center pl-1"
                    />
                    <div className="text-lg">{item.name}</div>
                    <div className={`${ubuntu.className} text-sm`}>{item.description}</div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function CharacterInventory({ characterId }: { characterId: string }) {
    const [items, setItems] = useState<{ item: Item; amount: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/character/${characterId}/items`);
                if (response.ok) {
                    const data = await response.json();
                    setItems(data.data);
                } else {
                    console.error('Failed to fetch monsters:', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch monsters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [characterId]);

    if (loading) {
        return (
            <div className="flex flex-row gap-2">
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
            </div>
        );
    }

    if (items.length == 0) {
        return <div>No items</div>;
    }

    return (
        <div className="flex flex-row gap-2">
            {items.map((item) => (
                <ItemCard key={item.item.id} item={item.item} />
            ))}
        </div>
    );
}

export function CharacterSkillList({ characterId }: { characterId: string }) {
    const [skills, setSkills] = useState<CharacterSkill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/character/${characterId}/skills`);
                if (response.ok) {
                    const data = await response.json();
                    setSkills(data.data);
                } else {
                    console.error('Failed to fetch monsters:', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch monsters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [characterId]);

    if (loading) {
        return (
            <div className="flex flex-row gap-2 w-full justify-center">
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
                <Skeleton className="w-[50px] h-[50px] rounded-full bg-slate-500 " />
            </div>
        );
    }

    return (
        <div className="flex flex-row gap-2 w-full justify-center">
            {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} isDisplay={true} />
            ))}
        </div>
    );
}

interface CharacterCardProps {
    character: Character;
}

export function CharacterLobbyCard({ character }: CharacterCardProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        variants={appearsFromRightFadeIn}
                        initial="initial"
                        animate="animate"
                        className="flex flex-col">
                        <div
                            key={character.id}
                            className={'text-sm w-[250px] h-[400px] bg-bright-red relative'}
                            style={{
                                backgroundImage: character.image ? `url(${character.image})` : 'none',
                                backgroundSize: '300%',
                                backgroundPosition: 'top',
                            }}>
                            <div className="h-full w-full bg-gradient-to-t from-black from-5% via-transparent absolute top-0 z-10"></div>
                            <div className="px-3 py-2 text-2xl w-full text-end ">{character.name}</div>
                        </div>
                        <Image
                            src={'/decorative-line.svg'}
                            alt=""
                            width={180}
                            height={10}
                            className="-mt-9 self-center z-30"
                        />
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-black bg-opacity-80" side="right">
                    <div className={`${ubuntu.className} text-main-white flex flex-col`}>
                        <div>
                            HP: {character.currentHp}/{character.maxHp}
                        </div>
                        <div>
                            COST: {character.currentCost}/{character.maxCost}
                        </div>
                        <div>ATK: {character.attack}</div>
                        <div>DEF: {character.defense}</div>
                        <div>DODGE: {character.dodge}</div>
                        <div>CRIT: {character.crit}</div>
                        <div>SPD: {character.speed}</div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
