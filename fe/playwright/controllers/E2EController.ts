import { APIRequestContext } from '@playwright/test';
import { BaseController, ApiResponse } from './BaseController';

export class E2EController extends BaseController {
	constructor(request: APIRequestContext) {
		super(request, '/e2e');
	}

	/**
	 * Clear the database to provide a clean state for tests
	 */
	async clearDatabase(): Promise<ApiResponse> {
		return this.get();
	}
}
