import { gelasio } from '@/static/fonts';
import { SignInButton } from '../buttons';

export default function Hero() {
    return (
        <main
            className={`${gelasio.className} h-full w-full grid grid-cols-[1fr_5fr_1fr] text-main-white py-10 text-center`}>
            <section className="flex flex-col col-start-2">
                <nav className="flex flex-row justify-between">
                    <div>Logo</div>
                    <SignInButton />
                </nav>
                <div className="text-[calc(20px+2vw)] cursor-default">The Mansion of Lobellia</div>
                <div className="text-[calc(8px+1vw)] -m-2 cursor-default">Be with your creed</div>
            </section>
        </main>
    );
}
