import { BattleSidebar, ChatSidebar } from '@/app/_components/sidebar';

export default function BattlePage() {
    return (
        <section className="grid grid-cols-[1fr_3fr_1fr] h-screen w-full">
            <BattleSidebar />
            <div className="grid grid-rows-[1fr_7fr_1.5fr] h-full w-full">
                <div className="h-full w-full bg-red-600"></div>
                <div className="h-full w-full bg-blue-600"></div>
                <div className="h-full w-full bg-red-600"></div>
            </div>
            <ChatSidebar />
        </section>
    );
}
