import { CurrentUser } from '@/common/decorators/user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { CreateMedicalCertificateService } from '@/core/application/services/create-medical-certificate.service';
import { EntityAlreadyExistsError } from '@/core/application/services/erros/entity-already-exists.error';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import dayjs from 'dayjs';
import z from 'zod';

const createBodySchema = z.object({
  collaboratorId: z
    .string({
      error: 'Collaborator ID is required.',
    })
    .min(1, { message: 'Collaborator ID cannot be empty.' }),
  certificateDateTime: z.string({
    error: 'Certificate date time is required.',
  }),
  leaveDays: z
    .number({
      error: 'Leave days is required.',
    })
    .int({ message: 'Leave days must be an integer.' })
    .min(1, { message: 'Leave days must be at least 1.' })
    .max(365, { message: 'Leave days cannot exceed 365.' }),
  cid: z.object({
    code: z
      .string({
        error: 'CID code is required.',
      })
      .min(1, { message: 'CID code cannot be empty.' }),
    description: z
      .string({
        error: 'CID description is required.',
      })
      .min(1, { message: 'CID description cannot be empty.' }),
  }),
  notes: z.string().optional().nullable(),
});

type CreateBodySchema = z.infer<typeof createBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createBodySchema);

@Controller('medical-certificates')
export class CreateMedicalCertificateController {
  constructor(
    private readonly createMedicalCertificateService: CreateMedicalCertificateService,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.createMedicalCertificateService.execute({
      collaboratorId: body.collaboratorId,
      certificateDateTime: dayjs(body.certificateDateTime).toDate(),
      leaveDays: body.leaveDays,
      cid: body.cid,
      notes: body.notes || undefined,
      user_id: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityAlreadyExistsError:
          if (error.message.includes('User')) {
            throw new NotFoundException({
              type_error: 'user_company_not_found',
              message: 'Usuário não encontrado ou não pertence a uma empresa',
            });
          }
          if (
            error.message.includes('Colaborator') &&
            error.message.includes('id')
          ) {
            throw new NotFoundException({
              type_error: 'collaborator_not_found',
              message: 'Colaborador não encontrado',
            });
          }
          if (error.message.includes('company_mismatch')) {
            throw new BadRequestException({
              type_error: 'collaborator_company_mismatch',
              message: 'Colaborador não pertence a sua empresa',
            });
          }
          throw new ConflictException({
            type_error: 'entity_already_exists',
            message: 'Certificado médico já existe',
          });
        case EntityNotFoundError:
          throw new NotFoundException({
            type_error: 'entity_not_found',
            message: 'Certificado médico não encontrado',
          });
        default:
          throw new BadRequestException({
            type_error: 'default_bad_request',
            message: 'Erro ao criar certificado médico',
          });
      }
    }

    return result.value;
  }
}
