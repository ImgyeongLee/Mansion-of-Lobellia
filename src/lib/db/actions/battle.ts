import { BattleRoom, BattleRoomFormData } from '@/static/types/battle';
import prisma from '../prisma';
import { Entity } from '@prisma/client';
import { Character } from '@/static/types/character';
import { supabase } from '../supabase/client';

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

export async function getBattleRoomByCode(code: string) {
    try {
        const { data, error } = await supabase
            .from('BattleRoom')
            .select('*')
            .eq('invitationCode', code.trim())
            .single();
        if (error) {
            console.error('Error fetching battle room:', error);
            return { success: false };
        }
        return { success: true, data: data as BattleRoom };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function createTurnQueue(battleRoomId: string, participants: (Entity | Character)[]) {
    try {
        const sortedParticipants = participants.sort((a, b) => b.speed - a.speed);

        const turnQueueData = sortedParticipants.map((participant, index) => ({
            roomId: battleRoomId,
            subjectId: participant.id,
            order: index + 1,
            subjectType: typeof participant as string,
        }));

        const createdTurnQueue = await prisma.turnQueue.createMany({
            data: turnQueueData,
        });

        console.log('TurnQueue created successfully:', createdTurnQueue);

        return { success: true, data: createdTurnQueue };
    } catch (error) {
        console.error('Error creating TurnQueue:', error);
        throw new Error('Failed to create TurnQueue.');
    }
}

export async function getTurnQueue(battleRoomId: string) {
    try {
        const turnQueue = await prisma.turnQueue.findMany({
            where: {
                roomId: battleRoomId,
            },
            orderBy: {
                order: 'asc',
            },
        });

        return { success: true, data: turnQueue };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function proceedTurnQueue(subjectId: string) {
    try {
        const subject = await prisma.turnQueue.findFirst({
            where: {
                subjectId: subjectId,
            },
        });

        if (!subject) return { success: false };
        subject.order += 2;
        await prisma.turnQueue.update({
            where: {
                id: subject.id,
            },
            data: {
                order: subject.order,
            },
        });

        return { sucess: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
