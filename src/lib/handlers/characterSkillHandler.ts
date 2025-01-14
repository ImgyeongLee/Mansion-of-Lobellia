import { Character } from '@/static/types/character';
import { Item } from '@/static/types/item';
import { Entity } from '@/static/types/monster';
import { CharacterSkill } from '@prisma/client';
import { createChat } from '../db/actions/chat';

export async function handleCharacterAction(
    roomId: string,
    character: Character,
    skill?: CharacterSkill,
    targetEntities?: Entity[],
    targetCharacters?: Character[]
) {
    if (skill) {
        await createChat({
            roomId: roomId,
            sender: 'System',
            body: `${character.name} used ${skill.name} skill`,
            image: null,
            chatType: 'Action',
        });

        if (skill.name == 'Swing') {
            if (targetEntities) {
                targetEntities.forEach(async (entity: Entity) => {
                    const damage = calculateCharacterAttackAmount(character, 1, entity);
                    entity.currentHp -= damage;
                    await createChat({
                        roomId: roomId,
                        sender: 'System',
                        body: `${entity.name} got ${damage} damage!`,
                        image: null,
                        chatType: 'Result',
                    });
                    if (entity.currentHp <= 0) {
                        entity.currentHp = 0;
                        entity.isDead = true;
                        await createChat({
                            roomId: roomId,
                            sender: 'System',
                            body: `${entity.name} is dead.`,
                            image: null,
                            chatType: 'Debuff',
                        });
                    }
                });
            }
        } else if (skill.name == 'Strike') {
            if (targetEntities) {
                const damage = calculateCharacterAttackAmount(character, 1.3, targetEntities[0]);
                targetEntities[0].currentHp -= damage;
                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `${targetEntities[0].name} got ${damage} damage!`,
                    image: null,
                    chatType: 'Result',
                });
                if (targetEntities[0].currentHp <= 0) {
                    targetEntities[0].currentHp = 0;
                    targetEntities[0].isDead = true;
                    await createChat({
                        roomId: roomId,
                        sender: 'System',
                        body: `${targetEntities[0].name} is dead.`,
                        image: null,
                        chatType: 'Debuff',
                    });
                }
            }
        } else if (skill.name == 'Adrenaline') {
            character.attackBuffedAmount = 30;
            character.attackBuffedTurn = 2;
            await createChat({
                roomId: roomId,
                sender: 'System',
                body: `${character.name}'s attack power has been 30% increased for 2 turns!`,
                image: null,
                chatType: 'Buff',
            });
        } else if (skill.name == 'Defensive Stance') {
            character.defenseBuffedAmount = 30;
            character.defenseBuffedTurn = 2;
            await createChat({
                roomId: roomId,
                sender: 'System',
                body: `${character.name}'s defense power has been 30% increased for 2 turns!`,
                image: null,
                chatType: 'Buff',
            });
        } else if (skill.name == 'Vibrating Smash') {
            if (targetEntities) {
                const damage = calculateCharacterAttackAmount(character, 3, targetEntities[0]);
                targetEntities[0].currentHp -= damage;
                character.isStun = true;

                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `${targetEntities[0].name} got ${damage} damage!`,
                    image: null,
                    chatType: 'Result',
                });

                if (targetEntities[0].currentHp <= 0) {
                    targetEntities[0].currentHp = 0;
                    targetEntities[0].isDead = true;
                    await createChat({
                        roomId: roomId,
                        sender: 'System',
                        body: `${targetEntities[0].name} is dead.`,
                        image: null,
                        chatType: 'Debuff',
                    });
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

                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `Allies recovers ${character.attack} HP!`,
                    image: null,
                    chatType: 'Buff',
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

                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `Allies recovers 50% of their max Cost!`,
                    image: null,
                    chatType: 'Buff',
                });
            }
        } else if (skill.name == 'Resurrection') {
            if (targetCharacters) {
                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `${targetCharacters[0].name} has been reborn!`,
                    image: null,
                    chatType: 'Buff',
                });
                targetCharacters[0].isDead = false;
                targetCharacters[0].currentHp = Math.floor(targetCharacters[0].maxHp * 0.5);
            }
        } else if (skill.name == 'Guardian') {
            if (targetCharacters) {
                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `${character.name} will protect ${targetCharacters[0].name} for 2 turns!`,
                    image: null,
                    chatType: 'Buff',
                });
                targetCharacters[0].protectorId = character.id;
                targetCharacters[0].protectedTurn = 2;
                character.defenseBuffedAmount = 50;
                character.defenseBuffedTurn = 2;
            }
        } else if (skill.name == 'Focus') {
            if (targetCharacters) {
                await createChat({
                    roomId: roomId,
                    sender: 'System',
                    body: `${targetCharacters[0].name} is focused!`,
                    image: null,
                    chatType: 'Buff',
                });
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
