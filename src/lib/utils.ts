import { ATK_ARRAY, DEF_ARRAY, HP_ARRAY, SPD_ARRAY } from '@/static/data';
import { characterFormSchema } from '@/static/formSchema';
import { NextServer, createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const { runWithAmplifyServerContext } = createServerRunner({
    config: {
        Auth: {
            Cognito: {
                userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
                userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
                loginWith: {
                    email: true,
                },
                userAttributes: {
                    email: {
                        required: true,
                    },
                },
            },
        },
    },
});

export async function authenticatedUser(context: NextServer.Context) {
    return await runWithAmplifyServerContext({
        nextServerContext: context,
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                if (!session.tokens) {
                    return;
                }
                const user = { ...(await getCurrentUser(contextSpec)), isAdmin: false };
                const groups = session.tokens.accessToken.payload['cognito:groups'];
                user.isAdmin = Boolean(Array.isArray(groups) && groups.includes('Admin'));
                return user;
            } catch (error) {
                console.log(error);
            }
        },
    });
}

export function calculateStatsByClass(data: z.infer<typeof characterFormSchema>) {
    if (data.class === 'Gladiolus') {
        const stats = {
            maxHp: Math.round(HP_ARRAY[data.maxHp] * 1.5),
            attack: ATK_ARRAY[data.attack],
            defense: DEF_ARRAY[data.defense] * 2,
            maxCost: 30,
            crit: 20,
            dodge: 5,
            speed: SPD_ARRAY[data.speed],
        };
        return stats;
    } else if (data.class === 'Saintpaulia') {
        const stats = {
            maxHp: Math.round(HP_ARRAY[data.maxHp] * 1.5),
            attack: Math.round(ATK_ARRAY[data.attack] * 0.7),
            defense: DEF_ARRAY[data.defense],
            maxCost: 60,
            crit: 5,
            dodge: 20,
            speed: SPD_ARRAY[data.speed],
        };
        return stats;
    } else if (data.class === 'Cypress') {
        const stats = {
            maxHp: Math.round(HP_ARRAY[data.maxHp] * 0.7),
            attack: Math.round(ATK_ARRAY[data.attack] * 1.5),
            defense: DEF_ARRAY[data.defense],
            maxCost: 20,
            crit: 35,
            dodge: 20,
            speed: SPD_ARRAY[data.speed],
        };
        return stats;
    } else if (data.class === 'Blackthorn') {
        const stats = {
            maxHp: HP_ARRAY[data.maxHp],
            attack: ATK_ARRAY[data.attack],
            defense: Math.round(DEF_ARRAY[data.defense] * 0.7),
            maxCost: 60,
            crit: 5,
            dodge: 40,
            speed: SPD_ARRAY[data.speed],
        };
        return stats;
    }
}
