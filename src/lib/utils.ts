import { ATK_ARRAY, DEF_ARRAY, HP_ARRAY, SPD_ARRAY } from '@/static/data';
import { NextServer, createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function calculateStatsByClass(
    attack: number,
    defense: number,
    speed: number,
    maxHp: number,
    characterClass: string
) {
    if (characterClass === 'Gladiolus') {
        const stats = {
            maxHp: Math.round(HP_ARRAY[maxHp] * 1.5),
            currentHp: Math.round(HP_ARRAY[maxHp] * 1.5),
            attack: ATK_ARRAY[attack],
            defense: DEF_ARRAY[defense] * 2,
            maxCost: 30,
            currentCost: 30,
            crit: 20,
            dodge: 5,
            speed: SPD_ARRAY[speed],
        };
        return stats;
    } else if (characterClass === 'Saintpaulia') {
        const stats = {
            maxHp: Math.round(HP_ARRAY[maxHp] * 1.5),
            currentHp: Math.round(HP_ARRAY[maxHp] * 1.5),
            attack: Math.round(ATK_ARRAY[attack] * 0.7),
            defense: DEF_ARRAY[defense],
            maxCost: 60,
            currentCost: 60,
            crit: 5,
            dodge: 20,
            speed: SPD_ARRAY[speed],
        };
        return stats;
    } else if (characterClass === 'Cypress') {
        const stats = {
            maxHp: Math.round(HP_ARRAY[maxHp] * 0.7),
            currentHp: Math.round(HP_ARRAY[maxHp] * 0.7),
            attack: Math.round(ATK_ARRAY[attack] * 1.5),
            defense: DEF_ARRAY[defense],
            maxCost: 20,
            currentCost: 20,
            crit: 35,
            dodge: 20,
            speed: SPD_ARRAY[speed],
        };
        return stats;
    } else if (characterClass === 'Blackthorn') {
        const stats = {
            maxHp: HP_ARRAY[maxHp],
            currentHp: HP_ARRAY[maxHp],
            attack: ATK_ARRAY[attack],
            defense: Math.round(DEF_ARRAY[defense] * 0.7),
            maxCost: 60,
            currentCost: 60,
            crit: 5,
            dodge: 40,
            speed: SPD_ARRAY[speed],
        };
        return stats;
    }
}

export function validatePassword(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

export function generateUniqueRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    code += Date.now().toString(36);
    return code;
}
