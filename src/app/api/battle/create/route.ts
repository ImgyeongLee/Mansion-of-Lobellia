import { createBattleRoom } from '@/lib/db/actions/battle';
import { addCharacterToBattleRoom } from '@/lib/db/actions/characters';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { formData, characterId } = await req.json();

        const result = await createBattleRoom(formData);

        if (result.success && result.battleRoom) {
            // Update the character's battleRoomId
            const characterResult = await addCharacterToBattleRoom(characterId, result.battleRoom.id);
            if (characterResult.success) {
                return NextResponse.json({
                    message: 'Battle room created successfully!',
                    battleRoomId: result.battleRoom.id,
                });
            }
        } else {
            return NextResponse.json({ message: 'Battle room creation failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating battle room:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
