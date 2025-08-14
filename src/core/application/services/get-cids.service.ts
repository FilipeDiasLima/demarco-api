import { OMSTokenService } from '@/core/application/services/oms-token.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface CIDRequest {
  search: string;
}

@Injectable()
export class GetCIDsService {
  constructor(private readonly omsTokenService: OMSTokenService) {}

  async execute({
    search,
  }: CIDRequest): Promise<{ code: string; description: string }[]> {
    try {
      const token = await this.omsTokenService.getValidToken();

      const response = await axios.get(
        `https://id.who.int/icd/entity/search?q=${search}&useFlexisearch=false&flatResults=true&releaseId=2025-01&highlightingEnabled=true`,
        {
          headers: {
            accept: 'application/json',
            'API-Version': 'v2',
            'Accept-Language': 'pt',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.destinationEntities.map((cid: any) => ({
        code: cid.id.split('/').pop(),
        description: cid.title,
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.omsTokenService.invalidateToken();

        const newToken = await this.omsTokenService.getValidToken();
        const retryResponse = await axios.get(
          `https://id.who.int/icd/entity/search?q=${search}&useFlexisearch=false&flatResults=true&releaseId=2025-01&highlightingEnabled=true`,
          {
            headers: {
              accept: 'application/json',
              'API-Version': 'v2',
              'Accept-Language': 'pt',
              Authorization: `Bearer ${newToken}`,
            },
          },
        );

        return retryResponse.data.destinationEntities.map((cid: any) => ({
          code: cid.id.split('/').pop(),
          description: cid.title,
        }));
      }

      throw error;
    }
  }
}
