'use server';

import { SkillType } from '@prisma/client';
import prisma from '../prisma';

export async function getSkillByClass(characterClass: SkillType) {
    const skills = await prisma.characterSkill.findMany({
        where: {
            OR: [{ type: characterClass }, { type: 'General' }],
        },
    });

    return skills;
}

export async function getSkillByCharacter(characterId: string) {
    try {
        const characterSkills = await prisma.character.findUnique({
            where: {
                id: characterId,
            },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });

        const skills = characterSkills?.skills.map((relation) => relation.skill);

        return { success: true, data: skills };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
