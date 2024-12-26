import type { Metadata } from 'next';
import { Gelasio } from 'next/font/google';
import './globals.css';
import ConfigureAmplifyClientSide from './_components/providers/authProvider';
import { TanstackProvider } from './_components/providers/queryProviders';
export const gelasio = Gelasio({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
    title: 'The Mansion of Lobellia',
    description: 'Marsraid TTRPG Platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${gelasio.className} antialiased`}>
                <TanstackProvider>
                    <ConfigureAmplifyClientSide />
                    {children}
                </TanstackProvider>
            </body>
        </html>
    );
}
