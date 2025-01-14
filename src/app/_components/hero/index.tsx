import Image from 'next/image';
import { SignInButton } from '../buttons';

export default function Hero() {
    return (
        <main className={`h-full w-full grid grid-cols-[1fr_5fr_1fr] text-main-white py-10 text-center`}>
            <section className="flex flex-col col-start-2">
                <nav className="flex flex-row justify-end">
                    <SignInButton />
                </nav>
                <Image src={'/logo.webp'} alt="hero" width={1500} height={1500} />
                <div className="text-[calc(8px+1vw)] -m-64 cursor-default">Be with your creed</div>
            </section>
        </main>
    );
}
