import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { skillId: string } }) {
    try {
        const { skillId } = params;

        const skillResult = await prisma.monsterSkill.findFirst({
            where: {
                id: skillId,
            },
        });

        if (!skillResult) return NextResponse.json({ message: 'Skill fetching failed.' }, { status: 500 });

        const data = { success: true, skill: skillResult };

        return NextResponse.json({ message: 'Entity fetching successfully!', data: data });
    } catch (error) {
        console.error('Error in GET /entity/[entityId]:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
