import { CurrentUser } from '@/common/decorators/user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { GetAllMedicalCertificatesService } from '@/core/application/services/get-all-medical-certificates.service';
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

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
  itemsPerPage: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Items per page must be between 1 and 100',
    }),
  search: z.string().optional().default(''),
});

type QuerySchema = z.infer<typeof querySchema>;

const queryValidationPipe = new ZodValidationPipe(querySchema);

@Controller('medical-certificates')
export class GetAllMedicalCertificatesController {
  constructor(
    private readonly getAllMedicalCertificatesService: GetAllMedicalCertificatesService,
  ) {}

  @Get('all')
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) queryRequest: QuerySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.getAllMedicalCertificatesService.execute({
      paginationParams: {
        page: queryRequest.page,
        itemsPerPage: queryRequest.itemsPerPage,
        search: queryRequest.search,
      },
      userId: user.sub,
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
            message: 'Erro ao buscar certificados médicos',
          });
      }
    }

    return result.value;
  }
}
