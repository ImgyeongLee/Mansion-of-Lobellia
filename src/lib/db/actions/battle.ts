import { BattleRoomFormData } from '@/static/types/battle';
import prisma from '../prisma';

export async function createBattleRoom(formData: BattleRoomFormData) {
    try {
        const newBattleRoom = await prisma.battleRoom.create({
            data: {
                ...formData,
            },
        });

        return { success: true, battleRoom: newBattleRoom };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function deleteBattleRoom(battleRoomId: string) {
    try {
        await prisma.battleRoom.delete({
            where: {
                id: battleRoomId,
            },
        });

        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
