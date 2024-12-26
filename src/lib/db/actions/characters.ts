import { characterFormSchema } from '@/static/formSchema';
import { supabase } from '../supabase/client';
import { z } from 'zod';

export async function createCharacter(sub: string, formData: z.infer<typeof characterFormSchema>) {
    try {
        const { error } = await supabase
            .from('Character')
            .upsert([{ userId: sub, roomId: '', name: formData.name, class: formData.class }]);
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Failed to upsert User:', error);
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
