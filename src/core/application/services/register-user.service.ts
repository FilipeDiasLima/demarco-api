import { Encrypter } from '@/core/application/cryptography/encrypter';
import { HasherGenerator } from '@/core/application/cryptography/hasher-generator';
import { UserRepository } from '@/core/application/repositories/user-repository';
import { EntityAlreadyExistsError } from '@/core/application/services/erros/entity-already-exists.error';
import { Either, left, right } from '@/core/either';
import { User } from '@/core/entities/user';
import { Injectable } from '@nestjs/common';

interface RegisterUseCaseRequest {
  companyName: string;
  fullname: string;
  email: string;
  password: string;
  birthdate: string;
  cpf: string;
}

type RegisterUseCaseResponse = Either<
  EntityAlreadyExistsError,
  {
    user: User;
    access_token: string;
  }
>;

@Injectable()
export class RegisterUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HasherGenerator,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    fullname,
    companyName,
    email,
    password,
    birthdate,
    cpf,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const emailFound = await this.userRepository.findByEmail(email);

    if (emailFound) {
      return left(
        new EntityAlreadyExistsError({
          entity: 'User',
          identifier: 'email',
          value: email,
        }),
      );
    }

    const cpfFound = await this.userRepository.findByCpf(cpf);

    if (cpfFound) {
      return left(
        new EntityAlreadyExistsError({
          entity: 'User',
          identifier: 'cpf',
          value: cpf,
        }),
      );
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      fullname,
      email,
      birthdate,
      password: hashedPassword,
      cpf,
      role: 'admin',
    });

    const newUser = await this.userRepository.create(user, companyName);

    const access_token = await this.encrypter.encrypt({
      sub: newUser.id,
    });

    return right({
      user: newUser,
      access_token,
    });
  }
}
