'use client';

import { Amplify, type ResourcesConfig } from 'aws-amplify';

export const authConfig: ResourcesConfig = {
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
};

Amplify.configure(authConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
    return null;
}
