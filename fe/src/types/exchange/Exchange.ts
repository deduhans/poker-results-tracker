import type { ExchangeDirectionEnum } from './ExchangeDirectionEnum';

export interface Exchange {
    id: number;
    roomId: number;
    playerId: number;
    chipAmount: string;
    cashAmount: string;
    direction: ExchangeDirectionEnum;
    createdAt: Date;
}