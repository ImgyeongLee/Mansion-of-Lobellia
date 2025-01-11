'use client';

import { Button } from '@/components/ui/button';
import { ubuntu } from '@/static/fonts';
import { Character } from '@/static/types/character';
import { useRouter } from 'next/navigation';
import { CharacterInventory, CharacterLobbyCard, CharacterSkillList } from './cards';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CharacterUpdateForm } from './forms';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { appearsFromBottomFadeIn } from '@/lib/motionVariants';
import { BattleRoom } from '@/static/types/battle';
import { Search, Swords } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { getBattleRoomByCode } from '@/lib/db/actions/battle';
import { leaveBattleRoom } from '@/lib/db/actions/characters';

interface CharacterDetailSectionProps {
    character: Character;
}

export function CharacterDetailSection({ character }: CharacterDetailSectionProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    async function handleDelete() {
        const result = await fetch(`/api/character/delete/${character.id}`, {
            method: 'DELETE',
        });
        if (result.ok) {
            router.refresh();
        }
    }

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">{character.name}</div>
                    <div className="flex flex-row gap-2">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-bright-red">Delete</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-bright-red border-none sm:rounded-none text-center">
                                Are you sure? You cannot restore this action.
                                <DialogFooter className="grid grid-cols-2 px-6 gap-3">
                                    <div
                                        className="shadow-none drop-shadow-none rounded-none bg-wine-red text-main-white select-none hover:cursor-pointer hover:bg-main-white hover:text-main-black transition ease-in-out p-1"
                                        onClick={handleDelete}>
                                        Delete
                                    </div>
                                    <div
                                        className="shadow-none drop-shadow-none rounded-none text-main-white select-none hover:cursor-pointer p-1 bg-main-black hover:bg-black transition ease-in-out"
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}>
                                        Cancel
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <motion.div
                    className="grid grid-cols-[1fr_2fr] items-center h-full -mt-6 mb-10"
                    variants={appearsFromBottomFadeIn}
                    initial="initial"
                    animate="animate">
                    <div
                        key={character.id}
                        className="bg-bright-red h-full"
                        style={{
                            backgroundImage: character.image ? `url(${character.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="h-full flex flex-col bg-wine-red p-9">
                        <div className="flex flex-col rounded-sm py-2 gap-1">
                            <div className="text-xl">Status</div>
                            <div>{character.class} Class</div>
                            <div className="flex flex-row justify-between items-center w-full">
                                <div>Hp</div>
                                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                    <div
                                        className="bg-bright-red h-full"
                                        style={{
                                            width: `${(character.currentHp / character.maxHp) * 100}%`,
                                        }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                                        <span className={`${ubuntu.className}`}>
                                            {character.currentHp} / {character.maxHp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center w-full">
                                <div>Cost</div>
                                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                    <div
                                        className="bg-bright-red h-full"
                                        style={{
                                            width: `${(character.currentCost / character.maxCost) * 100}%`,
                                        }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                                        <span className={`${ubuntu.className}`}>
                                            {character.currentCost} / {character.maxCost}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="my-2 text-center">✦</div>
                            <div className="flex flex-row gap-2 justify-center">
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>ATK</div>
                                    <div className={`${ubuntu.className} text-3xl`}>{character.attack}</div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>DEF</div>
                                    <div className={`${ubuntu.className} text-3xl`}>{character.defense}</div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>DODGE</div>
                                    <div className={`${ubuntu.className} text-3xl`}>
                                        {character.dodge}
                                        <span className="text-xl">%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>CRIT</div>
                                    <div className={`${ubuntu.className} text-3xl`}>
                                        {character.crit}
                                        <span className="text-xl">%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-middle-red p-3 items-center justify-center text-center rounded-sm">
                                    <div className={`${ubuntu.className} text-xs`}>SPD</div>
                                    <div className={`${ubuntu.className} text-3xl`}>{character.speed}</div>
                                </div>
                            </div>
                            <div className="my-2 text-center">✦ ✦</div>
                            <CharacterSkillList characterId={character.id} />
                            <div className="text-xl mt-2 mb-1">
                                Inventory{' '}
                                <span className={`${ubuntu.className} text-sm`}>
                                    &#40;Gold: {character.money}G&#41;
                                </span>
                            </div>
                            <CharacterInventory characterId={character.id} />
                            <div className="my-2 text-center">✦ ✦ ✦</div>
                            <div className="text-xl mt-2">Background Story</div>
                            {character.description && (
                                <div className="px-3 py-2 text-sm bg-middle-red overflow-y-auto h-[120px]">
                                    {character.description}
                                </div>
                            )}
                            {!character.description && <div>No Description</div>}
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Edit the profile</Button>
                            </DialogTrigger>
                            <DialogContent className="w-1/2 bg-bright-red border-none sm:rounded-none select-none max-w-[800px] min-w-[400px]">
                                <CharacterUpdateForm character={character} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export function NonLobbySection({ character }: { character: Character }) {
    const [error, setError] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleClick = () => {
        router.push('/dashboard/dungeons');
    };

    const handleJoin = async () => {
        setIsLoading(true);
        setError('');

        if (!code) {
            setError('Code is required');
            setIsLoading(false);
            return;
        }
        try {
            const result = await getBattleRoomByCode(code);
            if (result.success && result.data) {
                const updateResponse = await fetch('/api/character/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formData: {
                            ...character,
                            roomId: result.data.id,
                        },
                    }),
                });

                if (updateResponse.ok) {
                    setIsLoading(false);
                    router.refresh();
                }
            }
        } catch (error) {
            console.error('Failed to join the room: ', error);
            setError('Failed to join the room');
        }
        setIsLoading(false);
    };

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full w-full">
                <div className="w-full mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl w-full">
                        <h3>Party Lobby</h3>
                    </div>
                    <div className="flex flex-row h-full w-full mt-20 mb-6 gap-5 justify-center">
                        <div className="bg-bright-red w-[300px] min-h-[400px] flex flex-col items-center justify-center p-4">
                            <Swords width={128} height={128} />
                            <div className="text-2xl">Create your party</div>
                            <Image
                                src={'/simple-decorative-line.svg'}
                                alt="decorative-line"
                                width={150}
                                height={10}
                                className="-mt-14 -mb-16 self-center pl-1"
                            />
                            <Button
                                onClick={handleClick}
                                className="drop-shadow-none bg-main-white text-main-black rounded-none hover:bg-main-black hover:text-main-white">
                                Go to Dungeon Page
                            </Button>
                        </div>
                        <div className="bg-wine-red w-[300px] min-h-[400px] flex flex-col items-center justify-center p-4">
                            <Search width={128} height={128} />
                            <div className="text-2xl">Join the party</div>
                            <Image
                                src={'/simple-decorative-line.svg'}
                                alt="decorative-line"
                                width={150}
                                height={10}
                                className="-mt-14 -mb-16 self-center pl-1"
                            />
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="drop-shadow-none bg-main-white text-main-black rounded-none hover:bg-main-black hover:text-main-white">
                                        Enter the code
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-bright-red border-none sm:rounded-none select-none">
                                    <DialogHeader>
                                        <DialogTitle className="text-3xl">Join Party</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col">
                                        <Input
                                            className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent mb-3"
                                            placeholder="Enter the code"
                                            onChange={(e) => {
                                                setCode(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="text-center text-xs -mb-2">{error}</div>
                                    <Button
                                        onClick={handleJoin}
                                        disabled={isLoading}
                                        className="shadow-none justify-self-center bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                                        {isLoading ? 'Loading' : 'Join'}
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function LobbySection({ character, battleInfo }: { character: Character; battleInfo: BattleRoom }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleQuit = async () => {
        setIsLoading(true);
        try {
            const res = await leaveBattleRoom(character.id, battleInfo.id);
            if (res.success) {
                setIsOpen(false);
                setIsLoading(false);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    const handleJoin = () => {
        router.push(`/battle/${battleInfo.id}`);
    };

    return (
        <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
            <div className="col-start-2 flex flex-col h-full">
                <div className="flex flex-row mt-16 mb-14 justify-between items-center">
                    <div className="text-4xl">Party Lobby</div>
                    <div className="flex flex-row gap-2">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-bright-red">Quit</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-bright-red border-none sm:rounded-none text-center">
                                Are you sure to leave this party?
                                <DialogFooter className="grid grid-cols-2 px-6 gap-3">
                                    <Button
                                        className="shadow-none drop-shadow-none rounded-none bg-wine-red text-main-white select-none hover:cursor-pointer hover:bg-main-white hover:text-main-black transition ease-in-out p-1"
                                        onClick={handleQuit}
                                        disabled={isLoading}>
                                        Leave
                                    </Button>
                                    <Button
                                        className="shadow-none drop-shadow-none rounded-none text-main-white select-none hover:cursor-pointer p-1 bg-main-black hover:bg-black transition ease-in-out"
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                        disabled={isLoading}>
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                {battleInfo && (
                    <div className={'w-full'}>
                        <div className={''}>
                            <div className={'w-full flex gap-4 items-center'}>
                                {battleInfo.participants.map((character: Character) => {
                                    return <CharacterLobbyCard key={character.id} character={character} />;
                                })}
                            </div>
                        </div>
                        <div className={'w-full'}>
                            <div className="text-2xl -mt-4 mb-1">Party Info</div>
                            <div className="min-w-[80%] min-h-[80px] bg-black text-sm p-3">
                                <div className="text-2xl">{battleInfo.roomName}</div>
                                <h6>{battleInfo.description}</h6>
                                <h6>Dungeon Type: {battleInfo.dungeonType}</h6>
                                <h6 className="select-text">Invitation Code: {battleInfo.invitationCode}</h6>
                            </div>
                        </div>
                        <Button
                            className="bg-bright-red w-full p-1 text-xl rounded-none drop-shadow-none hover:bg-main-white hover:text-main-black"
                            onClick={handleJoin}>
                            Enter
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
