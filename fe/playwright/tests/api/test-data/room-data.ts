import { CreateRoom } from '../../../../src/types/room/CreateRoom';
import { CurrencyEnum } from '../../../../src/types/room/CurrencyEnum';
import { Room } from '../../../../src/types/room/Room';
import { RoomStatusEnum } from '../../../../src/types/room/RoomStatusEnum';
import { faker } from '@faker-js/faker';

export class RoomFactory {
  /**
   * Creates a valid room object for room creation
   * @param hostId The ID of the host user
   * @returns A CreateRoom object
   */
  static createValid(hostId: number): CreateRoom {
    return {
      name: `Room ${faker.animal.dog()}`.substring(0, 20),
      exchange: faker.number.int({ min: 10, max: 100 }),
      hostId: hostId,
      currency: CurrencyEnum.USD,
      baseBuyIn: faker.number.int({ min: 10, max: 1000 }),
      isVisible: true
    };
  }

  /**
   * Creates a room with a password
   * @param hostId The ID of the host user
   * @returns A CreateRoom object with a roomKey
   */
  static createWithPassword(hostId: number): CreateRoom {
    return {
      ...this.createValid(hostId),
      roomKey: faker.string.numeric(4)
    };
  }

  /**
   * Creates a private room (not visible to others)
   * @param hostId The ID of the host user
   * @returns A CreateRoom object with isVisible=false
   */
  static createPrivate(hostId: number): CreateRoom {
    return {
      ...this.createValid(hostId),
      isVisible: false
    };
  }

  /**
   * Creates a room with custom values for validation testing
   * @param hostId The ID of the host user
   * @param overrides Properties to override in the base room
   * @returns A CreateRoom object with overridden properties
   */
  static createWithOverrides(hostId: number, overrides: Partial<CreateRoom>): CreateRoom {
    return {
      ...this.createValid(hostId),
      ...overrides
    };
  }
}
