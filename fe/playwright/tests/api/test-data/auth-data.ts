import { Auth } from '../../../../src/types/auth/Auth';
import { CreateUser } from '../../../../src/types/user/CreateUser';
import { User } from '../../../../src/types/user/User';

export class AuthFactory {
  static createFromUser(user: CreateUser | User): Auth {
    return { username: user.username, password: user.password };
  }

  static createInvalid(user: CreateUser | User, type: keyof typeof invalidAuthTemplates): Auth {
    const invalidAuth = { ...invalidAuthTemplates[type] };

    if (invalidAuth) {
      Object.assign(user, invalidAuth);
    }

    return user as Auth;
  }
}

const invalidAuthTemplates = {
  wrongPassword: {
    password: 'wrongpassword123'
  },
  nonExistentUser: {
    username: 'nonexistent_user'
  },
  emptyUsername: {
    username: ''
  },
  emptyPassword: {
    password: ''
  }
};
