import type { ExchangeDirectionEnum } from './ExchangeDirectionEnum';

export interface CreateExchange {
    roomId: number;
    playerId: number;
    amount: number;
    type: ExchangeDirectionEnum;
}
