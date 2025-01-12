import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
    try {
        const { characterId, rowIndex, colIndex } = await request.json();

        if (!characterId || rowIndex === undefined || colIndex === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update character position
        const updatedCharacter = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                rowPos: rowIndex,
                colPos: colIndex,
                hasMoved: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedCharacter,
        });
    } catch (error) {
        console.error('Error moving character:', error);
        return NextResponse.json({ error: 'Failed to move character' }, { status: 500 });
    }
}
