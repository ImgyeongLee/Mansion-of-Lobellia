import { Character } from './character';
import { DungeonDifficulty } from './dungeon';
import { Entity } from './monster';

export type ChatType = 'Chat' | 'System' | 'Action' | 'Result' | 'Debuff' | 'Buff';

export type RoomStatus = 'Initial' | 'Waiting' | 'Character' | 'Monster' | 'End';

export interface BattleRoomFormData {
    hostId: string;
    invitationCode: string;
    roomName: string;
    dungeonType: string;
    description: string;
    minMember: number;
    maxMember: number;
    difficulty: DungeonDifficulty;
    size: number;
}

export interface Chat {
    id: string;
    roomId: string;
    createdAt: Date;
    sender: string;
    body: string;
    image: string | null;
    chatType: ChatType;
}

export interface ChatBody {
    roomId: string;
    sender: string;
    body: string;
    image: string | null;
    chatType: ChatType;
}

export interface BattleRoom {
    id: string;
    hostId: string;
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
    participants: Character[];
    entities: Entity[];
}

export interface TurnQueue {
    id: string;
    subjectId: string;
    subjectType: 'Character' | 'Monster';
    order: number;
    roomId: string;
}
