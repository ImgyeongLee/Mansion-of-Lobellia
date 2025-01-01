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

export async function getSkillsByMonster(monsterId: string) {
    try {
        const monsterWithSkills = await prisma.monster.findUnique({
            where: {
                id: monsterId,
            },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });

        const skills = monsterWithSkills?.skills.map((relation) => relation.skill);
        return { success: true, data: skills };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
