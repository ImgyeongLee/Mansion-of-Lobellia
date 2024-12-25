'use client';

import { handleSignOut } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const path = usePathname();
    return (
        <nav className="bg-bright-red flex flex-col text-xl py-8">
            <div className="flex flex-col">
                <Link
                    href={'/dashboard/characters'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer', {
                        'bg-middle-red': path.includes('/dashboard/characters'),
                    })}>
                    Characters
                </Link>
                <Link
                    href={'/dashboard/dungeons'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer', {
                        'bg-middle-red': path.includes('/dashboard/dungeons'),
                    })}>
                    Dungeons
                </Link>
                <Link
                    href={'/dashboard/store'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer', {
                        'bg-middle-red': path.includes('/dashboard/store'),
                    })}>
                    Store
                </Link>
            </div>
            <div className="flex flex-col mt-6">
                <Link
                    href={'/dashboard/account'}
                    className={cn('hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer', {
                        'bg-middle-red': path.includes('/dashboard/account'),
                    })}>
                    Account
                </Link>
                <div
                    className="hover:bg-middle-red px-6 py-2 transition ease-in-out hover:cursor-pointer"
                    onClick={handleSignOut}>
                    Sign Out
                </div>
            </div>
        </nav>
    );
}
