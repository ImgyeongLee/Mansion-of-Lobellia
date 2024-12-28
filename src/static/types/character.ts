export type CharacterClass = 'Gladiolus' | 'Saintpaulia' | 'Cypress' | 'Blackthorn';

export interface CharacterSkill {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    type: string;
    range: string;
    requiredCost: number;
    requiredHp: number;
}

export interface Character {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    class: string;
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
