export interface AIResponse {
    id: number;
    entityId: string;
    targetId: string[];
    skillId: string;
    rowPos: number;
    colPos: number;
    damage: number;
    hasTarget: boolean;
    isDead: boolean;
    isStun: boolean;
    isConfused: boolean;
    buffedAmount: number;
    buffedTurn: number;
    dotDamageTurn: number;
    dotDamageAmount: number;
}
