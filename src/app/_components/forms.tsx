'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { useEffect, useState } from 'react';

import { CLASS, CLASS_DESCRIPTION } from '@/static/data';
import { DiamondMinus, DiamondPlus } from 'lucide-react';
import { BsDiamond, BsDiamondFill } from 'react-icons/bs';
import { battleRoomFormSchema, characterFormSchema } from '@/static/formSchema';
import { CharacterClass, CharacterSkill } from '@/static/types/character';
import { getSkillByClass } from '@/lib/db/actions/skills';
import { useQuery } from '@tanstack/react-query';
import { SkillCard } from './cards';
import { calculateStatsByClass, generateUniqueRoomCode } from '@/lib/utils';
import { ubuntu } from '@/static/fonts';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Dungeon } from '@/static/types/dungeon';

export function CharacterCreationForm({ sub }: { sub: string }) {
    const [error, setError] = useState<string | undefined>('');
    const [characterClass, setCharacterClass] = useState<CharacterClass>('Gladiolus');
    const [skills, setSkills] = useState<CharacterSkill[]>([]);
    const [userSkills, setUserSkills] = useState<string[]>([]);
    const [pending, setPending] = useState<boolean>(false);
    const [characterAttack, setCharacterAttack] = useState<number>(1);
    const [characterDefense, setCharacterDefense] = useState<number>(1);
    const [characterMaxHp, setCharacterMaxHp] = useState<number>(1);
    const [characterSpeed, setCharacterSpeed] = useState<number>(1);
    const [currentPoint, setCurrentPoint] = useState<number>(10);
    const router = useRouter();
    const TOTAL_POINT = 10;

    const { data: fetchedSkills } = useQuery({
        queryKey: [characterClass],
        queryFn: async () => {
            const data = await getSkillByClass(characterClass);
            return data;
        },
    });

    useEffect(() => {
        if (fetchedSkills) {
            setSkills(fetchedSkills);
        }
    }, [fetchedSkills]);

    const form = useForm<z.infer<typeof characterFormSchema>>({
        resolver: zodResolver(characterFormSchema),
        defaultValues: {
            name: '',
            class: 'Gladiolus',
        },
    });

    const handleSkillClick = (id: string) => {
        if (userSkills.length >= 3 && !userSkills.includes(id)) return;
        if (userSkills.includes(id)) {
            setUserSkills(userSkills.filter((skillId) => skillId !== id));
        } else {
            setUserSkills([...userSkills, id]);
        }
    };

    async function onSubmit(values: z.infer<typeof characterFormSchema>) {
        if (userSkills.length != 3) {
            setError('You need to select 3 skills.');
            return;
        }

        setPending(true);
        const processedValues = calculateStatsByClass(
            characterAttack,
            characterDefense,
            characterSpeed,
            characterMaxHp,
            characterClass
        );

        if (!processedValues) return;

        try {
            const response = await fetch('/api/character/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData: {
                        ...values,
                        ...processedValues,
                        userId: sub,
                        image: '',
                    },
                    userSkills,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.refresh();
            } else {
                console.error('Failed to create character:', data.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setError('Failed to create character');
        } finally {
            setPending(false);
        }
    }

    return (
        <div className={`grid grid-cols-[1.5fr_1fr] items-center justify-center bg-bright-red select-none`}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full h-full items-center justify-center p-10">
                        <FormLabel className="text-main-white text-3xl self-start mb-8">New Character</FormLabel>
                        <div className="gap-8 grid grid-cols-2 w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setCharacterClass(value as CharacterClass);
                                                }}
                                                defaultValue={field.value}>
                                                <SelectTrigger className="w-full ring-0 shadow-none drop-shadow-none rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus:ring-0">
                                                    <SelectValue placeholder="Select a class" />
                                                </SelectTrigger>
                                                <SelectContent className="ring-transparent">
                                                    <SelectGroup>
                                                        <SelectLabel>Class</SelectLabel>
                                                        {CLASS.map((item) => (
                                                            <SelectItem key={item} value={item}>
                                                                {item}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="my-5">✦</div>
                        <div className="text-sm mb-4">Available Additional Stat Points: {currentPoint}</div>
                        <div className="flex flex-row w-full items-center justify-center gap-2">
                            <div className="flex flex-col items-center bg-middle-red p-4 rounded-sm">
                                <div className="text-lg mb-4">Health</div>
                                <div className="flex flex-row gap-1 mb-6">
                                    {Array(characterMaxHp)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamondFill />
                                            </span>
                                        ))}
                                    {Array(5 - characterMaxHp)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamond />
                                            </span>
                                        ))}
                                </div>
                                <div className="flex flex-row gap-1">
                                    <DiamondPlus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterMaxHp >= 5) return;
                                            if (currentPoint <= 0) return;
                                            setCharacterMaxHp((prev) => prev + 1);
                                            setCurrentPoint((prev) => prev - 1);
                                        }}
                                    />
                                    <DiamondMinus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterMaxHp <= 1) return;
                                            if (currentPoint >= TOTAL_POINT) return;
                                            setCharacterMaxHp((prev) => prev - 1);
                                            setCurrentPoint((prev) => prev + 1);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center bg-middle-red p-4 rounded-sm">
                                <div className="text-lg mb-4">Attack</div>
                                <div className="flex flex-row gap-1 mb-6">
                                    {Array(characterAttack)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamondFill />
                                            </span>
                                        ))}
                                    {Array(5 - characterAttack)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamond />
                                            </span>
                                        ))}
                                </div>
                                <div className="flex flex-row gap-1">
                                    <DiamondPlus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterAttack >= 5) return;
                                            if (currentPoint <= 0) return;
                                            setCharacterAttack((prev) => prev + 1);
                                            setCurrentPoint((prev) => prev - 1);
                                        }}
                                    />
                                    <DiamondMinus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterAttack <= 1) return;
                                            if (currentPoint >= TOTAL_POINT) return;
                                            setCharacterAttack((prev) => prev - 1);
                                            setCurrentPoint((prev) => prev + 1);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center bg-middle-red p-4 rounded-sm">
                                <div className="text-lg mb-4">Defense</div>
                                <div className="flex flex-row gap-1 mb-6">
                                    {Array(characterDefense)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamondFill />
                                            </span>
                                        ))}
                                    {Array(5 - characterDefense)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamond />
                                            </span>
                                        ))}
                                </div>
                                <div className="flex flex-row gap-1">
                                    <DiamondPlus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterDefense >= 5) return;
                                            if (currentPoint <= 0) return;
                                            setCharacterDefense((prev) => prev + 1);
                                            setCurrentPoint((prev) => prev - 1);
                                        }}
                                    />
                                    <DiamondMinus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterDefense <= 1) return;
                                            if (currentPoint >= TOTAL_POINT) return;
                                            setCharacterDefense((prev) => prev - 1);
                                            setCurrentPoint((prev) => prev + 1);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center bg-middle-red p-4 rounded-sm">
                                <div className="text-lg mb-4">Speed</div>
                                <div className="flex flex-row gap-1 mb-6">
                                    {Array(characterSpeed)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamondFill />
                                            </span>
                                        ))}
                                    {Array(5 - characterSpeed)
                                        .fill(0)
                                        .map((_, index) => (
                                            <span key={index}>
                                                <BsDiamond />
                                            </span>
                                        ))}
                                </div>
                                <div className="flex flex-row gap-1">
                                    <DiamondPlus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterSpeed >= 5) return;
                                            if (currentPoint <= 0) return;
                                            setCharacterSpeed((prev) => prev + 1);
                                            setCurrentPoint((prev) => prev - 1);
                                        }}
                                    />
                                    <DiamondMinus
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            if (characterSpeed <= 1) return;
                                            if (currentPoint >= TOTAL_POINT) return;
                                            setCharacterSpeed((prev) => prev - 1);
                                            setCurrentPoint((prev) => prev + 1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="my-5">✦ Select Skills</div>
                        <div className="flex flex-row gap-1">
                            {skills.map((skill) => {
                                return (
                                    <SkillCard
                                        key={skill.id}
                                        skill={skill}
                                        isHighLight={userSkills.includes(skill.id)}
                                        onClick={() => {
                                            handleSkillClick(skill.id);
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <div className={`${ubuntu.className} text-center mt-3 text-sm`}>{error}</div>
                        <div className="mt-10 flex flex-col">
                            <Button
                                type="submit"
                                disabled={pending}
                                className="shadow-none bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                                {pending ? 'Loading' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
            <div className="bg-middle-red h-full w-full p-10 flex flex-col cursor-default">
                <div className="text-2xl mb-3">{characterClass} Class</div>
                <div className="text-slate-400 text-sm">{CLASS_DESCRIPTION[characterClass]}</div>
            </div>
        </div>
    );
}

interface BattleRoomCreationFormProps {
    characterId: string;
    dungeon: Dungeon;
}

export function BattleRoomCreationForm({ dungeon, characterId }: BattleRoomCreationFormProps) {
    const [error, setError] = useState<string | undefined>('');
    const [code, setCode] = useState<string>(generateUniqueRoomCode());
    const [pending, setPending] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof battleRoomFormSchema>>({
        resolver: zodResolver(battleRoomFormSchema),
        defaultValues: {
            roomName: '',
            description: '',
        },
    });

    async function onSubmit(values: z.infer<typeof battleRoomFormSchema>) {
        setPending(true);
        try {
            const response = await fetch('/api/battle/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData: {
                        ...values,
                        invitationCode: code,
                        dungeonType: dungeon.name,
                        size: dungeon.size,
                        difficulty: dungeon.difficulty,
                        minMember: dungeon.minMember,
                        maxMember: dungeon.maxMember,
                    },
                    characterId: characterId,
                    dungeonId: dungeon.id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/dashboard/lobby');
            } else {
                console.error('Failed to create battle room:', data.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setError('Failed to create battle room');
        } finally {
            setPending(false);
        }
    }

    useEffect(() => {
        setCode(generateUniqueRoomCode());
    }, [dungeon]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full h-full items-center justify-center">
                    <FormLabel className="text-main-white text-3xl self-start mb-8">Create Party</FormLabel>
                    <div className="gap-8 grid grid-cols-2 w-full h-full">
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="roomName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Party Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                className="rounded-none border-wine-red resize-none bg-wine-red"
                                                placeholder="Describe your party if needed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-center text-xl">Notice</div>
                            <div className={`${ubuntu.className} leading-tight text-sm`}>
                                Currently, our platform only supports private parties. You need to share your invitation
                                code to your peers for the battle.
                            </div>
                            <div className="pt-2">
                                Invitation Code: <span className={`${ubuntu.className} select-text`}>{code}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${ubuntu.className} text-center mt-3 text-sm`}>{error}</div>
                    <div className="mt-10 flex flex-col">
                        <Button
                            type="submit"
                            disabled={pending}
                            className="shadow-none bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                            {pending ? 'Loading' : 'Create'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
