import { getCharacterInventory } from '@/lib/db/actions/inventory';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { characterId: string } }) {
    try {
        const { characterId } = params;

        const result = await getCharacterInventory(characterId);

        if (result.success) {
            return NextResponse.json({ message: 'Character Inventory fetching successfully!', data: result.data });
        } else {
            return NextResponse.json({ message: 'Character Inventory fetching failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
