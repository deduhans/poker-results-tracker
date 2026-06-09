import type { ExchangeDirectionEnum } from './ExchangeDirectionEnum';

export interface ExchangeDetails {
    id: number;
    amount: number;
    date: string;
    playerName: string;
    type: ExchangeDirectionEnum;
}