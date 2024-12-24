import { authConfig } from '@/app/amplify-cognito-config';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const { runWithAmplifyServerContext } = createServerRunner({
    config: {
        Auth: authConfig,
    },
});
