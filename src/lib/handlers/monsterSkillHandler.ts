import { Character } from '@/static/types/character';
import { AIResponse } from '@/static/types/lambdaAi';
import { Entity, MonsterSkill } from '@/static/types/monster';
import { createChat } from '../db/actions/chat';

export async function handleAIResponse(
    roomId: string,
    response: AIResponse,
    entity: Entity,
    skill?: MonsterSkill,
    targetCharacters?: Character[],
    targetEntites?: Entity[]
) {
    // Handle their movement first
    entity.colPos = response.colPos;
    entity.rowPos = response.rowPos;

    // Handle their skill actions
    if (skill) {
        if (skill.name == 'Clumsy Attack') {
            if (targetCharacters) {
                Promise.all(
                    targetCharacters.map(async (character) => {
                        if (character.isImmortal) {
                            await createChat({
                                roomId: roomId,
                                sender: 'System',
                                body: `${character.name} is currently immortal`,
                                image: null,
                                chatType: 'Result',
                            });
                            return;
                        }
                        const entityDamage = calculateEntityAttackAmount(entity, 1, character);
                        character.currentHp -= entityDamage;
                        if (character.currentHp <= 0) {
                            character.isDead = true;
                            character.currentHp = 0;
                        }
                    })
                );
            }
        } else if (skill.name == 'Clumsy Heal') {
            if (targetEntites) {
                targetEntites[0].currentHp += Math.round(targetEntites[0].maxHp * 0.2);
                if (targetEntites[0].currentHp >= targetEntites[0].maxHp) {
                    targetEntites[0].currentHp = targetEntites[0].maxHp;
                }
            }
        } else if (skill.name == 'Morale Boost') {
            if (targetEntites) {
                targetEntites[0].buffedAmount = 30;
                targetEntites[0].buffedTurn = 2;
            }
        }
    }
}

function calculateEntityAttackAmount(entity: Entity, skillEffect: number, character?: Character) {
    let entityDamage = Math.round((entity.attack + entity.attack * ((100 + entity.buffedAmount) / 100)) * skillEffect);

    if (isCritical(entity)) {
        entityDamage *= 2;
    }

    if (character) {
        const finalDamage = Math.round(entityDamage * ((100 - character.defense) / 100));
        return finalDamage;
    }

    return entityDamage;
}

function isCritical(entity: Entity) {
    return Math.random() * 100 <= entity.crit;
}
