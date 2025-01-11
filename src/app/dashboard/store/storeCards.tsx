'use client';

import { ItemCard } from '@/app/_components/cards';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { getCharacterInventory } from '@/lib/db/actions/inventory';
import { ubuntu } from '@/static/fonts';
import { Item } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { appearsFromLeftFadeIn, appearsFromRightFadeIn } from '@/lib/motionVariants';

interface StoreItemCardProps {
    item: Item;
    characterId: string;
}

export function StoreItemCard({ item, characterId }: StoreItemCardProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [message, setMessage] = useState<string>('');

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
                console.log('!!!');
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <ItemCard item={item}>
            <div className="flex flex-col justify-center items-center">
                <div className={`${ubuntu.className} text-lg mt-4`}>{item.buyPrice}G</div>
                <div className="flex flex-row gap-3 mt-5 justify-center items-center">
                    <Button
                        className="bg-main-black text-white py-2 px-4 rounded-md text-sm"
                        onClick={handlePurchase}
                        disabled={isLoading}>
                        {isLoading ? 'Purchasing...' : 'Purchase'}
                    </Button>
                    <DialogClose className="bg-main-black text-white py-2 px-4 rounded-md text-sm">Cancel</DialogClose>
                </div>
            </div>
        </ItemCard>
    );
}

export function StoreUserItemCard({ item, characterId }: StoreItemCardProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [message, setMessage] = useState<string>('');

    const handleSell = async () => {
        try {
            setIsLoading(true);
            const result = await fetch('/api/item/sell', {
                method: 'POST',
                body: JSON.stringify({
                    itemId: item.id,
                    characterId: characterId,
                    amount: 1,
                    price: item.sellPrice,
                }),
            });
            if (result.ok) {
                console.log('!!!');
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <ItemCard item={item}>
            <div className="flex flex-col justify-center items-center">
                <div className={`${ubuntu.className} text-lg mt-4`}>{item.sellPrice}G</div>
                <div className="flex flex-row gap-3 mt-5 justify-center items-center">
                    <Button
                        className="bg-main-black text-white py-2 px-4 rounded-md text-sm"
                        onClick={handleSell}
                        disabled={isLoading}>
                        {isLoading ? 'Selling...' : 'Sell'}
                    </Button>
                    <DialogClose className="bg-main-black text-white py-2 px-4 rounded-md text-sm">Cancel</DialogClose>
                </div>
            </div>
        </ItemCard>
    );
}

export function CharacterInventory({ characterId }: { characterId: string }) {
    const [items, setItems] = useState<{ item: Item; amount: number }[]>([]);

    const { data: fetchedItems } = useQuery({
        queryKey: [characterId],
        queryFn: async () => {
            const data = await getCharacterInventory(characterId);
            return data;
        },
    });

    useEffect(() => {
        if (fetchedItems && fetchedItems.data) {
            console.log(fetchedItems.data);
            setItems(fetchedItems.data);
        }
    }, [fetchedItems]);

    return (
        <motion.div
            variants={appearsFromLeftFadeIn}
            initial="initial"
            animate="animate"
            className="bg-wine-red p-5 h-full rounded-md">
            <div className="bg-middle-red p-2 h-full">
                <div className="flex flex-row gap-2">
                    {items &&
                        items.length > 0 &&
                        items.map((item) => (
                            <StoreUserItemCard
                                key={item.item.id}
                                item={item.item}
                                characterId={characterId || ''}></StoreUserItemCard>
                        ))}
                </div>
            </div>
        </motion.div>
    );
}

export function StoreSection({ storeItems, characterId }: { storeItems: Item[]; characterId: string }) {
    return (
        <div className="grid grid-rows-2 gap-2 items-center h-full -mt-10 mb-6">
            <motion.div
                variants={appearsFromRightFadeIn}
                initial="initial"
                animate="animate"
                className="h-full grid grid-cols-[1fr_1.5fr]">
                <div className="bg-bright-red h-full p-5">
                    <div className="bg-middle-red h-full p-3">
                        <div className="flex flex-row gap-2">
                            {storeItems.length > 0 &&
                                storeItems.map((item) => (
                                    <StoreItemCard
                                        key={item.id}
                                        item={item}
                                        characterId={characterId || ''}></StoreItemCard>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="bg-amber-800 h-full"></div>
            </motion.div>
            <CharacterInventory characterId={characterId as string} />
        </div>
    );
}
