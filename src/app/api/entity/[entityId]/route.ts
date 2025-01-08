import { getEntity, getSkillsByEntity } from '@/lib/db/actions/entity';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { entityId: string } }) {
    try {
        const { entityId } = params;

        const entityResult = await getEntity(entityId);

        if (!entityResult.success) return NextResponse.json({ message: 'Entity fetching failed.' }, { status: 500 });

        const skillsResult = await getSkillsByEntity(entityId);

        if (!skillsResult.success) return NextResponse.json({ message: 'Skills fetching failed.' }, { status: 500 });

        const data = { entity: entityResult.data, skills: skillsResult.data };

        return NextResponse.json({ message: 'Entity fetching successfully!', data: data });
    } catch (error) {
        console.error('Error in GET /entity/[entityId]:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
