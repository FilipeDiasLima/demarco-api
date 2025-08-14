import { EnvService } from '@/infra/env/env.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import qs from 'qs';

@Injectable()
export class OMSTokenService {
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly envService: EnvService) {}

  async getValidToken(): Promise<string> {
    const bufferTime = 5 * 60 * 1000;
    if (
      this.token &&
      this.tokenExpiry &&
      new Date(Date.now() + bufferTime) < this.tokenExpiry
    ) {
      return this.token;
    }

    await this.refreshToken();
    return this.token!;
  }

  private async refreshToken(): Promise<void> {
    const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';

    try {
      const tokenResponse = await axios.post(
        tokenUrl,
        qs.stringify({
          grant_type: 'client_credentials',
          scope: 'icdapi_access',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: this.envService.get('OMS_CLIENT_ID'),
            password: this.envService.get('OMS_SECRET'),
          },
        },
      );

      this.token = tokenResponse.data.access_token;
      const expiresInMs = (tokenResponse.data.expires_in || 3600) * 1000;
      this.tokenExpiry = new Date(Date.now() + expiresInMs);
    } catch (error) {
      throw new Error('Failed to obtain OMS API token');
    }
  }

  invalidateToken(): void {
    this.token = null;
    this.tokenExpiry = null;
  }
}
