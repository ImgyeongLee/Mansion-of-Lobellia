'use client';

import { ItemCard } from '@/app/_components/cards';
import { Button } from '@/components/ui/button';
import { Item } from '@prisma/client';
import { useState } from 'react';

interface StoreItemCardProps {
    item: Item;
    characterId: string;
}

export function StoreItemCard({ item, characterId }: StoreItemCardProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handlePurchase = async () => {
        try {
            setIsLoading(true);
            const result = await fetch('/api/item/purchase', {
                method: 'POST',
                body: JSON.stringify({
                    itemId: item.id,
                    characterId: characterId,
                    amount: 1,
                    price: item.buyPrice,
                }),
            });
            if (result.ok) {
                console.log('HEY!!!!');
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <ItemCard item={item}>
            <div className="flex flex-row gap-3">
                <Button
                    className="bg-bright-red text-white p-2 rounded-md"
                    onClick={handlePurchase}
                    disabled={isLoading}>
                    {isLoading ? 'Purchasing...' : 'Purchase'}
                </Button>
            </div>
        </ItemCard>
    );
}
