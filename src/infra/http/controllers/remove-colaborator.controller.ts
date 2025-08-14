import { CurrentUser } from '@/common/decorators/user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { RemoveColaboratorService } from '@/core/application/services/remove-colaborator.service';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import z from 'zod';

const paramSchema = z.object({
  id: z
    .string({
      error: 'ID é obrigatório.',
    })
    .min(1, { message: 'ID não pode estar vazio.' }),
});

type ParamSchema = z.infer<typeof paramSchema>;

const paramValidationPipe = new ZodValidationPipe(paramSchema);

@Controller('colaborators')
export class RemoveColaboratorController {
  constructor(
    private readonly removeColaboratorService: RemoveColaboratorService,
  ) {}

  @Delete(':id')
  @HttpCode(200)
  async handle(
    @Param(paramValidationPipe) paramRequest: ParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.removeColaboratorService.execute({
      colaboratorId: paramRequest.id,
      userId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityNotFoundError:
          if (error.message.includes('Company')) {
            throw new NotFoundException({
              type_error: 'empresa_nao_encontrada',
              message: 'Empresa do usuário não foi encontrada',
            });
          }
          if (error.message.includes('Colaborator')) {
            throw new NotFoundException({
              type_error: 'colaborador_nao_encontrado',
              message:
                'Colaborador não encontrado ou não pertence à sua empresa',
            });
          }
          throw new NotFoundException({
            type_error: 'entidade_nao_encontrada',
            message: 'Recurso não encontrado',
          });
        default:
          throw new BadRequestException({
            type_error: 'erro_interno',
            message: 'Erro interno do servidor',
          });
      }
    }

    return result.value;
  }
}
