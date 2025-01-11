import { Character, CharacterCreationFormData } from '@/static/types/character';
import prisma from '../prisma';
import { supabase } from '../supabase/client';

export async function createCharacter(formData: CharacterCreationFormData, userSkills: string[]) {
    try {
        const newCharacter = await prisma.character.create({
            data: {
                ...formData,
            },
        });

        await Promise.all(
            userSkills.map(async (skill) => {
                await prisma.characterSkillRelation.create({
                    data: { characterId: newCharacter.id, skillId: skill },
                });
            })
        );

        return { success: true, character: newCharacter };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function deleteCharacter(characterId: string) {
    try {
        await prisma.character.delete({
            where: {
                id: characterId,
            },
        });

        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function updateCharacter(character: Character) {
    try {
        const updatedCharacter = await prisma.character.update({
            where: {
                id: character.id,
            },
            data: {
                ...character,
            },
        });

        return { success: true, character: updatedCharacter };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function addCharacterToBattleRoom(characterId: string, roomId: string) {
    try {
        const updatedCharacter = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                roomId: roomId,
            },
        });

        return { success: true, data: updatedCharacter };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function removeCharacterFromBattleRoom(characterId: string) {
    try {
        const updatedCharacter = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                roomId: null,
            },
        });

        return { success: true, data: updatedCharacter };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function getCharactersByRoomId(roomId: string) {
    try {
        const { data, error } = await supabase
            .from('Character')
            .select('*')
            .eq('roomId', roomId)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching characters:', error);
            return { success: false, error };
        }

        return { success: true, characters: data };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function leaveBattleRoom(characterId: string, roomId: string) {
    try {
        const { data, error } = await supabase.from('Character').update({ roomId: null }).eq('id', characterId);

        if (error) {
            console.error('Error leaving battle room:', error);
            return { success: false, error };
        }

        const characters = await supabase.from('Character').select('*').eq('roomId', roomId);
        if (characters.error) {
            console.error('Error fetching characters:', characters.error);
            return { success: false, error: characters.error };
        }

        if (characters.data.length === 0) {
            const { error } = await supabase.from('BattleRoom').delete().eq('id', roomId);
            if (error) {
                console.error('Error deleting battle room:', error);
                return { success: false, error };
            }
        }

        return { success: true, updatedCharacter: data };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}
