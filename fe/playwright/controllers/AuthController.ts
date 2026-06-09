import { APIRequestContext } from '@playwright/test';
import { BaseController, ApiResponse } from './BaseController';
import { Auth } from '../../src/types/auth/Auth';

export class AuthController extends BaseController {
  constructor(request: APIRequestContext) {
    super(request, '/auth');
  }

  async login(auth: Auth): Promise<ApiResponse> {
    return this.post('login', auth);
  }

  async getSessionStatus(): Promise<ApiResponse> {
    return this.get('sessionStatus');
  }

  async logout(): Promise<ApiResponse> {
    return this.get('logout');
  }
}
