import { CurrentUser } from '@/common/decorators/user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { GetAllColaboratorsService } from '@/core/application/services/get-all-colaborators.service';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
} from '@nestjs/common';
import z from 'zod';

const queryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  itemsPerPage: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(z.number().min(1)),
  search: z.string().optional().default('').transform(String).pipe(z.string()),
});

const queryValidationPipe = new ZodValidationPipe(queryParamSchema);

type QueryParamsValues = z.infer<typeof queryParamSchema>;

@Controller('colaborators')
export class GetAllColaboratorsController {
  constructor(
    private readonly getAllColaboratorsService: GetAllColaboratorsService,
  ) {}

  @Get('all')
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe)
    { page, itemsPerPage, search }: QueryParamsValues,
  ) {
    const result = await this.getAllColaboratorsService.execute({
      user_id: user.sub,
      itemsPerPage,
      search,
      page,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityNotFoundError:
          throw new NotFoundException({
            type_error: 'company_not_found',
            message: 'Empresa não encontrada',
          });
        default:
          throw new BadRequestException({
            type_error: 'default_bad_request',
            message: 'Erro ao buscar colaboradores',
          });
      }
    }

    return result.value;
  }
}
