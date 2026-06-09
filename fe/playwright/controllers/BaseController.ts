import { APIRequestContext } from '@playwright/test';
import { env } from '../utils/environment';

export interface ApiResponse<T = any> {
  status: number;
  body: T;
}

export abstract class BaseController {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, endpoint: string) {
    this.request = request;
    this.baseUrl = `${env.apiUrl}${endpoint}`;
  }

  /**
   * Send a GET request
   */
  protected async get<T = any>(path: string = '', headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const response = await this.request.get(`${this.baseUrl}${path ? '/' + path : ''}`, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': env.apiUrl,
        ...headers
      }
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => null)
    };
  }

  /**
   * Send a POST request
   */
  protected async post<T = any, D = any>(path: string = '', data?: D, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const response = await this.request.post(`${this.baseUrl}${path ? '/' + path : ''}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        'Referer': env.apiUrl,
        ...headers
      }
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => null)
    };
  }

  /**
   * Send a PUT request
   */
  protected async put<T = any, D = any>(path: string = '', data?: D, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const response = await this.request.put(`${this.baseUrl}${path ? '/' + path : ''}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        'Referer': env.apiUrl,
        ...headers
      }
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => null)
    };
  }

  /**
   * Send a PATCH request
   */
  protected async patch<T = any, D = any>(path: string = '', data?: D, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const response = await this.request.patch(`${this.baseUrl}${path ? '/' + path : ''}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        'Referer': env.apiUrl,
        ...headers
      }
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => null)
    };
  }

  /**
   * Send a DELETE request
   */
  protected async delete<T = any>(path: string = '', headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const response = await this.request.delete(`${this.baseUrl}${path ? '/' + path : ''}`, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': env.apiUrl,
        ...headers
      }
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => null)
    };
  }
}
