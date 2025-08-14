import { CurrentUser } from '@/common/decorators/user.decorator';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { GetUserService } from '@/core/application/services/get-user.service';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';

@Controller('user')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getUserService.execute({
      userId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityNotFoundError:
          throw new NotFoundException({
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
