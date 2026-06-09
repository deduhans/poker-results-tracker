import { faker } from '@faker-js/faker';
import { CreateExchange } from '../../../../src/types/payment/CreateExchange';
import { Exchange } from '../../../../src/types/payment/Exchange';
import { ExchangeDirectionEnum } from '../../../../src/types/payment/ExchangeDirectionEnum';

export class ExchangeFactory {
  /**
   * Creates a valid buy-in exchange
   * @param roomId The ID of the room
   * @param playerId The ID of the player
   * @param amount Optional amount (defaults to a random amount between 10-1000)
   * @returns A CreateExchange object for buy-in
   */
  static createBuyIn(roomId: number, playerId: number, amount?: number): CreateExchange {
    return {
      roomId,
      playerId,
      amount: amount || faker.number.int({ min: 10, max: 1000 }),
      type: ExchangeDirectionEnum.BuyIn
    };
  }

  /**
   * Creates a valid cash-out exchange
   * @param roomId The ID of the room
   * @param playerId The ID of the player
   * @param amount Optional amount (defaults to a random amount between 10-1000)
   * @returns A CreateExchange object for cash-out
   */
  static createCashOut(roomId: number, playerId: number, amount?: number): CreateExchange {
    return {
      roomId,
      playerId,
      amount: amount || faker.number.int({ min: 10, max: 1000 }),
      type: ExchangeDirectionEnum.CashOut
    };
  }

  /**
   * Creates an exchange with custom properties
   * @param roomId The ID of the room
   * @param playerId The ID of the player
   * @param overrides Properties to override in the base exchange
   * @returns A CreateExchange object with overridden properties
   */
  static createWithOverrides(
    roomId: number,
    playerId: number,
    overrides: Partial<CreateExchange>
  ): CreateExchange {
    return {
      ...this.createBuyIn(roomId, playerId),
      ...overrides
    };
  }
}
