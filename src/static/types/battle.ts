import { DungeonDifficulty } from './dungeon';

export type ChatType = 'Chat' | 'System' | 'Action' | 'Result' | 'Debuff' | 'Buff';

export type RoomStatus = 'Initial' | 'Waiting' | 'Character' | 'Monster' | 'End';

export interface Chat {
    id: string;
    roomId: string;
    createdAt: Date;
    sender: string;
    image: string | null;
    chatType: ChatType;
}

export interface BattleRoom {
    id: string;
    invitationCode: string;
    size: number;
    roomName: string;
    dungeonType: string;
    description: string | null;
    minMember: number;
    maxMember: number;
    difficulty: DungeonDifficulty;
    round: number;
    roomStatus: RoomStatus;
    createdAt: Date;
}
