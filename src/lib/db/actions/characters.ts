import { characterFormSchema } from '@/static/formSchema';
import { supabase } from '../supabase/client';
import { z } from 'zod';
import { CharacterCreationFormData } from '@/static/types';
import prisma from '../prisma';

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

export async function updateCharacter(sub: string, characterId: string, formData: z.infer<typeof characterFormSchema>) {
    try {
        const { error } = await supabase
            .from('Character')
            .update({ name: formData.name, class: formData.class })
            .eq('userId', sub)
            .eq('id', characterId);
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Failed to update Character:', error);
    }
}

export async function deleteCharacter(sub: string, characterId: string) {
    try {
        const { error } = await supabase.from('Character').delete().eq('userId', sub).eq('id', characterId);
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Failed to delete Character:', error);
    }
}
