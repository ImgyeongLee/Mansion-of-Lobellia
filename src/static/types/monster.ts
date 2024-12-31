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

export interface Entity {
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
    rowPos: number;
    colPos: number;
    isDead: boolean;
    isStun: boolean;
    isConfused: boolean;
    buffedAmount: number;
    buffedTurn: number;
    dotDamageTurn: number;
    dotDamageAmount: number;
}
