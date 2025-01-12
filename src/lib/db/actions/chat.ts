import { ChatBody } from '@/static/types/battle';
import { supabase } from '../supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function createChat(chat: ChatBody) {
    const { error } = await supabase.from('Chat').insert({ ...chat, id: uuidv4() });

    if (error) {
        console.log(error);
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
