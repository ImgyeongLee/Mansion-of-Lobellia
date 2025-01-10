import { Character } from '@/static/types/character';
import { AIResponse } from '@/static/types/lambdaAi';
import { Entity, MonsterSkill } from '@/static/types/monster';

export async function handleAIResponse(
    response: AIResponse,
    entity: Entity,
    skill?: MonsterSkill,
    targetCharacters?: Character[],
    targetEntites?: Entity[]
) {
    // Handle their movement first
    entity.colPos = response.colPos;
    entity.rowPos = response.rowPos;

    // Update their status
    entity.isDead = response.isDead;
    entity.isStun = response.isStun;
    entity.isConfused = response.isConfused;
    entity.buffedAmount = response.buffedAmount;
    entity.buffedTurn = response.buffedTurn;
    entity.dotDamageTurn = response.dotDamageTurn;
    entity.dotDamageAmount = response.dotDamageAmount;

    if (!response.hasTarget) {
        return;
    }

    // If the action has the target, handle that case
}

function calculateEntityAttackAmount(entity: Entity, skillEffect: number, character?: Character) {}

function isCritical(entity: Entity) {
    return Math.random() * 100 <= entity.crit;
}
