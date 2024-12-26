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
