import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { AuthenticateService } from '@/core/application/services/authenticate.service';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { WrongCredentialsError } from '@/core/application/services/erros/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.email({
    message: 'E-mail format invalid.',
  }),
  password: z.string({
    error: 'Password is required.',
  }),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema);

@Controller('auth')
@Public()
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) bodyRequest: AuthenticateBodySchema) {
    const { email, password } = bodyRequest;

    const result = await this.authenticateService.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException({
            type_error: 'wrong_credentials',
            message: 'E-mail ou senha inválidos',
          });
        case EntityNotFoundError:
          throw new UnauthorizedException({
            type_error: 'user_not_found',
            message: 'Usuário não encontrado',
          });
        default:
          throw new BadRequestException({
            type_error: 'default_bad_request',
            message: 'Erro ao autenticar usuário',
          });
      }
    }

    return result.value;
  }
}
