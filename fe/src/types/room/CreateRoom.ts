import { CurrencyEnum } from './CurrencyEnum';

export interface CreateRoom {
    name: string;
    exchange: number;
    hostId: number;
    currency?: CurrencyEnum;
    baseBuyIn?: number;
    isVisible?: boolean;
}
