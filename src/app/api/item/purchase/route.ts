import { addItemToInventory, decreaseMoney } from '@/lib/db/actions/inventory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { characterId, itemId, price, amount } = await req.json();

        const inventoryResult = await addItemToInventory(characterId, itemId, amount);

        if (inventoryResult.success) {
            const moneyResult = await decreaseMoney(characterId, price * amount);
            if (moneyResult.success) {
                return NextResponse.json({ message: 'Item purchased successfully!' });
            } else {
                return NextResponse.json({ message: 'Item purchase failed.' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: 'Adding item to inventory failed.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
