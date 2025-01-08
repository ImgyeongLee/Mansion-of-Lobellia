export interface Monster {
    id: string;
    image: string | null;
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
    roomId: string;
    image: string | null;
    name: string;
    description: string | null;
    attack: number;
    defense: number;
    speed: number;
    maxHp: number;
    currentHp: number;
    crit: number;
    dodge: number;
    reward: number;
    colPos: number;
    rowPos: number;
    isDead: boolean;
    isStun: boolean;
    isConfused: boolean;
    buffedAmount: number;
    buffedTurn: number;
    dotDamageTurn: number;
    dotDamageAmount: number;
}
