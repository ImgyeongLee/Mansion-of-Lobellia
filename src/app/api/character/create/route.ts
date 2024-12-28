import { createCharacter } from '@/lib/db/actions/characters';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { formData, userSkills } = await req.json();

        const result = await createCharacter(formData, userSkills);

        if (result.success) {
            return NextResponse.json({ message: 'Character created successfully!', character: result.character });
        } else {
            return NextResponse.json({ message: 'Character creation failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
