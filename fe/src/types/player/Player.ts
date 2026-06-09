import type { Exchange } from '../exchange/Exchange';
import type { PlayerRoleEnum } from './PlayerRole';
import type { User } from '../user/User';

export interface Player {
    id: number;
    roomId: number;
    userId: number;
    username?: string;
    name: string;
    role: PlayerRoleEnum;
    exchanges: Exchange[];
    createdAt: Date;
    user?: User; // User assigned to this player (optional)
}