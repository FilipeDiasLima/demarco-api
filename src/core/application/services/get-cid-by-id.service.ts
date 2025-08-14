import { OMSTokenService } from '@/core/application/services/oms-token.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface GetCIDByIdRequest {
  cid: string;
}

@Injectable()
export class GetCIDByIdService {
  constructor(private readonly omsTokenService: OMSTokenService) {}

  async execute({
    cid,
  }: GetCIDByIdRequest): Promise<{ code: string; description: string } | null> {
    try {
      const token = await this.omsTokenService.getValidToken();

      const response = await axios.get(
        `https://id.who.int/icd/entity/${cid}?`,
        {
          headers: {
            accept: 'application/json',
            'API-Version': 'v2',
            'Accept-Language': 'pt',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data) {
        return null;
      }

      return {
        code: response.data.code || cid,
        description:
          response.data.title?.['@value'] || response.data.title || '',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.omsTokenService.invalidateToken();

        const newToken = await this.omsTokenService.getValidToken();
        const retryResponse = await axios.get(
          `https://id.who.int/icd/entity/${cid}`,
          {
            headers: {
              accept: 'application/json',
              'API-Version': 'v2',
              'Accept-Language': 'pt',
              Authorization: `Bearer ${newToken}`,
            },
          },
        );

        if (!retryResponse.data) {
          return null;
        }

        return {
          code: retryResponse.data.code || cid,
          description:
            retryResponse.data.title?.['@value'] ||
            retryResponse.data.title ||
            '',
        };
      }

      throw error;
    }
  }
}
