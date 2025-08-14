import { Encrypter } from '@/core/application/cryptography/encrypter';
import { HasherComparer } from '@/core/application/cryptography/hasher-comparer';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityNotFoundError } from '@/core/application/services/erros/entity-not-found-error';
import { WrongCredentialsError } from '@/core/application/services/erros/wrong-credentials-error';
import { Either, left, right } from '@/core/either';
import { User } from '@/core/entities/user';
import { Injectable } from '@nestjs/common';

interface AuthenticateRequest {
  email: string;
  password: string;
}

type AuthenticateResponse = Either<
  EntityNotFoundError,
  {
    user: User;
    access_token: string;
  }
>;

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
    private hashComparer: HasherComparer,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return left(
        new EntityNotFoundError({
          entity: 'User',
        }),
      );
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password!,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const access_token = await this.encrypter.encrypt({
      sub: user.id,
    });

    return right({
      user,
      access_token,
    });
  }
}
