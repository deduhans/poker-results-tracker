import { APIRequestContext } from '@playwright/test';
import { BaseController, ApiResponse } from './BaseController';
import { CreateExchange } from '../../src/types/exchange/CreateExchange';
import { Exchange } from '../../src/types/exchange/Exchange';

export class ExchangeController extends BaseController {
  constructor(request: APIRequestContext) {
    super(request, '/exchanges');
  }

  /**
   * Create a new exchange (buy-in or cash-out)
   * @param exchange Exchange data for creation
   * @returns API response with the created exchange
   */
  async createExchange(exchange: CreateExchange): Promise<ApiResponse<Exchange | any>> {
    return this.post('', exchange);
  }
}
