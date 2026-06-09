import { faker } from '@faker-js/faker';
import { CreateUser } from '../../../../src/types/user/CreateUser';

export class UserFactory {
  static createValid(): CreateUser {
    return {
      username: `user_${Date.now().toString().slice(-6)}`,
      password: faker.internet.password({ length: 10, pattern: /[0-9]/, prefix: 'pass' })
    };
  }

  static createBatch(count: number): CreateUser[] {
    return Array.from({ length: count }, () => this.createValid());
  }

  static createInvalid(type: keyof typeof invalidUserTemplates): CreateUser {
    return { ...invalidUserTemplates[type] };
  }
}

const invalidUserTemplates = {
  emptyUsername: {
    username: '',
    password: 'password123'
  },
  emptyPassword: {
    username: 'validuser',
    password: ''
  },
  tooShortUsername: {
    username: 'ab',
    password: 'password123'
  },
  tooShortPassword: {
    username: 'validuser',
    password: '123'
  },
  specialCharsUsername: {
    username: 'user@test!',
    password: 'password123'
  },
  passwordWithoutNumbers: {
    username: 'validuser',
    password: 'password'
  }
};
