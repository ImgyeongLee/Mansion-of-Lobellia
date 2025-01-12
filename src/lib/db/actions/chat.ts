import { ChatBody } from '@/static/types/battle';
import { supabase } from '../supabase/client';

export async function createChat(chat: ChatBody) {
    const { error } = await supabase.from('Chat').insert(chat);

    if (error) {
        return { success: false, error };
    }

    return { success: true };
}

export async function getChats(roomId: string) {
    const { data, error } = await supabase
        .from('Chat')
        .select('*')
        .eq('roomId', roomId)
        .order('createdAt', { ascending: true });

    if (error) {
        return { success: false, error };
    }

    return { success: true, chats: data };
}
