import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { GetCIDByIdService } from '@/core/application/services/get-cid-by-id.service';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import z from 'zod';

const cidParamSchema = z.object({
  cid: z
    .string({
      error: 'CID is required.',
    })
    .min(1, { message: 'CID cannot be empty.' })
    .max(50, { message: 'CID must have a max 50 characters.' }),
});

type CidParamSchema = z.infer<typeof cidParamSchema>;

const paramValidationPipe = new ZodValidationPipe(cidParamSchema);

@Controller('cids')
export class GetCIDByIdController {
  constructor(private readonly getCIDByIdService: GetCIDByIdService) {}

  @Get(':cid')
  @HttpCode(200)
  async handle(@Param(paramValidationPipe) paramRequest: CidParamSchema) {
    try {
      const result = await this.getCIDByIdService.execute({
        cid: paramRequest.cid,
      });

      if (!result) {
        throw new NotFoundException({
          type_error: 'cid_not_found',
          message: 'Nenhum CID encontrado.',
        });
      }

      return {
        cid: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        type_error: 'cid_fetch_failed',
        message: 'Nenhum CID encontrado.',
      });
    }
  }
}
