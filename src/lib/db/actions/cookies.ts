'use server';

import { cookies } from 'next/headers';

export async function storeUID(uid: string) {
    const cookieStore = await cookies();
    cookieStore.set('UID', uid);
}

export async function getUID() {
    const cookieStore = await cookies();
    return cookieStore.get('UID')?.value;
}

export async function removeUID() {
    const cookieStore = await cookies();
    cookieStore.delete('UID');
}
