import { getCharactersByRoomId } from '@/lib/db/actions/characters';
import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { battleId } = await req.json();

        await prisma.battleRoom.update({
            where: {
                id: battleId,
            },
            data: {
                round: {
                    increment: 1,
                },
            },
        });

        const characters = await getCharactersByRoomId(battleId);

        if (characters.success && characters.characters) {
            characters.characters.forEach((character) => {
                character.hasActioned = false;
                character.hasMoved = false;
                character.hasUsedUltimate = false;
            });
            return NextResponse.json({ message: 'Round increased by one successfully!' });
        } else {
            return NextResponse.json({ message: 'Cannot find characters by a given battleId.' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
