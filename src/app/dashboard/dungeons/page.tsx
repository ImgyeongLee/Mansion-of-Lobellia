import prisma from '@/lib/db/prisma';

export default async function DungeonPage() {
    const dungeons = await prisma.dungeon.findMany();

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">Dungeons</div>
                </div>
                <div className="grid grid-cols-3 items-center h-full -mt-10 mb-6">
                    {dungeons.length === 0 && <div className="col-span-3 text-center -mt-6">No dungeons found</div>}
                    {dungeons.length > 0 && dungeons.map((dungeon) => <div key={dungeon.id}>{dungeon.name}</div>)}
                </div>
            </div>
        </section>
    );
}
