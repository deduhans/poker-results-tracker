import { APIRequestContext } from '@playwright/test';
import { BaseController, ApiResponse } from './BaseController';
import { CreateUser } from '../../src/types/user/CreateUser';
import { User } from '../../src/types/user/User';

export class UserController extends BaseController {
	constructor(request: APIRequestContext) {
		super(request, '/users');
	}

	async createUser(userData: CreateUser): Promise<ApiResponse<User | any>> {
		return this.post('', userData);
	}

	async getUser(userId: string): Promise<ApiResponse<User>> {
		return this.get(userId);
	}
}
