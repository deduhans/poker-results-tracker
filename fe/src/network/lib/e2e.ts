import axiosClient from '../apiClient';

class E2EController {
  private readonly CONTROLLER = '/e2e';

  async trancate(): Promise<void> {
    const url: string = `${this.CONTROLLER}`;

    await axiosClient.get(url);
  }
}

export default E2EController;