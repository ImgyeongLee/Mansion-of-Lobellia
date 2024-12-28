'use client';

import { ubuntu } from '@/static/fonts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CharacterSkill } from '@/static/types/character';
import { cn } from '@/lib/utils';
import { Dungeon } from '@/static/types/dungeon';
import { Monster } from '@/static/types/monster';
import { useEffect, useState } from 'react';

interface SkillCardProps {
    skill: CharacterSkill;
    isHighLight: boolean;
    onClick: () => void;
}

export function SkillCard({ skill, isHighLight, onClick }: SkillCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    };
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        onClick={handleClick}
                        className={cn(
                            'bg-wine-red p-2 w-[50px] h-[50px] rounded-sm text-center flex flex-col justify-center hover:scale-105 ease-in-out trnasition',
                            {
                                'border-white border-2': isHighLight,
                                'border-none': !isHighLight,
                            }
                        )}></div>
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
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

interface DungeonCardProps {
    dungeon: Dungeon;
}

export function DungeonCard({ dungeon }: DungeonCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative cursor-pointer bg-black w-full h-[200px] hover:-translate-y-3 transition ease-in-out">
                    <div className="absolute right-0 bottom-0 text-3xl p-5">{dungeon.name}</div>
                </div>
            </DialogTrigger>
            <DialogContent className="w-1/2 bg-bright-red border-none sm:rounded-none select-none max-w-[800px] min-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">{dungeon.name}</DialogTitle>
                    <DialogDescription className="text-base">{dungeon.description}</DialogDescription>
                </DialogHeader>
                <div>Featured Monsters</div>
                <MonsterList dungeonId={dungeon.id} />
                <DialogFooter>
                    <DialogClose>Close</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface MonsterCardProps {
    dungeonId: string;
    monster?: Monster;
}

export function MonsterList({ dungeonId }: MonsterCardProps) {
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
        <div className="flex flex-row">
            {monsters.map((monster) => (
                <div key={monster.id} className="">
                    {monster.name}
                </div>
            ))}
        </div>
    );
}
