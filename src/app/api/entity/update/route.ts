import { updateEntity } from '@/lib/db/actions/entity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { formData } = await req.json();

        const result = await updateEntity(formData.id, formData);

        if (result.success) {
            return NextResponse.json({ message: 'Entity updated successfully!', entity: result.data });
        } else {
            return NextResponse.json({ message: 'Entity update failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error updating entity:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
