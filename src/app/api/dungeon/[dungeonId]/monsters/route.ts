import { getMonstersByDungeon } from '@/lib/db/actions/monsters';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { dungeonId: string } }) {
    try {
        const { dungeonId } = params;

        const result = await getMonstersByDungeon(dungeonId);

        if (result.success) {
            return NextResponse.json({ message: 'Monster fetching successfully!', data: result.data });
        } else {
            return NextResponse.json({ message: 'Monster fetching failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching monsters:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
