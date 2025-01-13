import { NextRequest, NextResponse } from 'next/server';
import { getTurnQueue } from '@/lib/db/actions/battle';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const battleId = searchParams.get('battleId');

    if (!battleId) {
        return NextResponse.json({ error: 'Battle ID is required' }, { status: 400 });
    }

    try {
        const turnQueue = await getTurnQueue(battleId);
        if (!turnQueue) {
            return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: turnQueue });
    } catch (error) {
        console.error('Error fetching battle info:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
