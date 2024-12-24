import { resendSignUpCode, signIn, signOut, signUp } from 'aws-amplify/auth';

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
                autoSignIn: {
                    enabled: true,
                },
            },
        });

        return { success: true, nextStep: nextStep.signUpStep };
    } catch (error) {
        console.log(error);
        return { sucess: false, error: error, nextStep: 'ERROR' };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleSignIn(data: any) {
    try {
        const { nextStep } = await signIn({
            username: data['email'],
            password: data['password'],
            options: {
                autoSignIn: {
                    enabled: true,
                },
            },
        });

        if (nextStep.signInStep == 'CONFIRM_SIGN_UP') {
            await resendSignUpCode({
                username: data['email'],
                options: {
                    deliveryMethod: 'EMAIL',
                },
            });
            return { succes: true, nextStep: nextStep.signInStep };
        }

        return { success: true, nextStep: nextStep.signInStep };
    } catch (error) {
        console.log(error);
        return { sucess: false, error: error };
    }
}

export async function handleSignOut() {
    try {
        await signOut();
        return { success: true };
    } catch (error) {
        console.log(error);
        return { sucess: false, error: error };
    }
}
