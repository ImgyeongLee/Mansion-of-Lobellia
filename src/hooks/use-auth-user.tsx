import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function useAuthUser() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<Record<string, any>>();
    useEffect(() => {
        const fetchUser = async () => {
            const session = await fetchAuthSession();
            if (!session.tokens) {
                return;
            }
            const user = { ...(await getCurrentUser()), ...(await fetchUserAttributes()), isAdmin: false };
            const groups = session.tokens.accessToken.payload['cognito:groups'];
            user.isAdmin = Boolean(Array.isArray(groups) && groups.includes('Admin'));
            setUser(user);
        };
        fetchUser();
    }, []);

    return user;
}
