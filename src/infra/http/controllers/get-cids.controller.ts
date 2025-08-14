import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { GetCIDsService } from '@/core/application/services/get-cids.service';
import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import z from 'zod';

const searchQuerySchema = z.object({
  search: z
    .string({
      error: 'Search is required.',
    })
    .min(1, { message: 'Search cannot be empty.' })
    .max(100, { message: 'Search must have a max 100 characters.' }),
});

type SearchQuerySchema = z.infer<typeof searchQuerySchema>;

const queryValidationPipe = new ZodValidationPipe(searchQuerySchema);

@Controller('cids')
export class GetCIDsController {
  constructor(private readonly getCIDsService: GetCIDsService) {}

  @Get('search')
  @HttpCode(200)
  async handle(@Query(queryValidationPipe) queryRequest: SearchQuerySchema) {
    const result = await this.getCIDsService.execute({
      search: queryRequest.search,
    });

    return {
      cids: result,
    };
  }
}
