'use client';

import { CharacterSkill } from '@/static/types';

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
}

export function CharacterCard({ character }: CharacterCardProps) {
    return (
        <div>
            <h2>{character.name}</h2>
            <p>{character.class}</p>
        </div>
    );
}

export function SkillCard({ skill }: SkillCardProps) {
    return (
        <div className="bg-wine-red p-2 w-[64px] h-[64px] rounded-sm text-center flex flex-col justify-center">
            <h2 className="text-sm">{skill.name}</h2>
        </div>
    );
}
