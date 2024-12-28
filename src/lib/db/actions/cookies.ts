'use server';

import { cookies } from 'next/headers';

export async function setCharacterId(cid: string) {
    const cookieStore = await cookies();
    cookieStore.set('_character', cid);
}

export async function getCharacterId() {
    const cookieStore = await cookies();
    return cookieStore.get('_character')?.value;
}

export async function removeCharacterId() {
    const cookieStore = await cookies();
    cookieStore.delete('_character');
}

export async function setSub(sub: string) {
    const cookieStore = await cookies();
    cookieStore.set('_sub', sub);
}

export async function getSub() {
    const cookieStore = await cookies();
    return cookieStore.get('_sub')?.value;
}

export async function removeSub() {
    const cookieStore = await cookies();
    cookieStore.delete('_sub');
}
