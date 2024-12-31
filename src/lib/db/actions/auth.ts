import {
    resendSignUpCode,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    autoSignIn,
    fetchUserAttributes,
} from 'aws-amplify/auth';
import { createUser } from './user';
import { removeCharacterId, removeSub, setSub } from './cookies';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleSignUp(data: any) {
    try {
        const { nextStep } = await signUp({
            username: data['email'],
            password: data['password'],
            options: {
                userAttributes: {
                    email: data['email'],
                    name: data['username'],
                },
                autoSignIn: true,
            },
        });

        return { success: true, nextStep: nextStep.signUpStep };
    } catch (error) {
        console.log(error);
        return { sucess: false, error: error, nextStep: 'ERROR' };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleConfirmSignUp(data: any) {
    try {
        const { nextStep } = await confirmSignUp({
            username: data['email'],
            confirmationCode: data['confirmationCode'],
            options: {
                autoSignIn: {
                    enabled: true,
                },
            },
        });
        await autoSignIn();
        const userAttributes = await fetchUserAttributes();
        if (userAttributes.email && userAttributes.sub && userAttributes.name) {
            try {
                await createUser(userAttributes.sub, userAttributes.email, userAttributes.name);
                setSub(userAttributes.sub);
            } catch (error) {
                console.error('Failed to create new user: ', error);
            }
        }

        return { success: true, nextStep: nextStep.signUpStep };
    } catch (error) {
        console.log(error);
        return { sucess: false, error: error };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleSignIn(data: any) {
    try {
        const { nextStep, isSignedIn } = await signIn({
            username: data['email'],
            password: data['password'],
            options: {
                authFlowType: 'USER_PASSWORD_AUTH',
            },
        });

        // If user needs to confirm signup
        if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
            await resendSignUpCode({
                username: data['email'],
                options: {
                    deliveryMethod: 'EMAIL',
                },
            });
            return { success: true, nextStep: nextStep.signInStep };
        }

        // If user is successfully signed in
        if (isSignedIn) {
            const userAttributes = await fetchUserAttributes();
            if (userAttributes.email && userAttributes.sub && userAttributes.name) {
                setSub(userAttributes.sub);
            }
            return { success: true, nextStep: nextStep.signInStep };
        }

        // Handle other potential steps
        return { success: false, nextStep: nextStep.signInStep };
    } catch (error) {
        console.log('Sign in error:', error);
        return { success: false, error: error };
    }
}

export async function handleSignOut() {
    try {
        await signOut();
        removeSub();
        removeCharacterId();
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, error: error };
    }
}
