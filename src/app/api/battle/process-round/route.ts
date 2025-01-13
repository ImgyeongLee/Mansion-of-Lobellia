import { proceedTurnQueue } from '@/lib/db/actions/battle';
import { getCharactersByRoomId } from '@/lib/db/actions/characters';
import { getEntitiesByRoomId } from '@/lib/db/actions/entity';
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
                roomStatus: 'Waiting',
            },
        });

        const characters = await getCharactersByRoomId(battleId);
        const entities = await getEntitiesByRoomId(battleId);

        if (characters.success && characters.characters && entities.success && entities.entities) {
            const CLEN = characters.characters.length;
            const ELEN = entities.entities.length;
            let characterCount = 0;
            let entityCount = 0;

            await Promise.all(
                characters.characters.map(async (character) => {
                    if (character.isDead) {
                        characterCount += 1;
                    }
                    await prisma.character.update({
                        where: {
                            id: character.id,
                        },
                        data: {
                            hasActioned: false,
                            hasMoved: false,
                            hasUsedUltimate: false,
                        },
                    });
                })
            );

            entities.entities.forEach((entity) => {
                if (entity.isDead) {
                    entityCount += 1;
                }
            });

            if (entityCount >= ELEN || characterCount >= CLEN) {
                await prisma.battleRoom.update({
                    where: {
                        id: battleId,
                    },
                    data: {
                        roomStatus: 'End',
                    },
                });
            } else {
                const firstSecondTurn = await prisma.turnQueue.findMany({
                    where: {
                        roomId: battleId,
                    },
                });

                if (firstSecondTurn[0]) {
                    console.log('increase this');
                    await proceedTurnQueue(firstSecondTurn[0].subjectId, ELEN + CLEN);
                }

                if (firstSecondTurn[1]) {
                    console.log('update this');
                    await prisma.battleRoom.update({
                        where: {
                            id: battleId,
                        },
                        data: {
                            roomStatus: firstSecondTurn[1].subjectType == 'Character' ? 'Character' : 'Monster',
                        },
                    });
                }
            }
            return NextResponse.json({ message: 'Successfully processed the round.' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Cannot find characters by a given battleId.' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
