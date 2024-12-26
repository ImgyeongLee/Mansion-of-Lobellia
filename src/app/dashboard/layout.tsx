import { Sidebar } from '../_components/sidebar';

export default function BaseLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="grid grid-cols-[1fr_4fr] h-screen select-none">
            <Sidebar />
            {children}
        </main>
    );
}
