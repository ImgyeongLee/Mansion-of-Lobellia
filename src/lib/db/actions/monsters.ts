import prisma from '../prisma';

export async function getMonstersByDungeon(dungeonId: string) {
    try {
        const dungeonWithMonsters = await prisma.dungeon.findUnique({
            where: {
                id: dungeonId,
            },
            include: {
                monsters: {
                    include: {
                        monster: true,
                    },
                },
            },
        });

        const monsters = dungeonWithMonsters?.monsters.map((relation) => relation.monster);
        return { success: true, data: monsters };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
