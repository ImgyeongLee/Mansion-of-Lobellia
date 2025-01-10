import { createBattleRoom } from '@/lib/db/actions/battle';
import { addCharacterToBattleRoom } from '@/lib/db/actions/characters';
import { createEntity, updateEntity } from '@/lib/db/actions/entity';
import { getMonstersByDungeon } from '@/lib/db/actions/monsters';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { formData, characterId, dungeonId } = await req.json();

        // First, get all monsters of the dungeon to create the entities
        const monsters = await getMonstersByDungeon(dungeonId);

        if (!monsters.success) {
            console.error('Error fetching the monsters by the dungeon');
            return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
        }

        if (!monsters.data) {
            console.error('The monster data is empty.');
            return NextResponse.json({ message: 'Internal server error.' }, { status: 404 });
        }

        // Second, create a new battle room
        const result = await createBattleRoom(formData);

        // Finally, initialize the battle room
        // Adding the character and the monsters to the room.
        if (result.success && result.battleRoom) {
            // Update the character's battleRoomId (Add the character to the room)
            const characterResult = await addCharacterToBattleRoom(characterId, result.battleRoom.id);
            const positions: string[] = [];

            // Create the entities and add them to the room
            try {
                await Promise.all(
                    monsters.data.map(async (monster) => {
                        const newEntity = await createEntity(result.battleRoom.id, monster);
                        if (newEntity.data) {
                            let rowPos = Math.floor(Math.random() * result.battleRoom.size);
                            let colPos = Math.floor(Math.random() * result.battleRoom.size);
                            if (positions.includes(`${rowPos}-${colPos}`)) {
                                while (positions.includes(`${rowPos}-${colPos}`)) {
                                    rowPos = Math.floor(Math.random() * result.battleRoom.size);
                                    colPos = Math.floor(Math.random() * result.battleRoom.size);
                                }
                            }
                            positions.push(`${rowPos}-${colPos}`);
                            await updateEntity(newEntity.data.id, {
                                ...newEntity.data,
                                rowPos: rowPos,
                                colPos: colPos,
                                roomId: result.battleRoom.id,
                            });
                        }
                    })
                );
            } catch (error) {
                console.error('Error adding entity to the battle room:', error);
                return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
            }

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
