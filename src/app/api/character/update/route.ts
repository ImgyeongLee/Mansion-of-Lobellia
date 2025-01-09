import { updateCharacter } from '@/lib/db/actions/characters';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { formData } = await req.json();

        const result = await updateCharacter(formData);

        if (result.success) {
            return NextResponse.json({ message: 'Character updated successfully!', character: result.character });
        } else {
            return NextResponse.json({ message: 'Character update failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error updating character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
