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
