import { createCharacter } from '@/lib/db/actions/characters';
import { setCharacterId } from '@/lib/db/actions/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { formData, userSkills } = await req.json();

        const result = await createCharacter(formData, userSkills);

        if (result.success) {
            if (result.character) await setCharacterId(result.character.id);
            return NextResponse.json({ message: 'Character created successfully!', character: result.character });
        } else {
            return NextResponse.json({ message: 'Character creation failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
