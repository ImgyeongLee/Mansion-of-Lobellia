import { Character } from "@/static/types/character";
import { Entity } from "@/static/types/monster";

export interface AIResponse {
    id: number;
    entityId: string;
    targetId: string[] | null;
    skillId: string | null;
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

export interface EntityWithSkills extends Entity {
    skills: {
        id: string;
        image: string | null;
        name: string;
        description: string | null;
        range: "Self" | "Narrow" | "Normal" | "Wide";
        isSelfTargeting: boolean;
        isEntire: boolean;
    }[]
}

export interface BattleState {
    roomId: string;
    round: number;
    entities: EntityWithSkills[];
    characters: Character[];
}

// Usage example:
// const battleState: BattleState = {
//     roomId: "room123",
//     round: 1,
//     entities: [{
//         id: "entity1",
//         roomId: "room123",
//         image: null,
//         name: "Goblin",
//         description: null,
//         attack: 50,
//         defense: 30,
//         speed: 15,
//         maxHp: 100,
//         currentHp: 100,
//         crit: 5,
//         dodge: 10,
//         reward: 100,
//         colPos: 1,
//         rowPos: 1,
//         isDead: false,
//         isStun: false,
//         isConfused: false,
//         buffedAmount: 0,
//         buffedTurn: 0,
//         dotDamageTurn: 0,
//         dotDamageAmount: 0,
//         skills: [{
//             id: '1',
//             image: '/someimage',
//             name: "Slash",
//             description: "A basic slash attack",
//             range: "Normal",
//             isSelfTargeting: false,
//             isEntire: false
//         }]
//     }],
//     characters: [{
//         id: "char1",
//         name: "Hero",
//         image: null,
//         description: null,
//         class: "Gladiolus",
//         maxHp: 120,
//         currentHp: 120,
//         maxCost: 100,
//         currentCost: 100,
//         money: 0,
//         attack: 60,
//         defense: 40,
//         dodge: 15,
//         crit: 10,
//         speed: 20,
//         rowPos: 3,
//         colPos: 3,
//         hasMoved: false,
//         hasActioned: false,
//         hasUsedUltimate: false,
//         isDead: false,
//         isConfused: false,
//         isDark: false,
//         isImmortal: false,
//         attackBuffedAmount: 0,
//         attackBuffedTurn: 0,
//         defenseBuffedAmount: 0,
//         defenseBuffedTurn: 0,
//         protectorId: null,
//         protectedTurn: 0,
//         dotDamageTurn: 0,
//         dotDamageAmount: 0
//     }]
// };