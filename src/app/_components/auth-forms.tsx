'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { handleSignIn, handleConfirmSignUp, handleSignUp } from '@/lib/db/actions/auth';
import { useUserStateStore } from '@/lib/store';

export function SignInForm() {
    const [error, setError] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleEmail = useUserStateStore((state) => state.setEmail);

    const signInFormSchema = z.object({
        email: z.string().min(1),
        password: z.string().min(1),
    });

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof signInFormSchema>) {
        setIsLoading(true);
        try {
            const result = await handleSignIn(values);
            handleEmail(values.email);
            if (result.success && result.nextStep != 'CONFIRM_SIGN_UP') {
                handleEmail('');
                router.push('/dashboard');
            } else if (result.success && result.nextStep == 'CONFIRM_SIGN_UP') {
                router.push('/auth/verify/signup');
            }
        } catch (error) {
            setError('클라이언트: 로그인 오류.');
            throw error;
        }
        setIsLoading(false);
    }

    return (
        <div className={`h-screen`}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="py-5 px-10 w-full flex flex-col h-full items-center justify-center bg-bright-red">
                    <div className="flex flex-col w-full h-full items-center justify-center">
                        <FormLabel className="text-main-white text-3xl self-start mb-8">Sign in</FormLabel>
                        <div className="gap-6 flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mt-10 flex flex-col">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="shadow-none bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                                {isLoading ? 'Loading' : 'Sign in'}
                            </Button>
                            <div className="text-[#BDBDBD] text-sm text-center py-3">
                                Do not have account?{' '}
                                <Link
                                    href={'/auth/signup'}
                                    className="text-main-white hover:text-main-black transition ease-in-out">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export function SignUpForm() {
    const [error, setError] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const handleEmail = useUserStateStore((state) => state.setEmail);

    const signInFormSchema = z.object({
        username: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
        confirmation: z.string().min(1),
    });

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmation: '',
        },
    });

    async function onSubmit(values: z.infer<typeof signInFormSchema>) {
        setIsLoading(true);
        try {
            const result = await handleSignUp(values);
            if (result.success) {
                handleEmail(values.email);
                router.push('/auth/verify/signup');
            }
        } catch (error) {
            setError('Sign up Error');
            throw error;
        }
    }

    return (
        <div className={`grid grid-cols-[1fr_1.2fr_1fr] h-screen`}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="py-10 px-20 w-full grid grid-rows-[1fr_3fr_1fr] h-full col-start-2 bg-bright-red">
                    <FormLabel className="text-main-white text-4xl text-center self-center">Invitation</FormLabel>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="gap-3 flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Write your password again"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col w-[160px] self-end mt-9">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Write your username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="shadow-none bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                            {isLoading ? 'Loading' : 'Register'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export function VerifySignUpForm() {
    const [error, setError] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const email = useUserStateStore((state) => state.email);

    const handlEmail = useUserStateStore((state) => state.setEmail);

    const verifySignUpFormSchema = z.object({
        confirmationCode: z.string().min(1),
    });

    const form = useForm<z.infer<typeof verifySignUpFormSchema>>({
        resolver: zodResolver(verifySignUpFormSchema),
        defaultValues: {
            confirmationCode: '',
        },
    });

    async function onSubmit(values: z.infer<typeof verifySignUpFormSchema>) {
        setIsLoading(true);
        try {
            const result = await handleConfirmSignUp({ ...values, email: email });
            if (result.success) {
                handlEmail('');
                router.refresh();
            }
        } catch (error) {
            setError('Sign up confirmation Error');
            throw error;
        }
        setIsLoading(false);
    }

    return (
        <div className={`grid grid-cols-[1fr_1.2fr_1fr] h-screen`}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="py-10 px-20 w-full grid grid-rows-[1fr_3fr_1fr] h-full col-start-2 bg-bright-red">
                    <div className="w-full flex flex-col">
                        <FormLabel className="text-main-white text-4xl text-center self-center">Verification</FormLabel>
                        <div className="text-center self-center">
                            To access all features, you should verify yourself.
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="gap-3 flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name="confirmationCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-b-wine-red focus-visible:ring-transparent"
                                                placeholder="Code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="shadow-none bg-transparent rounded-none bg-main-white text-main-black py-5 w-[calc(150px+10vw)] hover:bg-main-black hover:text-main-white text-xl self-center">
                            {isLoading ? 'Loading' : 'Verify'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
