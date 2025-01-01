import { Entity, Monster } from '@/static/types/monster';
import prisma from '../prisma';
import { getSkillsByMonster } from './monsters';

export async function createEntity(battleRoomId: string, monsterType: Monster) {
    try {
        const newEntity = await prisma.entity.create({
            data: {
                roomId: battleRoomId,
                ...monsterType,
                currentHp: monsterType.maxHp,
            },
        });

        const skills = await getSkillsByMonster(monsterType.id);

        if (!skills.success || !skills.data) {
            console.log('Error fetching skills');
            return { success: false };
        }

        if (skills.data) {
            await Promise.all(
                skills.data.map(async (skill) => {
                    await prisma.entitySkillRelation.create({
                        data: { entityId: newEntity.id, skillId: skill.id },
                    });
                })
            );
        }

        return { success: true, data: newEntity };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function deleteEntity(entityId: string) {
    try {
        await prisma.entity.delete({
            where: {
                id: entityId,
            },
        });

        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function updateEntity(entityId: string, data: Entity) {
    try {
        const updated = await prisma.entity.update({
            where: {
                id: entityId,
            },
            data: {
                ...data,
            },
        });

        return { success: true, data: updated };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
