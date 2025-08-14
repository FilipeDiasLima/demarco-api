import { CurrentUser } from '@/common/decorators/user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { CreateColaboratorService } from '@/core/application/services/create-colaborator.service';
import { EntityAlreadyExistsError } from '@/core/application/services/erros/entity-already-exists.error';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { isValidCPF } from '@/utils/cpf-validator';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';

const createBodySchema = z.object({
  fullname: z
    .string({
      error: 'Fullname is required.',
    })
    .max(60, { message: 'Fullname must have a max 100 caracters.' }),
  role: z.string(),
  birthdate: z
    .string({
      error: 'Birthdate is required.',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Birthdate must be in the format YYYY-MM-DD.',
    }),
  cpf: z
    .string({
      error: 'CPF is required.',
    })
    .length(11, {
      message: 'CPF format is invalid.',
    })
    .refine(isValidCPF, {
      message: 'CPF inválido',
    }),
});

type CreateBodySchema = z.infer<typeof createBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createBodySchema);

@Controller('colaborators')
export class CreateColaboratorController {
  constructor(
    private readonly createColaboratorService: CreateColaboratorService,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) bodyRequest: CreateBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.createColaboratorService.execute({
      ...bodyRequest,
      user_id: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityAlreadyExistsError:
          throw new ConflictException({
            type_error: 'cpf_already_exists',
            message: 'CPF já existe',
          });
        case EntityNotFoundError:
          throw new NotFoundException({
            type_error: 'company_not_found',
            message: 'Empresa não encontrada',
          });
        default:
          throw new BadRequestException({
            type_error: 'default_bad_request',
            message: 'Erro ao criar colaborador',
          });
      }
    }

    return result.value;
  }
}
