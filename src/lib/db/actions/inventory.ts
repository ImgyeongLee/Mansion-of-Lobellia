'use server';

import prisma from '../prisma';

export async function getCharacterInventory(characterId: string) {
    try {
        const characterItems = await prisma.character.findUnique({
            where: {
                id: characterId,
            },
            include: {
                inventory: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        const items = characterItems?.inventory.map((relation) => ({
            item: relation.item,
            amount: relation.amount,
        }));

        return { success: true, data: items };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function addItemToInventory(characterId: string, itemId: string, amount: number) {
    try {
        const inventoryItem = await prisma.characterInventory.upsert({
            where: {
                characterId_itemId: {
                    characterId,
                    itemId,
                },
            },
            update: {
                amount: {
                    increment: amount,
                },
            },
            create: {
                characterId,
                itemId,
                amount,
            },
        });

        return { success: true, data: inventoryItem };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function removeItemFromInventory(characterId: string, itemId: string, amount: number) {
    try {
        const inventoryItem = await prisma.characterInventory.update({
            where: {
                characterId_itemId: {
                    characterId,
                    itemId,
                },
            },
            data: {
                amount: {
                    decrement: amount,
                },
            },
        });

        if (inventoryItem.amount <= 0) {
            await prisma.characterInventory.delete({
                where: {
                    characterId_itemId: {
                        characterId,
                        itemId,
                    },
                },
            });
        }

        return { success: true, data: inventoryItem };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function increaseMoney(characterId: string, amount: number) {
    try {
        const character = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                money: {
                    increment: amount,
                },
            },
        });

        return { success: true, data: character };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function decreaseMoney(characterId: string, amount: number) {
    try {
        const character = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                money: {
                    decrement: amount,
                },
            },
        });

        return { success: true, data: character };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
