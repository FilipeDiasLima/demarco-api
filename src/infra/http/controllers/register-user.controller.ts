import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe';
import { EntityAlreadyExistsError } from '@/core/application/services/erros/entity-already-exists.error';
import { RegisterUserService } from '@/core/application/services/register-user.service';
import { Public } from '@/infra/auth/public';
import { isValidCPF } from '@/utils/cpf-validator';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';

const registerBodySchema = z.object({
  companyName: z
    .string({
      error: 'Company name is required.',
    })
    .min(3, {
      message: 'Company name must have a minimum length of 3 characters.',
    }),
  fullname: z
    .string({
      error: 'Fullname is required.',
    })
    .max(60, { message: 'Fullname must have a max 100 caracters.' }),
  email: z.email({
    message: 'E-mail format invalid.',
  }),
  birthdate: z
    .string({
      error: 'Birthdate is required.',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Birthdate must be in the format YYYY-MM-DD.',
    }),
  password: z
    .string({
      error: 'Password is required.',
    })
    .min(6, {
      message: 'Password must have a minimum 6 caracters.',
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

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerBodySchema);

@Controller('register')
@Public()
export class RegisterUserController {
  constructor(private readonly registerUserService: RegisterUserService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) bodyRequest: RegisterBodySchema) {
    const result = await this.registerUserService.execute(bodyRequest);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityAlreadyExistsError:
          if (error.message.includes('cpf'))
            throw new ConflictException({
              type_error: 'cpf_already_exists',
              message: 'CPF já cadastrado',
            });
          else
            throw new ConflictException({
              type_error: 'email_already_exists',
              message: 'E-mail já cadastrado',
            });
        default:
          throw new BadRequestException({
            type_error: 'default_bad_request',
            message: 'Erro ao cadastrar usuário',
          });
      }
    }

    return result.value;
  }
}
