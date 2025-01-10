export type CharacterClass = 'Gladiolus' | 'Saintpaulia' | 'Cypress' | 'Blackthorn';

type SkillRange = 'Self' | 'Narrow' | 'Normal' | 'Wide';

export interface CharacterSkill {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    type: string;
    range: SkillRange;
    requiredCost: number;
    requiredHp: number;
}

export interface Character {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    class: CharacterClass;
    maxHp: number;
    currentHp: number;
    maxCost: number;
    currentCost: number;
    money: number;
    attack: number;
    defense: number;
    dodge: number;
    crit: number;
    speed: number;
    rowPos: number;
    colPos: number;
    hasMoved: boolean;
    hasActioned: boolean;
    hasUsedUltimate: boolean;
    isDead: boolean;
    isStun: boolean;
    isConfused: boolean;
    isDark: boolean;
    isFocused: boolean;
    isImmortal: boolean;
    attackBuffedAmount: number;
    attackBuffedTurn: number;
    defenseBuffedAmount: number;
    defenseBuffedTurn: number;
    protectorId: string | null;
    protectedTurn: number;
    dotDamageTurn: number;
    dotDamageAmount: number;
}

export interface CharacterCreationFormData {
    userId: string;
    name: string;
    class: CharacterClass;
    description: string | null;
    image: string | null;
    maxHp: number;
    currentHp: number;
    maxCost: number;
    currentCost: number;
    attack: number;
    defense: number;
    speed: number;
    dodge: number;
    crit: number;
}

export interface CharacterUpdateFormData {
    name: string;
    image: string | null;
}
