import { getSkillByCharacter } from '@/lib/db/actions/skills';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { characterId: string } }) {
    try {
        const { characterId } = params;

        const result = await getSkillByCharacter(characterId);

        if (result.success) {
            return NextResponse.json({ message: 'Character Skills fetching successfully!', data: result.data });
        } else {
            return NextResponse.json({ message: 'Character Skills fetching failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
