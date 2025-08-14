import { CurrentUser } from '@/common/decorators/user.decorator';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { ForbiddenError } from '@/core/application/services/erros/forbidden.error';
import { ToggleColaboratorStatusService } from '@/core/application/services/toggle-colaborator-status.service';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('colaborators/toggle-status/:id')
export class ToggleColaboratorStatusController {
  constructor(
    private readonly toggleColaboratorStatusService: ToggleColaboratorStatusService,
  ) {}

  @Put()
  @HttpCode(201)
  async handle(
    @Param('id') colaborator_id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.toggleColaboratorStatusService.execute({
      colaborator_id,
      user_id: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ForbiddenError:
          throw new UnauthorizedException({
            type_error: 'forbidden',
            message: 'Você não tem permissão para realizar esta ação.',
          });
        case EntityNotFoundError:
          throw new UnauthorizedException({
            type_error: 'user_not_found',
            message: 'Usuário não encontrado',
          });
        default:
          throw new BadRequestException({
            type_error: 'default_bad_request',
            message: 'Erro ao buscar usuário',
          });
      }
    }

    return result.value;
  }
}
