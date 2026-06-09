import { test, expect } from '../../test-setup';
import { RoomFactory } from './test-data/room-data';
import { ExchangeFactory } from './test-data/exchange-data';
import { User } from '../../../src/types/user/User';
import { Room } from '../../../src/types/room/Room';
import { Player } from '../../../src/types/player/Player';
import { ExchangeDirectionEnum } from '../../../src/types/payment/ExchangeDirectionEnum';
import { createBaseRoomTestSetup } from '../../utils/test-helpers';
import currency from 'currency.js';

test.describe('Exchange API', () => {
  let user: User;
  let room: Room;
  let player: Player;

  const formatExchange = (value: number | string) => currency(value, { symbol: '', precision: 2 }).format();

  test.beforeEach(async ({ userController, authController, roomController }) => {
    ({ user, room, player } = await createBaseRoomTestSetup(userController, authController, roomController));
  });

  test('should create a buy-in exchange', async ({ exchangeController }) => {
    const exchangeData = ExchangeFactory.createBuyIn(room.id, player.id);

    const response = await exchangeController.createExchange(exchangeData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.playerId).toBe(player.id);
    expect(response.body.direction).toBe(ExchangeDirectionEnum.BuyIn);
    expect(formatExchange(response.body.chipAmount)).toBe(formatExchange(exchangeData.amount * room.exchange));
    expect(formatExchange(response.body.cashAmount)).toBe(formatExchange(exchangeData.amount));
  });

  test('should create a cash-out exchange', async ({ exchangeController }) => {
    const buyInAmount = 200;
    const buyInData = ExchangeFactory.createBuyIn(
      room.id,
      player.id,
      buyInAmount
    );
    await exchangeController.createExchange(buyInData);

    const cashOutAmount = 150 * room.exchange;
    const exchangeData = ExchangeFactory.createCashOut(
      room.id,
      player.id,
      cashOutAmount
    );

    const response = await exchangeController.createExchange(exchangeData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.playerId).toBe(player.id);
    expect(response.body.direction).toBe(ExchangeDirectionEnum.CashOut);
    expect(formatExchange(response.body.chipAmount)).toBe(formatExchange(exchangeData.amount));
    expect(formatExchange(response.body.cashAmount)).toBe(formatExchange(exchangeData.amount / room.exchange));
  });

  test('should not create a cash-out exchange when total buy-in is less than cash-out', async ({ roomController, exchangeController }) => {
    const buyInAmount = 200;
    const buyInData = ExchangeFactory.createBuyIn(
      room.id,
      player.id,
      buyInAmount
    );
    await exchangeController.createExchange(buyInData);

    const cashOutAmount = 250 * room.exchange;
    const exchangeData = ExchangeFactory.createCashOut(
      room.id,
      player.id,
      cashOutAmount
    );

    const response = await exchangeController.createExchange(exchangeData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Total buy-in is less than cash-out');
  });

  test('should not allow unauthorized exchanges', async ({ exchangeController, authController }) => {
    await authController.logout();

    const exchangeData = ExchangeFactory.createBuyIn(
      room.id,
      player.id
    );

    const response = await exchangeController.createExchange(exchangeData);

    expect(response.status).toBe(403);
    expect(response.body.message).toContain('Forbidden');
  });

  test('should handle precise decimal amounts', async ({ exchangeController }) => {
    const decimalAmount = 123.45;
    const exchangeData = ExchangeFactory.createBuyIn(
      room.id,
      player.id,
      decimalAmount
    );

    const response = await exchangeController.createExchange(exchangeData);

    expect(response.status).toBe(201);
    expect(formatExchange(response.body.cashAmount)).toBe(formatExchange(decimalAmount));
  });
});
