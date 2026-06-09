import type { CreateExchange } from '@/types/exchange/CreateExchange';
import axiosClient from '../apiClient';
import type { Exchange } from '@/types/exchange/Exchange';

class ExchangeController {
  private readonly CONTROLLER = '/exchanges';

  async createExchange(createExchange: CreateExchange): Promise<Exchange> {
    const url: string = `${this.CONTROLLER}`;

    const response = await axiosClient.post(url, createExchange);

    return response.data as Exchange;
  }
}

export default ExchangeController;