'use client';
import { ubuntu } from '@/static/fonts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CharacterSkill } from '@/static/types';
import { cn } from '@/lib/utils';

interface Character {
    id: string;
    name: string;
    class: string;
}

interface CharacterCardProps {
    character: Character;
}

interface SkillCardProps {
    skill: CharacterSkill;
    isHighLight: boolean;
    onClick: () => void;
}

export function CharacterCard({ character }: CharacterCardProps) {
    return (
        <div>
            <h2>{character.name}</h2>
            <p>{character.class}</p>
        </div>
    );
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
