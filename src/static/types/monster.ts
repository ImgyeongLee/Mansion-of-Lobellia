export type DungeonDifficulty = 'Easy' | 'Normal' | 'Hard';

export interface Monster {
    id: string;
    name: string;
    description: string | null;
    maxHp: number;
    attack: number;
    defense: number;
    dodge: number;
    crit: number;
    speed: number;
    reward: number;
}
