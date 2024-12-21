interface RouteProps {
    href: string;
    title: string;
}

export const navItems: RouteProps[] = [
    {
        href: '/about',
        title: 'About',
    },
    {
        href: 'https://github.com/ImgyeongLee/Mansion-of-Lobellia',
        title: 'Code',
    },
    {
        href: 'https://awsdevchallenge.devpost.com/?ref_content=default&ref_feature=challenge&ref_medium=portfolio',
        title: 'DevPost',
    },
    {
        href: '/auth/signin',
        title: 'Sign in',
    },
];
