import { Character } from '@/static/types/character';
import { Item } from '@/static/types/item';
import { Entity } from '@/static/types/monster';
import { CharacterSkill } from '@prisma/client';

export async function handleCharacterAction(
    character: Character,
    skill?: CharacterSkill,
    targetEntities?: Entity[],
    targetCharacters?: Character[]
) {
    if (skill) {
        if (skill.name == 'Swing') {
            if (targetEntities) {
                targetEntities.forEach((entity: Entity) => {
                    entity.currentHp -= calculateCharacterAttackAmount(character, 1, entity);
                    if (entity.currentHp <= 0) {
                        entity.currentHp = 0;
                        entity.isDead = true;
                    }
                });
            }
        } else if (skill.name == 'Strike') {
            if (targetEntities) {
                targetEntities[0].currentHp -= calculateCharacterAttackAmount(character, 1.3, targetEntities[0]);
                if (targetEntities[0].currentHp <= 0) {
                    targetEntities[0].currentHp = 0;
                    targetEntities[0].isDead = true;
                }
            }
        } else if (skill.name == 'Adrenaline') {
            character.attackBuffedAmount = 30;
            character.attackBuffedTurn = 2;
        } else if (skill.name == 'Defensive Stance') {
            character.defenseBuffedAmount = 30;
            character.defenseBuffedTurn = 2;
        } else if (skill.name == 'Vibrating Smash') {
            if (targetEntities) {
                targetEntities[0].currentHp -= calculateCharacterAttackAmount(character, 3, targetEntities[0]);
                character.isStun = true;
                if (targetEntities[0].currentHp <= 0) {
                    targetEntities[0].currentHp = 0;
                    targetEntities[0].isDead = true;
                }
            }
        } else if (skill.name == 'First Aid') {
            if (targetCharacters) {
                targetCharacters.forEach((character: Character) => {
                    character.currentHp += character.attack;
                    if (character.currentHp >= character.maxHp) {
                        character.currentHp = character.maxHp;
                    }
                });
            }
        } else if (skill.name == 'Inspire') {
            if (targetCharacters) {
                targetCharacters.forEach((character: Character) => {
                    character.currentCost += Math.floor(character.maxCost * 0.5);
                    if (character.currentCost >= character.maxCost) {
                        character.currentCost = character.maxCost;
                    }
                });
            }
        } else if (skill.name == 'Resurrection') {
            if (targetCharacters) {
                targetCharacters[0].isDead = false;
                targetCharacters[0].currentHp = Math.floor(targetCharacters[0].maxHp * 0.5);
            }
        } else if (skill.name == 'Guardian') {
            if (targetCharacters) {
                targetCharacters[0].protectorId = character.id;
                targetCharacters[0].protectedTurn = 2;
                character.defenseBuffedAmount = 50;
                character.defenseBuffedTurn = 2;
            }
        } else if (skill.name == 'Focus') {
            if (targetCharacters) {
                targetCharacters[0].isFocused = true;
            }
        }

        character.currentHp -= skill.requiredHp;
        character.currentCost -= skill.requiredCost;
    }
}

export async function handleCharacterItem(character: Character, item: Item) {
    if (item.name == 'Beginner Health Recovery Potion') {
        character.currentHp += Math.round(character.maxHp * 0.15);
        if (character.currentHp >= character.maxHp) {
            character.currentHp = character.maxHp;
        }
    } else if (item.name == 'Beginner Energy Recovery Potion') {
        character.currentCost += Math.round(character.maxCost * 0.15);
        if (character.currentCost >= character.maxCost) {
            character.currentCost = character.maxCost;
        }
    }
}

function calculateCharacterAttackAmount(character: Character, skillEffect: number, entity?: Entity) {
    let characterDamage = Math.round(
        (character.attack + character.attack * ((100 + character.attackBuffedAmount) / 100)) * skillEffect
    );

    if (character.isFocused) {
        characterDamage *= 2;
        character.isFocused = false;
    } else if (isCritical(character)) {
        characterDamage *= 2;
    }

    if (entity) {
        const finalDamage = Math.round(characterDamage * ((100 - entity.defense) / 100));
        return finalDamage;
    }
    return characterDamage;
}

function isCritical(character: Character) {
    return Math.random() * 100 <= character.crit;
}
