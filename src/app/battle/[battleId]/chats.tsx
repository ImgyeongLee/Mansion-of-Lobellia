'use client';

import { ubuntu } from '@/static/fonts';
import { Chat } from '@/static/types/battle';

interface ChatProps {
    chat: Chat;
}

export function MyChat({ chat }: ChatProps) {
    return (
        <div className="flex flex-col">
            <div className="bg-main-white mx-2 text-main-black px-3 py-2 max-w-[82%] self-end rounded-tr-lg rounded-tl-lg rounded-bl-lg text-base">
                {chat.body}
            </div>
            <div className={`${ubuntu.className} self-end mr-2 text-xs mt-1`}>20:40</div>
        </div>
    );
}

export function OpponentChat({ chat }: ChatProps) {
    return (
        <div className="flex flex-row w-full">
            <div className="rounded-full h-[40px] w-[40px] min-h-[40px] min-w-[40px] bg-bright-red ml-2 self-center" />
            <div className="flex flex-col">
                <div className="bg-main-white mx-2 text-main-black px-3 py-2 max-w-[82%] self-start rounded-lg text-base">
                    {chat.body}
                </div>
                <div className={`${ubuntu.className} self-start ml-2 text-xs mt-1`}>20:40</div>
            </div>
        </div>
    );
}

export function SystemChat({ chat }: ChatProps) {
    return <div className="bg-bright-red text-center p-3 text-lg w-full my-2">{chat.body}</div>;
}

export function ActionChat({ chat }: ChatProps) {
    return (
        <div className={`text-center text-lg w-full ${ubuntu.className} text-xs text-slate-600 select-none`}>
            {chat.body}
        </div>
    );
}

export function ResultChat({ chat }: ChatProps) {
    return (
        <div className={`text-center w-full ${ubuntu.className} text-xs text-bright-red select-none`}>{chat.body}</div>
    );
}

export function DebuffChat({ chat }: ChatProps) {
    return (
        <div className={`text-center w-full ${ubuntu.className} text-xs text-bright-red select-none`}>{chat.body}</div>
    );
}

export function BuffChat({ chat }: ChatProps) {
    return (
        <div className={`text-center w-full ${ubuntu.className} text-xs text-yellow-500 select-none`}>{chat.body}</div>
    );
}
