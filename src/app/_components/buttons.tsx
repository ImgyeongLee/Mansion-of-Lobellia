'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SignInForm } from './forms';

export function SignInButton() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className={`bg-bright-red text-main-white py-2 px-4 hover:bg-middle-red`}>Sign in</Button>
            </SheetTrigger>
            <SheetContent className="p-0 border-none">
                <SignInForm />
            </SheetContent>
        </Sheet>
    );
}
