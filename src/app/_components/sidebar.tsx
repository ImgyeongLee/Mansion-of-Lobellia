'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const path = usePathname();
    return (
        <nav className="bg-bright-red flex flex-col text-xl py-8">
            <div className="flex flex-col">
                <Link
                    href={'/dashboard'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out', {
                        'bg-middle-red': path.includes('/dashboard'),
                    })}>
                    Characters
                </Link>
                <Link
                    href={'/dungeons'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out', {
                        'bg-middle-red': path.includes('/dungeons'),
                    })}>
                    Dungeons
                </Link>
                <Link
                    href={'/store'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out', {
                        'bg-middle-red': path.includes('/store'),
                    })}>
                    Store
                </Link>
            </div>
            <div className="flex flex-col mt-6">
                <Link
                    href={'/account'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out', {
                        'bg-middle-red': path.includes('/account'),
                    })}>
                    Account
                </Link>
                <Link href={'/dungeons'} className="hover:bg-middle-red px-6 py-2 transition ease-in-out">
                    Sign Out
                </Link>
            </div>
        </nav>
    );
}
