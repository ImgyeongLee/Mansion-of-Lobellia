'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Character, CharacterSkill } from '@/static/types/character';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Skull } from 'lucide-react';
import { BattleRoom, Chat, ChatBody } from '@/static/types/battle';
import { Entity } from '@/static/types/monster';
import { ubuntu } from '@/static/fonts';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/db/supabase/client';
import { createChat, getChats } from '@/lib/db/actions/chat';
import { getCharactersByRoomId } from '@/lib/db/actions/characters';
import { getEntitiesByRoomId } from '@/lib/db/actions/entity';
import { Item } from '@/static/types/item';
import { ItemCard, SkillCard } from '@/app/_components/cards';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionChat, BuffChat, DebuffChat, MyChat, OpponentChat, ResultChat, SystemChat } from './chats';

export function BattleSection({ activeCharacter }: { activeCharacter: Character }) {
    // Move the character and calculate the skill's range
    const { battleId } = useParams<{ battleId: string }>();
    const [roomData, setRoomData] = useState<BattleRoom>();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [enemies, setEnemies] = useState<Entity[]>([]);
    const [gridSize, setGridSize] = useState<number>(10);

    useEffect(() => {
        // Get BattleRoom Info
    }, []);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        // Handle cell click logic here
    };

    return (
        <>
            <div className="w-full text-xl text-center p-10 select-none">Round</div>
            <section className="w-full h-full overflow-y-auto overflow-x-auto p-10">
                <div className="flex flex-col items-center justify-center min-h-full gap-1">
                    {Array.from({ length: gridSize }).map((_, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex gap-1">
                            {Array.from({ length: gridSize }).map((_, colIndex) => {
                                const cellKey = `${rowIndex}-${colIndex}`;
                                const isActiveCharacter =
                                    activeCharacter.colPos === colIndex && activeCharacter.rowPos === rowIndex;

                                return (
                                    <TooltipProvider key={cellKey}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                                    className="bg-[#5C595D] w-[50px] h-[50px] rounded-none hover:bg-yellow-500"
                                                    style={{ transition: 'background-color 0.3s ease-in-out' }}>
                                                    {enemies && (
                                                        <div className={'flex flex-col'}>
                                                            {enemies.map((enemy) => {
                                                                if (
                                                                    enemy.colPos === colIndex &&
                                                                    enemy.rowPos === rowIndex &&
                                                                    !enemy.isDead
                                                                ) {
                                                                    return (
                                                                        <Image
                                                                            key={enemy.id}
                                                                            src={`somewhere`}
                                                                            alt="icon"
                                                                            width={100}
                                                                            height={100}
                                                                        />
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    )}
                                                    {roomData && (
                                                        <div
                                                            className={
                                                                'flex flex-col ' +
                                                                (activeCharacter && isActiveCharacter ? ' mb-1' : '')
                                                            }>
                                                            {activeCharacter &&
                                                                isActiveCharacter &&
                                                                !activeCharacter.isDead && (
                                                                    <ChevronDown
                                                                        className={'-mb-3 animate-bounce self-center'}
                                                                    />
                                                                )}
                                                            {characters.map((character) => {
                                                                if (
                                                                    character.colPos === colIndex &&
                                                                    character.rowPos === rowIndex &&
                                                                    !character.isDead
                                                                ) {
                                                                    return (
                                                                        <TooltipProvider key={character.id}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    {character.isDead ? (
                                                                                        <Skull className="text-litania-red" />
                                                                                    ) : (
                                                                                        <Image
                                                                                            src={`/icon/${character.image}`}
                                                                                            alt="icon"
                                                                                            width={100}
                                                                                            height={100}
                                                                                        />
                                                                                    )}
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <span>{character.name}</span>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-black bg-opacity-80">
                                                <span className={`${ubuntu.className} text-main-white`}>
                                                    {((activeCharacter || enemies) &&
                                                        enemies &&
                                                        enemies.find(
                                                            (enemy) =>
                                                                enemy.rowPos === rowIndex &&
                                                                enemy.colPos === colIndex &&
                                                                !enemy.isDead
                                                        )?.name) ||
                                                        '[ ' + rowIndex + ',' + colIndex + ' ]'}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
            <UserMenuBar character={activeCharacter} />
        </>
    );
}

export function InfoSidebar() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { battleId } = useParams<{ battleId: string }>();

    useEffect(() => {
        if (!battleId) return;

        const fetchInitialData = async () => {
            console.log('FETCH INITIAL DATA WITH ROOMCODE: ', battleId);
            setLoading(true);

            try {
                const charactersResult = await getCharactersByRoomId(battleId);
                const entitiesResult = await getEntitiesByRoomId(battleId);

                if (charactersResult.success && charactersResult.characters) setCharacters(charactersResult.characters);
                if (entitiesResult.success && entitiesResult.entities) setEntities(entitiesResult.entities);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
            setLoading(false);
        };

        fetchInitialData();

        const characterSubscription = supabase
            .channel('public:character')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Character',
                },
                (payload) => {
                    console.log('Realtime Character payload:', payload);

                    if (payload.eventType === 'INSERT') {
                        setCharacters((prev) => [...prev, payload.new as Character]);
                    } else if (payload.eventType === 'UPDATE') {
                        setCharacters((prev) =>
                            prev.map((char) => (char.id === payload.new.id ? (payload.new as Character) : char))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setCharacters((prev) => prev.filter((char) => char.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        const entitySubscription = supabase
            .channel('public:entity')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Entity',
                },
                (payload) => {
                    console.log('Realtime Entity payload:', payload);

                    if (payload.eventType === 'INSERT') {
                        setEntities((prev) => [...prev, payload.new as Entity]);
                    } else if (payload.eventType === 'UPDATE') {
                        setEntities((prev) =>
                            prev.map((entity) => (entity.id === payload.new.id ? (payload.new as Entity) : entity))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setEntities((prev) => prev.filter((entity) => entity.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(characterSubscription);
            supabase.removeChannel(entitySubscription);
        };
    }, [battleId]);

    return (
        <nav className="bg-[#101010] flex flex-col text-xl py-8 relative select-none">
            <div className="flex flex-col">
                <div className="text-2xl text-center mb-3">Info</div>
                <Image
                    src={'/simple-decorative-line.svg'}
                    alt="decorative-line"
                    width={150}
                    height={10}
                    className="-mt-16 -mb-24 self-center pl-1"
                />
                <div className="w-full p-3 space-y-1">
                    {characters.map((character) => (
                        <div key={character.id} className="w-full flex flex-col bg-main-black p-3 rounded-sm">
                            <div>{character.name}</div>
                            <div className="flex flex-row justify-between items-center w-full">
                                <div className="text-sm">Hp</div>
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
                                <div className="text-sm">Cost</div>
                                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                    <div
                                        className="bg-[#d4972e] h-full"
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
                        </div>
                    ))}
                </div>
                <Image
                    src={'/simple-decorative-line.svg'}
                    alt="decorative-line"
                    width={150}
                    height={10}
                    className="-mt-14 -mb-24 self-center pl-1"
                />
                <div className="w-full p-3 space-y-1">
                    {entities.map((entity) => (
                        <div key={entity.id} className="w-full flex flex-col bg-main-black p-3 rounded-sm">
                            <div>{entity.name}</div>
                            <div className="flex flex-row justify-between items-center w-full">
                                <div className="text-sm">Hp</div>
                                <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                    <div
                                        className="bg-bright-red h-full"
                                        style={{
                                            width: `${(entity.currentHp / entity.maxHp) * 100}%`,
                                        }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                                        <span className={`${ubuntu.className}`}>
                                            {entity.currentHp} / {entity.maxHp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="hover:bg-middle-red px-6 py-3 transition ease-in-out hover:cursor-pointer absolute bottom-0 w-full"
                onClick={() => {
                    console.log('??');
                }}>
                Leave
            </div>
        </nav>
    );
}

export function ChatSidebar({ character }: { character: Character }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [text, setText] = useState<string>('');
    const { battleId } = useParams<{ battleId: string }>();

    const fetchChats = async () => {
        try {
            const result = await getChats(battleId);
            if (result.success && result.chats) {
                setChats(result.chats);
            } else {
                throw new Error('Failed to fetch chats from getChats function');
            }
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
        const channel = supabase
            .channel('public:chat')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat' }, (payload) => {
                const newChat = payload.new as Chat;
                if (newChat.roomId === battleId) {
                    setChats((prevChats) => [...prevChats, newChat]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [battleId]);

    const handleSendChat = async () => {
        if (text.trim() !== '') {
            const newChat: ChatBody = {
                roomId: battleId,
                sender: character.name,
                body: text,
                image: character.image ? character.image : null,
                chatType: 'Chat',
            };
            try {
                await createChat(newChat);
                setText('');
            } catch (error) {
                console.error('Failed to send chat:', error);
            }
        }
    };

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <div className="bg-[#101010] relative h-full">
            <div className="overflow-y-auto h-[calc(100vh-116px)] py-4 flex flex-col gap-1" ref={chatContainerRef}>
                {chats.map((chat) => {
                    if (chat.sender === character.name) {
                        return <MyChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Chat') {
                        return <OpponentChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Result') {
                        return <ResultChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Action') {
                        return <ActionChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'System') {
                        return <SystemChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Buff') {
                        return <BuffChat key={chat.id} chat={chat} />;
                    } else if (chat.chatType === 'Debuff') {
                        return <DebuffChat key={chat.id} chat={chat} />;
                    }
                })}
            </div>
            <div className="absolute bottom-0 w-full p-3">
                <textarea
                    value={text}
                    className="bg-middle-red border-middle-red resize-none h-[100px] w-full rounded-md p-3 focus:outline-none"
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                        }
                    }}
                />
            </div>
        </div>
    );
}

export function UserMenuBar({ character }: { character: Character }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<CharacterSkill[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [currentCharacter, setCurrentCharacter] = useState<Character>(character);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);

            try {
                const itemResult = await fetch(`/api/character/${character.id}/items`);
                const skillResult = await fetch(`/api/character/${character.id}/skills`);

                if (itemResult.ok) {
                    const characterItems = await itemResult.json();
                    if (characterItems.data) setItems(characterItems.data);
                }

                if (skillResult.ok) {
                    const characterSkills = await skillResult.json();
                    if (characterSkills.data) setSkills(characterSkills.data);
                }
            } catch (error) {
                console.error('Failed to fetch initial data for UserMenuBar:', error);
            }
            setIsLoading(false);
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!character.id) return;

        const characterSubscription = supabase
            .channel('public:character')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Character',
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        setCurrentCharacter((prev) => (prev.id === payload.new.id ? (payload.new as Character) : prev));
                    }
                }
            )
            .subscribe();

        const inventorySubscription = supabase
            .channel('public:characterInventory')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'CharacterInventory',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setItems((prev) => [...prev, payload.new as Item]);
                    } else if (payload.eventType === 'UPDATE') {
                        setItems((prev) =>
                            prev.map((item) => (item.id === payload.new.id ? (payload.new as Item) : item))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(characterSubscription);
            supabase.removeChannel(inventorySubscription);
        };
    }, [character.id]);

    return (
        <div className="w-full px-12 h-full content-center">
            {isLoading ? (
                <Skeleton className="w-full bg-slate-600 h-16" />
            ) : (
                <div className="w-full bg-[#101010] h-16 rounded-md grid grid-cols-[1fr_2fr] self-center">
                    <div key={character.id} className="w-full flex flex-col p-3 rounded-sm">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="text-sm">Hp</div>
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
                            <div className="text-sm">Cost</div>
                            <div className="w-[80%] bg-main-black border border-main-black h-5 relative">
                                <div
                                    className="bg-[#d4972e] h-full"
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
                    </div>
                    <div className="w-full bg-bright-red flex flex-row items-center gap-1 px-2">
                        {skills.map((skill) => {
                            return <SkillCard key={skill.id} skill={skill} />;
                        })}
                        {items.map((item) => {
                            return <ItemCard key={item.id} item={item} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
