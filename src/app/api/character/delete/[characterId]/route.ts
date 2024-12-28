import { deleteCharacter } from '@/lib/db/actions/characters';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { characterId: string } }) {
    try {
        const { characterId } = params;

        const result = await deleteCharacter(characterId);

        if (result.success) {
            return NextResponse.json({ message: 'Character deleted successfully!' });
        } else {
            return NextResponse.json({ message: 'Character deletion failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
