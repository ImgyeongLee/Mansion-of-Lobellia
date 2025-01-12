import { supabase } from '../supabase/client';

export async function createUser(sub: string, email: string, name: string) {
    try {
        const { error } = await supabase.from('User').insert([{ id: sub, email: email, name: name, isAdmin: false }]);
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Failed to upsert User:', error);
    }
}
