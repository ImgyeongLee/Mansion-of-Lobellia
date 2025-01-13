import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { createTurnQueue, updateBattleStatus } from '@/lib/db/actions/battle';
import { getCharactersByRoomId } from '@/lib/db/actions/characters';
import { getEntitiesByRoomId } from '@/lib/db/actions/entity';

export async function POST(request: NextRequest) {
    try {
        const { battleId, characterId, rowIndex, colIndex } = await request.json();

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
            },
        });

        await updateBattleStatus(battleId, 'Waiting');
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

        // Get all participants
        const characterResult = await getCharactersByRoomId(battleId);
        const entityResult = await getEntitiesByRoomId(battleId);

        if (characterResult.success && entityResult.success) {
            const characters = characterResult.characters ? characterResult.characters : [];
            const entities = entityResult.entities ? entityResult.entities : [];

            // Create a turn queue table
            const queueResult = await createTurnQueue(battleId, [...characters, ...entities]);

            if (!queueResult.success) {
                console.error('Error creating turn queue');
                return NextResponse.json({ error: 'Failed to create turn queue' }, { status: 500 });
            }

            const turnQueue = await prisma.turnQueue.findMany({
                where: {
                    roomId: battleId,
                },
            });

            if (turnQueue.length > 0) {
                if (turnQueue[0].subjectType == 'Character') {
                    const finalRoom = await updateBattleStatus(battleId, 'Character');

                    return NextResponse.json({
                        success: true,
                        data: { character: updatedCharacter, room: finalRoom, turnQueue: turnQueue },
                    });
                } else {
                    const finalRoom = await updateBattleStatus(battleId, 'Monster');

                    return NextResponse.json({
                        success: true,
                        data: { character: updatedCharacter, room: finalRoom, turnQueue: turnQueue },
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error moving character:', error);
        return NextResponse.json({ error: 'Failed to move character' }, { status: 500 });
    }
}
