export type DungeonDifficulty = 'Easy' | 'Normal' | 'Hard';

export interface Dungeon {
    id: string;
    name: string;
    size: number;
    description: string | null;
    image: string | null;
    difficulty: DungeonDifficulty;
    minMember: number;
    maxMember: number;
}
