'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Character } from '@/static/types/character';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Skull } from 'lucide-react';
import { BattleRoom, Chat } from '@/static/types/battle';
import { Entity } from '@/static/types/monster';
import { ubuntu } from '@/static/fonts';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/db/supabase/client';
import { getChats } from '@/lib/db/actions/chat';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function BattleSection({
  activeCharacter,
}: {
  activeCharacter: Character;
}) {
  const { toast } = useToast();
  // Move the character and calculate the skill's range
  const { battleId } = useParams<{ battleId: string }>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [targetPosition, setTargetPosition] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const GRID_SIZE = 10;

  const { data: roomData, isLoading } = useQuery({
    queryKey: [battleId],
    queryFn: async () => {
      const response = await fetch(`/api/battle/info?battleId=${battleId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch battle info');
      }

      const roomData = data.data as BattleRoom;

      setCharacters(roomData.participants);
      setEntities(roomData.entities);
      return roomData;
    },
  });

  // real-time subscriptions
  useEffect(() => {
    if (!battleId) return;

    // character subscription
    const characterChannel = supabase
      .channel('public:character')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Character',
          filter: `roomId=eq.${battleId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setCharacters((prev) =>
              prev.map((char) =>
                char.id === payload.new.id ? { ...char, ...payload.new } : char
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setCharacters((prev) => [...prev, payload.new as Character]);
          } else if (payload.eventType === 'DELETE') {
            setCharacters((prev) =>
              prev.filter((char) => char.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // entity subscription
    const entityChannel = supabase
      .channel('public:entity')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Entity',
          filter: `roomId=eq.${battleId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setEntities((prev) =>
              prev.map((entity) =>
                entity.id === payload.new.id
                  ? { ...entity, ...payload.new }
                  : entity
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setEntities((prev) => [...prev, payload.new as Entity]);
          } else if (payload.eventType === 'DELETE') {
            setEntities((prev) =>
              prev.filter((entity) => entity.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(characterChannel).catch(console.error);
      supabase.removeChannel(entityChannel).catch(console.error);
    };
  }, [battleId]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // if the user's character has not made a move yet
    if (!activeCharacter.hasMoved) {
      setTargetPosition({ rowIndex, colIndex });
      setShowDialog(true);
    }
    // if click is on the player's character
    console.log([rowIndex, colIndex]);
    const isActiveCharacter =
      activeCharacter.colPos === colIndex &&
      activeCharacter.rowPos === rowIndex;
    if (!isActiveCharacter) return;

    console.log('im free');
  };

  const movePlayer = async () => {
    try {
      // Update character position in database
      const response = await fetch(`/api/battle/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: activeCharacter.id,
          rowIndex: targetPosition?.rowIndex,
          colIndex: targetPosition?.colIndex,
        }),
      });

      if (!response.ok) {
        toast({
          title: 'Failed to move character',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error moving character:', error);
      toast({
        title: 'Failed to move character',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setTargetPosition(null);
      setShowDialog(false);
    }
  };

  // console.log
  // useEffect(() => {
  //   if (roomData) {
  //     console.log(roomData);
  //   }
  // }, [roomData]);

  return (
    <>
      <div className="w-full text-xl text-center p-10 select-none">Round</div>
      <section className="w-full h-full overflow-y-auto overflow-x-auto p-10">
        <div className="flex flex-col items-center justify-center min-h-full gap-1">
          {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-1">
              {Array.from({ length: GRID_SIZE }).map((_, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isActiveCharacter =
                  activeCharacter.colPos === colIndex &&
                  activeCharacter.rowPos === rowIndex;

                return (
                  <TooltipProvider key={cellKey}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className="bg-[#5C595D] w-[50px] h-[50px] rounded-none hover:bg-yellow-500"
                          style={{
                            transition: 'background-color 0.3s ease-in-out',
                          }}
                        >
                          {entities && (
                            <div className={'flex flex-col'}>
                              {entities.map((enemy) => {
                                if (
                                  enemy.colPos === colIndex &&
                                  enemy.rowPos === rowIndex &&
                                  !enemy.isDead
                                ) {
                                  return (
                                    <Image
                                      key={enemy.id}
                                      src={
                                        enemy?.image ||
                                        '/placeholderAvatar.webp'
                                      }
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
                                (activeCharacter && isActiveCharacter
                                  ? ' mb-1'
                                  : '')
                              }
                            >
                              {activeCharacter &&
                                isActiveCharacter &&
                                !activeCharacter.isDead && (
                                  <ChevronDown
                                    className={
                                      '-mb-3 animate-bounce self-center stroke-black'
                                    }
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
                                              src={
                                                character.image ||
                                                '/placeholderAvatar.webp'
                                              }
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
                          {((activeCharacter || entities) &&
                            entities &&
                            entities.find(
                              (entity) =>
                                entity.rowPos === rowIndex &&
                                entity.colPos === colIndex &&
                                !entity.isDead
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
      <UserMenuBar
        characters={characters}
        entities={entities}
        isLoading={isLoading}
      />
      {showDialog && (
        <Dialog
          title={'Set your character position here?'}
          description={'This action cannot be undone.'}
          onCancel={() => setShowDialog(false)}
          onContinue={movePlayer}
        />
      )}
    </>
  );
}

export function InfoSidebar() {
  return (
    <nav className="bg-bright-red flex flex-col text-xl py-8">
      <div className="flex flex-col">
        <div>User Info section</div>
        <div>Monster Info section</div>
      </div>
      <div className="flex flex-col mt-6">
        <div
          className="hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer"
          onClick={() => {
            console.log('??');
          }}
        >
          Leave
        </div>
      </div>
    </nav>
  );
}

export function ChatSidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { roomId } = useParams<{ roomId: string }>();

  const fetchChats = async () => {
    try {
      const result = await getChats(roomId);
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
    // fetch chats
    fetchChats().catch(console.error);

    // subscribe to chats
    const channel = supabase
      .channel('public:chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Chat' },
        (payload) => {
          const newChat = payload.new as Chat;
          if (newChat.roomId === roomId) {
            setChats((prevChats) => [newChat, ...prevChats]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, [roomId, fetchChats]);

  return (
    <div className="bg-[#101010] relative h-full">
      <div className="overflow-y-auto h-[calc(100vh-116px)] py-4 flex flex-col gap-1"></div>
      <div className="bg-bright-red absolute bottom-0 w-full p-3">
        <Textarea className="bg-middle-red border-middle-red resize-none h-[100px]" />
      </div>
    </div>
  );
}

export function UserMenuBar({
  characters,
  entities,
  isLoading,
}: {
  characters: Character[];
  entities: Entity[];
  isLoading: boolean;
}) {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div className="w-full px-12 h-full content-center">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full bg-middle-red h-16 rounded-md grid grid-cols-[1fr_2fr] self-center">
          <div className="w-full bg-slate-500">
            {characters.map((char) => (
              <div key={char.id}>{char.name}</div>
            ))}
          </div>
          <div className="w-full bg-lime-950">
            {entities.map((entity) => (
              <div key={entity.id}>{entity.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Dialog({
  title,
  description,
  onCancel,
  onContinue,
}: {
  title: string;
  description: string;
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
