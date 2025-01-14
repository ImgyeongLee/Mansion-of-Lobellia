import { Entity, Monster } from '@/static/types/monster';
import prisma from '../prisma';
import { getSkillsByMonster } from './monsters';
import { supabase } from '../supabase/client';
import { Prisma } from '@prisma/client';

export async function getEntity(entityId: string) {
    try {
        const entity = await prisma.entity.findUnique({
            where: {
                id: entityId,
            },
        });

        return { success: true, data: entity };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function getEntitiesByRoomId(roomId: string) {
    try {
        const { data, error } = await supabase
            .from('Entity')
            .select('*')
            .eq('roomId', roomId)
            .order('name', { ascending: true });

        if (error) {
            return { success: false, error };
        }

        return { success: true, entities: data };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

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
        const updateData = Prisma.validator<Prisma.CharacterUpdateInput>()({
            ...data,
            createdAt: undefined,
        });

        const updatedEntity = await prisma.entity.update({
            where: {
                id: entityId,
            },
            data: updateData,
        });

        return { success: true, data: updatedEntity };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function getSkillsByEntity(entityId: string) {
    try {
        const entitySkills = await prisma.entity.findUnique({
            where: {
                id: entityId,
            },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });

        const skills = entitySkills?.skills.map((relation) => relation.skill);

        return { success: true, data: skills };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
