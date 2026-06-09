import type { Player } from '../player/Player';
import type { RoomStatusEnum } from './RoomStatusEnum';
import { CurrencyEnum } from './CurrencyEnum';

export interface Room {
    id: number;
    name: string;
    exchange: number;
    currency: CurrencyEnum;
    baseBuyIn: number;
    isVisible: boolean;
    accessToken?: string;
    status: RoomStatusEnum;
    players: Player[];
    createdAt: Date;
}